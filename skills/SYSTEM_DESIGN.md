# SYSTEM DESIGN — Tin Radar

## 1. Kiến trúc tổng quan

```
┌───────────────────────────────────────────────────────────────┐
│                         TURBOREPO                             │
│                                                               │
│  ┌─────────────────────┐    ┌──────────────────────────────┐  │
│  │   apps/web           │    │   apps/api                   │  │
│  │   Next.js 15 (SSR)   │◄──►│   Fastify                    │  │
│  │   - Radar View       │    │   - REST API                 │  │
│  │   - Story Page       │    │   - Cron Jobs                │  │
│  │   - SEO Pages        │    │   - AI Batch Processor       │  │
│  └─────────────────────┘    └──────────┬───────────────────┘  │
│                                         │                      │
│  ┌─────────────────────────────────────┐│                      │
│  │   packages/shared                    ││                      │
│  │   - types, utils, constants          ││                      │
│  └─────────────────────────────────────┘│                      │
│                                         │                      │
└─────────────────────────────────────────┼──────────────────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
              ┌─────▼─────┐        ┌──────▼──────┐      ┌──────▼──────┐
              │ PostgreSQL │        │    Redis     │      │  External   │
              │    16      │        │      7       │      │   APIs      │
              │            │        │              │      │             │
              │ - trends   │        │ - cache      │      │ - G.Trends  │
              │ - articles │        │ - rate limit │      │ - G.News    │
              │ - stories  │        │ - queue      │      │ - Claude AI │
              │ - batches  │        │ - sessions   │      │   (Haiku)   │
              └────────────┘        └──────────────┘      └─────────────┘
```

## 2. Data Pipeline — Thu thập tin tức

### 2.1 Pipeline tổng quan

```
Cron (mỗi 30 phút)
  │
  ├── Step 1: Fetch Google Trends RSS
  │   GET https://trends.google.com/trending/rss?geo=VN
  │   → Parse XML → Danh sách trending keywords
  │
  ├── Step 2: Với mỗi keyword, fetch Google News RSS
  │   GET https://news.google.com/rss/search?q={keyword}&hl=vi&gl=VN&ceid=VN:vi
  │   → Parse XML → Danh sách articles (title, source, url, snippet, pubDate)
  │
  ├── Step 3: Upsert vào PostgreSQL
  │   → trends table: keyword, traffic, category, picture
  │   → articles table: title, source, url, snippet, trend_id
  │
  ├── Step 4: Queue AI batch job
  │   → Redis queue: pending story generation/update
  │
  └── Step 5: Invalidate Redis cache
      → Delete cached radar data
      → Delete cached story pages cho trends đã update
```

### 2.2 Google Trends RSS Parser

```
URL: https://trends.google.com/trending/rss?geo=VN

Response format (XML):
<item>
  <title>{keyword}</title>
  <ht:approx_traffic>{traffic_string}</ht:approx_traffic>   // "500+", "5K+", "20K+"
  <pubDate>{RFC 2822 date}</pubDate>
  <ht:picture>{image_url}</ht:picture>
  <ht:picture_source>{source_name}</ht:picture_source>
  <ht:news_item>
    <ht:news_item_title>{article_title}</ht:news_item_title>
    <ht:news_item_url>{article_url}</ht:news_item_url>
    <ht:news_item_source>{source_name}</ht:news_item_source>
    <ht:news_item_picture>{image_url}</ht:news_item_picture>
  </ht:news_item>
  <!-- có thể có nhiều news_item -->
</item>
```

**Xử lý traffic string:**
```
"500+"   → 500
"5K+"    → 5000
"20K+"   → 20000
"100K+"  → 100000
"1M+"    → 1000000
```

### 2.3 Google News RSS Parser

```
URL: https://news.google.com/rss/search?q={encodeURIComponent(keyword)}&hl=vi&gl=VN&ceid=VN:vi

Response format (XML):
<item>
  <title>{article_title} - {source_name}</title>    // Note: source nằm cuối title, sau " - "
  <link>{google_redirect_url}</link>                 // URL redirect qua Google
  <pubDate>{RFC 2822 date}</pubDate>
  <description>{html_snippet}</description>          // Có thể chứa HTML tags
  <source url="{source_domain}">{source_name}</source>
</item>
```

