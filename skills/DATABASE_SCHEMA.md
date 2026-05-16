# DATABASE SCHEMA — Tin Radar

## 1. PostgreSQL 16

### 1.1 ER Diagram

```
trends ─────────< articles
  │                  
  └──────────── stories
                    │
              story_snapshots
```

### 1.2 Tables

#### `trends`

Lưu trữ các keyword trending từ Google Trends.

```sql
CREATE TABLE trends (
  id              BIGSERIAL PRIMARY KEY,
  keyword         VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) NOT NULL UNIQUE,
  traffic         INTEGER NOT NULL DEFAULT 0,         -- Lượng tìm kiếm (parsed từ "5K+" → 5000)
  category        VARCHAR(50),                        -- AI-classified: "Tài chính", "Thể thao"...
  picture_url     TEXT,                               -- Thumbnail từ Google Trends
  picture_source  VARCHAR(100),                       -- Nguồn ảnh
  trend_date      DATE NOT NULL,                      -- Ngày trending
  first_seen_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Lần đầu xuất hiện
  last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Lần cuối xuất hiện trong RSS
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,      -- Còn trending không
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trends_slug ON trends(slug);
CREATE INDEX idx_trends_active ON trends(is_active, traffic DESC);
CREATE INDEX idx_trends_category ON trends(category, is_active);
CREATE INDEX idx_trends_date ON trends(trend_date DESC);
CREATE INDEX idx_trends_keyword ON trends(keyword);
```

#### `articles`

Lưu các bài báo liên quan đến mỗi trend.

```sql
CREATE TABLE articles (
  id              BIGSERIAL PRIMARY KEY,
  trend_id        BIGINT NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  source_name     VARCHAR(100) NOT NULL,              -- "VnExpress", "CafeF"...
  source_url      TEXT,                               -- Domain URL nguồn
  article_url     TEXT NOT NULL,                      -- URL bài gốc
  google_url      TEXT,                               -- Google News redirect URL
  snippet         TEXT,                               -- Mô tả ngắn / first paragraph
  picture_url     TEXT,                               -- Ảnh thumbnail
  published_at    TIMESTAMPTZ,                        -- Thời gian bài đăng
  fetched_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(), -- Thời gian crawl
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique constraint: tránh duplicate bài
CREATE UNIQUE INDEX idx_articles_unique ON articles(trend_id, article_url);
CREATE INDEX idx_articles_trend ON articles(trend_id, published_at DESC);
CREATE INDEX idx_articles_source ON articles(source_name);
```

#### `stories`

Lưu nội dung AI-generated cho mỗi trend (story page).

```sql
CREATE TABLE stories (
  id                  BIGSERIAL PRIMARY KEY,
  trend_id            BIGINT NOT NULL REFERENCES trends(id) ON DELETE CASCADE,
  slug                VARCHAR(255) NOT NULL UNIQUE,       -- URL slug: "u23-viet-nam"
  keyword             VARCHAR(255) NOT NULL,
  category            VARCHAR(50),
  summary             TEXT,                               -- AI-generated summary (2-3 câu)
  traffic             INTEGER NOT NULL DEFAULT 0,
  article_count       INTEGER NOT NULL DEFAULT 0,
  source_count        INTEGER NOT NULL DEFAULT 0,
  meta_title          VARCHAR(255),                       -- SEO title
  meta_description    VARCHAR(320),                       -- SEO description
  og_image_url        TEXT,                               -- Open Graph image
  ai_model            VARCHAR(50),                        -- "claude-haiku-4-5-20251001"
  ai_batch_id         VARCHAR(100),                       -- Anthropic batch ID
  ai_generated_at     TIMESTAMPTZ,                        -- Khi nào AI generate summary
  is_published        BOOLEAN NOT NULL DEFAULT TRUE,
  first_published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_stories_slug ON stories(slug);
CREATE INDEX idx_stories_published ON stories(is_published, updated_at DESC);
CREATE INDEX idx_stories_category ON stories(category, is_published);
CREATE INDEX idx_stories_trend ON stories(trend_id);
```

#### `story_snapshots`

Lưu lịch sử thay đổi của story (cho feature "trend theo thời gian" post-MVP).

```sql
CREATE TABLE story_snapshots (
  id              BIGSERIAL PRIMARY KEY,
  story_id        BIGINT NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  traffic         INTEGER NOT NULL,
  article_count   INTEGER NOT NULL,
  summary         TEXT,
  snapshot_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_snapshots_story ON story_snapshots(story_id, snapshot_at DESC);
```

#### `ai_batch_jobs`

Tracking Anthropic Batch API jobs.

```sql
CREATE TABLE ai_batch_jobs (
  id              BIGSERIAL PRIMARY KEY,
  batch_id        VARCHAR(100) NOT NULL UNIQUE,       -- Anthropic batch_id
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, processing, completed, failed
  total_requests  INTEGER NOT NULL DEFAULT 0,
  completed_count INTEGER NOT NULL DEFAULT 0,
  failed_count    INTEGER NOT NULL DEFAULT 0,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_batch_jobs_status ON ai_batch_jobs(status);
CREATE INDEX idx_batch_jobs_submitted ON ai_batch_jobs(submitted_at DESC);
```