**Lưu ý:**
- Title chứa source name cuối cùng sau " - ", cần strip ra
- Link là Google redirect URL, cần extract real URL hoặc lưu cả hai
- Description có thể chứa HTML, cần sanitize/strip tags
- Nên limit lấy 10-15 articles per keyword để tránh quá nhiều
- Deduplicate articles theo URL (cùng bài có thể xuất hiện ở nhiều keyword)

### 2.4 Rate Limiting & Caching

```
Google Trends RSS:
  - Fetch mỗi 30 phút (cron)
  - Cache response trong Redis, TTL = 25 phút
  - Nếu fetch fail → serve from cache

Google News RSS:
  - Fetch theo keyword, max 20 keywords/batch
  - Rate limit: 1 request/second (delay giữa các keyword)
  - Cache response theo keyword, TTL = 20 phút
  - Nếu fetch fail cho 1 keyword → skip, dùng data cũ

Redis cache keys:
  - trends:rss:raw          → raw RSS response, TTL 25m
  - trends:radar:data       → processed radar data (API response), TTL 10m
  - news:keyword:{slug}     → news articles per keyword, TTL 20m
  - story:{slug}            → generated story page data, TTL 15m
```

---

## 3. AI Batch Processing — Tối ưu chi phí

### 3.1 Chiến lược chi phí

**Nguyên tắc: Dùng Claude Haiku qua Batch API để giảm chi phí tối đa.**

```
So sánh chi phí (tham khảo):
  Claude Sonnet (realtime):   $3/1M input + $15/1M output
  Claude Haiku (realtime):    $0.25/1M input + $1.25/1M output
  Claude Haiku (batch):       $0.125/1M input + $0.625/1M output    ← DÙNG CÁI NÀY

  → Batch Haiku rẻ hơn Sonnet realtime ~48 lần
```

### 3.2 Batch Job Flow

```
Cron trigger (sau khi fetch xong trends + news)
  │
  ├── 1. Scan pending stories
  │     SELECT trends chưa có story hoặc story cần update
  │     (articles mới hơn last_ai_generated_at)
  │
  ├── 2. Build batch request
  │     Gom tất cả pending stories thành 1 batch
  │     Mỗi item = 1 prompt với articles của trend đó
  │
  ├── 3. Submit Anthropic Batch API
  │     POST /v1/messages/batches
  │     model: "claude-haiku-4-5-20251001"
  │     Mỗi request trong batch:
  │       - System prompt: quy tắc tóm lược
  │       - User message: articles data
  │       - Max tokens: 500
  │
  ├── 4. Poll batch status
  │     GET /v1/messages/batches/{batch_id}
  │     Poll mỗi 30 giây cho đến khi completed
  │     Batch API đảm bảo hoàn thành trong 24h (thường < 1h)
  │
  ├── 5. Process results
  │     Parse response → extract summary + category
  │     Upsert vào stories table
  │
  └── 6. Invalidate cache
        Delete story:{slug} cho các stories đã update
```

### 3.3 AI Prompts

#### Prompt: Tóm lược + Phân loại

```
System prompt:
---
Bạn là hệ thống tóm lược tin tức tự động cho trang Tin Radar.
Nhiệm vụ: Đọc danh sách bài báo về cùng một chủ đề trending, và trả về JSON.

Quy tắc:
1. summary: Viết 2-3 câu tiếng Việt tóm lược sự kiện. Khách quan, không thiên vị.
   Nêu fact chính, số liệu nếu có, và lý do chủ đề đang hot.
2. category: Phân loại vào đúng 1 danh mục: "Kinh doanh", "Tài chính", "Thể thao",
   "Công nghệ", "Xã hội", "Giải trí", "Đời sống"
3. Chỉ trả về JSON, không text khác.

Response format:
{"summary": "...", "category": "..."}
---

User message:
---
Keyword trending: "{keyword}"
Lượng tìm kiếm: {traffic}

Các bài báo:
1. [{source}] {title}
   {snippet}

2. [{source}] {title}
   {snippet}

...
---
```

#### Ước tính chi phí

```
Mỗi trend:
  Input:  ~400 tokens (prompt + 3-5 articles)
  Output: ~80 tokens (summary + category JSON)

Mỗi batch (10 trends):
  Input:  ~4,000 tokens
  Output: ~800 tokens

Mỗi ngày (48 batch runs × 10 trends):
  Input:  ~192,000 tokens
  Output: ~38,400 tokens

Chi phí Batch Haiku/ngày:
  Input:  192K × $0.125/1M = $0.024
  Output: 38K × $0.625/1M  = $0.024
  Total:  ~$0.05/ngày = ~$1.5/tháng

→ Cực kỳ rẻ. Ngay cả nếu scale lên 50 trends/batch × 48 runs, chỉ ~$7.5/tháng.
```

### 3.4 Fallback nếu Batch API chậm

Batch API có SLA 24h nhưng thường nhanh hơn. Tuy nhiên, để đảm bảo UX:

```
Nếu trend mới chưa có AI summary:
  → Hiển thị snippet của bài đầu tiên làm summary tạm
  → Khi batch hoàn thành, cập nhật summary thật
  → Invalidate cache

Nếu cần real-time (trend đột biến, traffic > 100K):
  → Gọi Haiku realtime (vẫn rẻ: $0.25/1M input)
  → Không chờ batch
```

---

## 4. SEO Strategy

### 4.1 URL Structure

```
Trang chủ:
  /                                         → Radar View

Story pages (SEO-critical):
  /xu-huong/{slug}                          → Story Page
  Ví dụ:
    /xu-huong/u23-viet-nam                  → story về U23 Việt Nam
    /xu-huong/gia-vang-sjc-lap-dinh         → story về giá vàng
    /xu-huong/bitcoin-vuot-104000-usd       → story về Bitcoin
    /xu-huong/sun-group-dien-bien-2026      → story về Sun Group

Category pages:
  /danh-muc/tai-chinh                       → Trends trong danh mục Tài chính
  /danh-muc/the-thao
  /danh-muc/cong-nghe

Sitemap:
  /sitemap.xml                              → Auto-generated
```

### 4.2 Slug Generation

```typescript
function generateSlug(keyword: string, context?: string): string {
  // 1. Chuyển tiếng Việt sang không dấu
  //    "Giá vàng SJC lập đỉnh" → "gia-vang-sjc-lap-dinh"
  
  // 2. Nếu keyword ngắn (1-2 từ), append context từ bài đầu tiên
  //    "Bitcoin" + "vượt 104000 USD" → "bitcoin-vuot-104000-usd"
  
  // 3. Lowercase, replace spaces/special chars → hyphens
  
  // 4. Remove duplicate hyphens, trim
  
  // 5. Max 80 chars
  
  // 6. Đảm bảo unique: nếu trùng, append date suffix
  //    "bitcoin-vuot-104000-usd" → "bitcoin-vuot-104000-usd-2026-05-12"
}
```

**Quy tắc slug:**
- Tiếng Việt không dấu, lowercase, hyphen-separated
- Mang ý nghĩa ngữ cảnh (không chỉ keyword, mà có thêm mô tả ngắn)
- Ngắn gọn, dễ đọc, dễ share
- Unique per story (append date nếu trùng)
- Sử dụng thư viện `slugify` có hỗ trợ Vietnamese (ví dụ: `@sindresorhus/slugify` hoặc custom)

### 4.3 Meta Tags (Next.js Metadata API)

```typescript
// app/xu-huong/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const story = await getStory(params.slug);
  
  return {
    title: `${story.keyword} — Tin Radar`,
    description: story.summary,  // AI-generated summary
    openGraph: {
      title: `${story.keyword} — Xu hướng tìm kiếm`,
      description: story.summary,
      type: 'article',
      publishedTime: story.created_at,
      modifiedTime: story.updated_at,
      section: story.category,
      url: `https://diemnong.vn/xu-huong/${story.slug}`,
      images: [story.og_image_url],  // Generated OG image
    },
    alternates: {
      canonical: `https://diemnong.vn/xu-huong/${story.slug}`,
    },
  };
}
```

### 4.4 Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "U23 Việt Nam — Xu hướng tìm kiếm",
  "description": "AI-generated summary...",
  "datePublished": "2026-05-12T10:00:00Z",
  "dateModified": "2026-05-12T12:00:00Z",
  "author": {
    "@type": "Organization",
    "name": "Tin Radar"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Tin Radar",
    "logo": { "@type": "ImageObject", "url": "..." }
  },
  "mainEntityOfPage": "https://diemnong.vn/xu-huong/u23-viet-nam",
  "about": {
    "@type": "Thing",
    "name": "U23 Việt Nam"
  }
}
```