#### `cron_logs`

Log các cron job runs.

```sql
CREATE TABLE cron_logs (
  id              BIGSERIAL PRIMARY KEY,
  job_name        VARCHAR(100) NOT NULL,               -- "fetch-trends", "process-ai-batch"
  status          VARCHAR(20) NOT NULL,                 -- "started", "completed", "failed"
  duration_ms     INTEGER,
  metadata        JSONB,                                -- { trends_count, articles_count, ... }
  error_message   TEXT,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_cron_logs_job ON cron_logs(job_name, started_at DESC);
```

### 1.3 Migration Notes

- Dùng migration tool: **drizzle-orm** (recommended cho Next.js/Fastify stack) hoặc **node-pg-migrate**
- Migration files đặt tại `packages/db/migrations/`
- Seed data không cần (hệ thống tự fetch từ Google Trends)

---

## 2. Redis 7

### 2.1 Key Patterns

```
Namespace: tr:  (trend radar)

Cache keys:
  tr:radar:data                    → JSON: processed radar data cho homepage
                                     TTL: 600s (10 phút)

  tr:radar:data:{category}         → JSON: filtered radar data
                                     TTL: 600s

  tr:story:{slug}                  → JSON: story page data
                                     TTL: 900s (15 phút)

  tr:categories                    → JSON: category list + counts
                                     TTL: 1800s (30 phút)

RSS cache:
  tr:rss:trends                    → String: raw Google Trends RSS XML
                                     TTL: 1500s (25 phút)

  tr:rss:news:{keyword_slug}       → String: raw Google News RSS XML per keyword
                                     TTL: 1200s (20 phút)

Rate limiting:
  tr:ratelimit:gnews               → Counter: Google News requests in current window
                                     TTL: 60s

Queue (for batch processing):
  tr:queue:ai_pending              → List: trend_ids waiting for AI processing
  tr:queue:ai_processing           → Set: trend_ids currently being processed

Misc:
  tr:last_fetch                    → String: ISO timestamp of last successful trends fetch
  tr:batch:current                 → String: current Anthropic batch_id being processed
```

### 2.2 Cache Invalidation Strategy

```
Khi fetch trends mới:
  DEL tr:radar:data
  DEL tr:radar:data:*             → Xóa tất cả category caches

Khi AI batch complete cho 1 story:
  DEL tr:story:{slug}

Khi category counts thay đổi:
  DEL tr:categories

Pattern: Cache-aside
  1. Check Redis → nếu có, return
  2. Query PostgreSQL
  3. Write to Redis with TTL
  4. Return data
```

### 2.3 Redis Data Structures

#### `tr:radar:data` (String/JSON)

```json
{
  "trends": [
    {
      "id": 3,
      "keyword": "U23 Việt Nam",
      "slug": "u23-viet-nam",
      "traffic": 50000,
      "category": "Thể thao",
      "articleCount": 4,
      "topSource": "Bóng Đá",
      "pubDate": "2026-05-12T10:00:00Z",
      "pictureUrl": "..."
    }
  ],
  "stats": {
    "totalTrends": 10,
    "totalSearches": 160000,
    "totalSources": 11
  },
  "updatedAt": "2026-05-12T12:30:00Z"
}
```

#### `tr:story:{slug}` (String/JSON)

```json
{
  "keyword": "U23 Việt Nam",
  "slug": "u23-viet-nam",
  "category": "Thể thao",
  "traffic": 50000,
  "summary": "AI-generated summary...",
  "articles": [
    {
      "title": "U23 Việt Nam thắng 3-0...",
      "source": "Bóng Đá",
      "url": "https://...",
      "snippet": "...",
      "publishedAt": "2026-05-12T10:00:00Z"
    }
  ],
  "articleCount": 4,
  "sourceCount": 4,
  "updatedAt": "2026-05-12T12:30:00Z"
}
```

---

## 3. Data Lifecycle

```
Trend xuất hiện lần đầu:
  → INSERT trends (is_active = true)
  → INSERT articles
  → LPUSH tr:queue:ai_pending {trend_id}
  → Batch job picks up → generate summary → INSERT stories

Trend vẫn active (xuất hiện lại trong RSS):
  → UPDATE trends (traffic, last_seen_at)
  → UPSERT articles (có thể có bài mới)
  → Nếu có bài mới → LPUSH tr:queue:ai_pending (re-generate summary)

Trend biến mất khỏi RSS:
  → Sau 2 giờ không thấy: giữ is_active = true (có thể quay lại)
  → Sau 48 giờ: UPDATE is_active = false
  → Story page vẫn accessible vĩnh viễn (SEO value)

Cleanup (hàng ngày):
  → Archive trends older than 30 ngày (move to trends_archive nếu cần)
  → Xóa articles không link trend nào
  → Xóa cron_logs older than 7 ngày
```