### 4.5 SSR & ISR Strategy

```
Trang chủ (/):
  → ISR (Incremental Static Regeneration)
  → revalidate: 300 (5 phút)
  → Nhanh cho user, vẫn cập nhật thường xuyên

Story page (/xu-huong/[slug]):
  → ISR
  → revalidate: 600 (10 phút)
  → generateStaticParams: pre-render top 20 stories

Category page (/danh-muc/[category]):
  → ISR
  → revalidate: 300

Sitemap (/sitemap.xml):
  → Dynamic, generate từ DB
  → Include tất cả active story pages
  → Update tự động khi có trend mới
```

### 4.6 Additional SEO

- **robots.txt**: Allow all, point to sitemap
- **Internal linking**: Story page link đến related trends (cùng category)
- **Breadcrumbs**: Trang chủ > Danh mục > Story
- **Performance**: Target Core Web Vitals LCP < 2.5s, CLS < 0.1
- **Mobile-friendly**: Responsive design (xem DESIGN_UIUX.md)

---

## 5. API Design (Fastify)

### 5.1 Public API (cho Next.js frontend)

```
GET /api/v1/radar
  Query: ?category={slug}&sort={traffic|time}&limit={number}
  Response: { trends: [...], stats: { total, totalSearches, totalSources }, updatedAt }
  Cache: Redis 10 phút

GET /api/v1/stories/{slug}
  Response: { story: { keyword, slug, category, traffic, summary, articles: [...], timeline: [...] }, updatedAt }
  Cache: Redis 15 phút

GET /api/v1/categories
  Response: { categories: [{ slug, name, count }] }
  Cache: Redis 30 phút
```

### 5.2 Internal API (cron jobs, admin)

```
POST /internal/jobs/fetch-trends
  → Trigger pipeline fetch trends + news
  Auth: Internal API key

POST /internal/jobs/process-ai-batch
  → Trigger AI batch processing
  Auth: Internal API key

GET /internal/jobs/batch-status/{batchId}
  → Check Anthropic batch status
  Auth: Internal API key
```

---

## 6. Cron Schedule

```
*/30 * * * *    fetch-trends          Fetch Google Trends + News RSS
*/30 * * * *    process-ai-batch      Submit pending stories to Batch API (chạy sau fetch 5 phút)
*/5  * * * *    check-batch-results   Poll Anthropic batch status, process completed
0    * * * *    cleanup-old-trends    Archive trends older than 48 hours
0    3 * * *    generate-sitemap      Regenerate sitemap.xml
```

---

## 7. Error Handling & Monitoring

### 7.1 Retry Strategy

```
Google Trends/News RSS fetch:
  → Retry 3 lần, backoff 5s/15s/30s
  → Nếu vẫn fail: serve cached data, log error

Anthropic Batch API:
  → Batch API tự retry internally
  → Nếu batch fail: fallback sang realtime Haiku cho top 5 trends
  → Log batch failure

Database writes:
  → Retry 2 lần
  → Nếu fail: log + alert, data sẽ được pick up ở batch tiếp theo
```

### 7.2 Logging

```
Structured JSON logging:
{
  "level": "info|warn|error",
  "service": "api|cron|ai-batch",
  "event": "fetch_trends|process_batch|generate_story",
  "duration_ms": 1234,
  "metadata": { "keyword": "...", "articles_count": 5 }
}
```

### 7.3 Health Check

```
GET /health
  Response: {
    status: "ok",
    db: "connected",
    redis: "connected",
    lastTrendsFetch: "2026-05-12T10:30:00Z",
    lastBatchCompleted: "2026-05-12T10:35:00Z",
    activeTrends: 10
  }
```
