# DESIGN UI/UX — Tin Radar

## 1. Design Philosophy

**Phong cách: Editorial** — Lấy cảm hứng từ báo chí cao cấp (NYT, The Economist). Typography là nhân vật chính. Uy tín, đáng tin cậy, đọc lâu không mỏi mắt.

**Bố cục: Treemap Hero + Accordion Detail** — Trang chủ chia 3 tầng thông tin, mỗi tầng sâu hơn tầng trước:
1. Treemap mosaic: nhìn 1 giây biết cái gì đang hot nhất (diện tích = sức nóng)
2. Accordion list: scan nhanh toàn bộ trends, click mở xem preview
3. Story page: deep-dive đầy đủ với tóm lược AI, so sánh nguồn, timeline

**Nguyên tắc thiết kế:**
- Typography-first: Nội dung dẫn dắt, không phải hình ảnh
- Whitespace rộng rãi: Tạo cảm giác thở, thoáng đãng
- Restraint: Ít màu, ít effect, nội dung nổi bật
- Mobile-first: Thiết kế cho mobile trước, responsive lên desktop
- Data-visual: Treemap + progress bar + percentage giúp user đọc data bằng mắt

---

## 2. Design Tokens

### 2.1 Color Palette

```
Background:
  --bg-primary:     #FAFAF7      Nền chính (kem nhẹ, không trắng tinh)
  --bg-card:        #FFFFFF      Nền card, accordion content
  --bg-card-alt:    #FCFBF8      Nền accordion row chẵn (zebra stripe nhẹ)
  --bg-muted:       #F7F5F0      Hover state, summary box

Border:
  --border-primary: #E8E3D8      Border chính (card, divider, accordion)
  --border-light:   #EDE9E0      Border nhẹ
  --border-dark:    #1A1A1A      Masthead double border + footer

Text:
  --text-primary:   #1A1A1A      Heading, text chính
  --text-body:      #444444      Body text, snippet
  --text-muted:     #888888      Subtitle, timestamp
  --text-subtle:    #999999      Section label, metadata
  --text-disabled:  #BBBBBB      Inactive filter, chevron
  --text-rank:      #DDDDDD      Số ranking trong accordion

Category Colors (accent + light background):
  Thể thao:    accent #B83230   bg #FBEAEA
  Tài chính:   accent #C68A17   bg #FDF6E3   (vàng)
               accent #2568A8   bg #E3EFF8   (xanh, dùng cho crypto/chứng khoán)
  Kinh doanh:  accent #2D7D5F   bg #E8F5EE
  Công nghệ:   accent #5C6BC0   bg #EDEEF8   (tím-xanh)
               accent #00897B   bg #E0F2F1   (teal, dùng cho AI/startup)
  Giải trí:    accent #C44569   bg #FCE8EF
  Xã hội:      accent #A08520   bg #FAF5E4
  Đời sống:    accent #A08520   bg #FAF5E4

Source Colors (mỗi tòa soạn 1 màu nhận diện):
  CafeF:       #C68A17
  VnExpress:   #1A5276
  Tuổi Trẻ:    #C0392B
  Thanh Niên:  #1B6B4A
  GenK:        #7B3FA0
  Zing:        #C44569
  Dân Trí:     #117A65
  Bóng Đá:     #B83230
  VnReview:    #4A235A
  TTXVN:       #1B6B4A
  CoinDesk VN: #C68A17
```

### 2.2 Typography

```
Font stack:
  --font-display:  'Playfair Display', Georgia, serif       Heading lớn, rank number, treemap keyword
  --font-body:     'Source Serif 4', Georgia, serif          Body text, story content, article titles
  --font-ui:       'DM Sans', system-ui, sans-serif         UI elements: buttons, badges, metadata, traffic numbers

Hierarchy:
  Masthead title:       40px / 48px   font-display  weight 900  letter-spacing -0.03em
  Treemap main keyword: 28px          font-display  weight 800  line-height 1.15
  Treemap secondary:    17px          font-display  weight 800
  Story page h1:        34px / 40px   font-display  weight 800  line-height 1.2
  Accordion keyword:    15px          font-display  weight 700
  Article title:        15px          font-body     weight 700  line-height 1.45
  Body text:            15px          font-body     weight 400  line-height 1.75
  Snippet (expanded):   14px          font-body     weight 400  line-height 1.65
  Stats number:         22px          font-display  weight 800
  Traffic number:       13-14px       font-ui       weight 700
  Source badge:         11px          font-ui       weight 600
  Category label:       10px          font-ui       weight 700  uppercase  letter-spacing 0.12-0.15em
  Section divider:      11px          font-ui       weight 700  uppercase  letter-spacing 0.15em  color #BBB
  Timestamp:            11px          font-ui       weight 400  color #BBB
  Filter button:        12px          font-ui       weight 400-700
  Treemap small:        11-12px       font-ui       weight 700
  Treemap percentage:   28-56px       font-display  weight 900  opacity 0.12 (watermark)
```

### 2.3 Spacing

```
Page:
  padding:            20px (mobile) / 40px (desktop)
  max-width:          800px (centered)

Sections:
  masthead → stats:   24px
  stats → treemap:    22px
  treemap → accordion: 32px
  accordion → footer:  40px

Components:
  stats card padding:     12px 14px
  treemap gap:            6px
  accordion bar padding:  14px 20px
  accordion content:      12px 20px 20px, paddingLeft 64px (align with text, past rank+bar)
  story card padding:     16px 20px
  story card gap:         8px
```

### 2.4 Border & Shadow

```
Masthead:               3px double #1A1A1A (bottom)
Footer:                 3px double #1A1A1A (top)
Stats card:             1px solid #E8E3D8, border-radius 8px, shadow 0 1px 3px rgba(0,0,0,0.04)
Treemap block:          border-radius 12px (main/secondary), 10px (small)
Treemap shadow default: 0 2px 8px rgba(0,0,0,0.1) (main), 0 1px 4px rgba(0,0,0,0.08) (secondary)
Treemap shadow hover:   0 8px 30px {color}40 (main), 0 6px 20px {color}40 (secondary)
Accordion container:    1px solid #E8E3D8, border-radius 12px, shadow 0 1px 4px rgba(0,0,0,0.04)
Accordion row border:   1px solid #E8E3D8 (top, between rows)
Story source card:      1px solid #E8E3D8, border-radius 8px
Story source expanded:  border {accent}40, shadow 0 2px 12px rgba(0,0,0,0.06)
Story summary box:      1px solid #E8E3D8, border-left 4px solid {accent}, border-radius 4px
Story timeline card:    1px solid #E8E3D8, border-radius 8px, shadow 0 1px 4px rgba(0,0,0,0.04)
Section divider:        thin lines on both sides of text "──── Label ────"
```

### 2.5 Animation

```
Page transition:      translateY(12px) → 0, opacity 0 → 1, 0.4s ease-out
Treemap hover:        scale 1 → 1.01-1.05 (larger blocks scale less), 0.2s ease
Treemap shadow:       transition box-shadow 0.2s
Accordion expand:     max-height 0 → 400px, 0.4s ease (CSS transition, no JS animation)
Accordion chevron:    rotate 0 → 180deg, 0.3s
Source card expand:   opacity + translateY, 0.25s ease-out
Live dot:             opacity pulse 1 → 0.3 → 1, 2s infinite
Accordion hover:      background transition 0.25s
```

---

## 3. Page Structure & Components

### 3.1 Overall Page Layout

```
┌──────────────────────────────────────────────────┐
│                   MASTHEAD                        │
│         thứ hai, 12 tháng 5, 2026                │
│              Tin Radar                            │
│    Bản đồ dư luận VN — Cập nhật mỗi giờ          │
│══════════════════════════════════════════════════│
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │🔥 Trending│  │📊 Tổng    │  │📰 Nguồn  │       │  ← STATS BAR
│  │    8      │  │  160K+   │  │   11     │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│                                                   │
│  ──── Bản đồ sức nóng ──────────────────         │  ← SECTION DIVIDER
│                                                   │
│  ┌────────────┬─────────┐                        │
│  │            │ Giá vàng │                        │
│  │  U23 VN   │  22%     │                        │
│  │   31%     ├─────────┤                        │  ← TREEMAP HERO
│  │            │ Bitcoin  │                        │
│  │            │  13%     │                        │
│  │            ├──┬──┬───┤                        │
│  │            │BĐS│BP│iP │                        │
│  └────────────┴──┴──┴───┘                        │
│  ┌─── AI VN ──┬─── Sun ──┐                       │  ← EXTRA SMALL ROW
│  └────────────┴──────────┘                        │
│                                                   │
│  ──── Chi tiết từng xu hướng ────────────        │  ← SECTION DIVIDER
│                                                   │
│  ┌──────────────────────────────────────────┐    │
│  │ 1 │▌ ████░░ │ U23 Việt Nam  Thể thao 50K│    │
│  ├──────────────────────────────────────────┤    │
│  │ 2 │▌ ███░░░ │ Giá vàng    Tài chính 35K │    │  ← ACCORDION LIST
│  │   │  ● SJC lập đỉnh mới 98 triệu...     │    │     (row 2 expanded)
│  │   │  ● NHNN đấu thầu vàng bình ổn...     │    │
│  │   │  [Xem câu chuyện đầy đủ →]           │    │
│  ├──────────────────────────────────────────┤    │
│  │ 3 │▌ ██░░░░ │ Bitcoin    Tài chính  20K  │    │
│  └──────────────────────────────────────────┘    │
│                                                   │
│══════════════════════════════════════════════════│
│  Tin Radar — Google Trends · Cập nhật mỗi giờ   │  ← FOOTER
└──────────────────────────────────────────────────┘
```

### 3.2 Masthead

```
Position:       top, centered
Border bottom:  3px double #1A1A1A
Padding bottom: 14px
Content:
  Line 1: Date        → font-ui, 11px, uppercase, letter-spacing 0.2em, color #999
  Line 2: "Tin Radar" → font-display, 40px, weight 900, color #1A1A1A
  Line 3: Tagline     → font-body, 13px, italic, color #888
```

### 3.3 Stats Bar

```
Layout:   3 cards, flex wrap, gap 10px
Card:     bg white, border #E8E3D8, radius 8px, shadow subtle
Content:  icon + label (font-ui, 11px, #999) / value (font-display, 22px, weight 800)
```

### 3.4 Treemap Hero

**Section divider:** `──── Bản đồ sức nóng ── ô càng to, càng nhiều người quan tâm ────`

**Grid layout:**
```css
display: grid;
grid-template-columns: 1fr 1fr;
grid-template-rows: 160px 80px 80px;
gap: 6px;
```

**Cell types:**

| Cell | Grid position | Content |
|------|---------------|---------|
| Main (rank 1) | col 1, row 1-3 (full left) | cat label (uppercase) + keyword 28px + traffic + headline italic + pct watermark 56px |
| Secondary (rank 2-3) | col 2, row 1 & row 2 | cat label + keyword 17px + traffic + pct watermark 28px |
| Small (rank 4-6) | col 2, row 3 (flex row, 3 equal) | keyword 11px + traffic, centered |
| Extra small (rank 7+) | full width row below grid | keyword + traffic + cat, centered, flex equal |

**Styling:**
- Background: category accent color (solid, e.g. #B83230 for Thể thao)
- Text: white on colored background
- Percentage watermark: position absolute, top-right, opacity 0.12, font-display huge
- Hover: scale 1.01 (main) to 1.05 (small), shadow glow `0 8px 30px {color}40`
- Click: navigate to Story Page, scroll to top

### 3.5 Accordion List

**Container:** bg white, border #E8E3D8, radius 12px, shadow `0 1px 4px rgba(0,0,0,0.04)`, overflow hidden

**Each row (collapsed):**
```
flex row, align center, gap 12px, padding 14px 20px
Background: alternating #fff / #FCFBF8

Elements (left → right):
  1. Rank:          font-display, 18px, weight 300, color #DDD, width 24px
  2. Color bar:     3px × 28px, radius 2px, accent color
  3. Progress bar:  50px wide
                    Track: 4px, #E8E3D8
                    Fill: accent, width = pct × 3.2%
                    Label: 9px below, "{pct}%", color #BBB
  4. Keyword:       font-display, 15px, weight 700, flex 1
  5. Category badge: font-ui, 10px, accent color, bg accent/12, padding 2px 8px, radius 4px
  6. Traffic:       font-ui, 13px, weight 700, accent color, width 50px, right-aligned
  7. Chevron ▾:     12px, color #BBB, rotate 180° when open
```

**Each row (expanded):**
```
Bar: bg = category light tint (e.g. #FBEAEA)
Content:
  max-height transition 0 → 400px, 0.4s ease
  bg: {accent}04
  paddingLeft: 64px (aligned past rank + color bar)

  News items:
    • 6px dot (accent) + title (font-body, 14px) + source/time below
    • Source name in source color, weight 600

  Bottom button: "Xem câu chuyện đầy đủ →"
    border accent/30, color accent, hover bg accent/10
    → navigates to Story Page
```

**Behavior:** Only 1 accordion row open at a time. Opening a new row closes the previous.

### 3.6 Story Page — Header

```
Border-top:     4px solid {accent}
Background:     category bg color (e.g. #FBEAEA)
Border-radius:  0 0 12px 12px
Padding:        28px 28px 24px

Content:
  Row 1: category label (uppercase, accent, underlined) ... ● {traffic}+ lượt tìm (right-aligned, live dot)
  Row 2: keyword h1 (font-display, 34px, weight 800)
  Row 3: "Tổng hợp từ {n} nguồn · Cập nhật liên tục" (italic, #777)
```

### 3.7 Story Page — Summary Box

```
Background:     #FFFFFF
Border:         1px solid #E8E3D8
Border-left:    4px solid {accent}
Border-radius:  4px
Padding:        20px 24px

Label:  "TÓM LƯỢC" — font-ui, 11px, weight 700, accent, uppercase
Body:   font-body, 15px, color #444, line-height 1.75
        Keyword in bold accent. Includes: "chiếm {pct}% tổng lượng tìm kiếm"
```

### 3.8 Story Page — Source Cards (Expandable)

```
Section divider: "──── Các nguồn đưa tin ({count}) ────"

Collapsed card:
  bg #FAFAF7, border #E8E3D8, radius 8px, padding 16px 20px
  [SourceBadge] [timestamp]                    [▾ chevron]
  [Title — font-display, 15px, weight 700]

Expanded card:
  bg #FFFFFF, border accent/40, shadow 0 2px 12px rgba(0,0,0,0.06)
  + snippet: font-body, 14px, #666, border-top #E8E3D8, fadeUp animation

SourceBadge: font-ui 11px, source color, bg source-color/10, border source-color/20
```

### 3.9 Story Page — Timeline

```
Container:  bg white, border #E8E3D8, radius 8px, shadow subtle, padding 20px 24px
Label:      "Dòng thời gian" — font-ui, uppercase, #BBB

Each entry:
  Dot:  first = 12px filled accent + 2px border, rest = 8px filled #DDD
  Line: 1px #E8E3D8 connecting dots
  Text: time (font-ui, 11px, #BBB) + "Source — Title" (font-body, 14px, #444)
```

### 3.10 Footer

```
Border-top:  3px double #1A1A1A
Text:        centered, font-ui, 11px, color #BBB
             "Tin Radar — Dữ liệu từ Google Trends · Cập nhật mỗi giờ"
```

---

## 4. Responsive Breakpoints

```
Mobile:    < 640px
Tablet:    640-1024px
Desktop:   > 1024px (max-width 800px centered)
```

### Mobile (< 640px):
```
Masthead title:        32px
Treemap:
  grid-template-columns: 1fr
  grid-template-rows:    140px 80px 80px auto
  Main: full width row 1
  Secondary: full width each (row 2, 3)
  Small: flex row, 3 items (row 4)
  Extra small: flex row below
Accordion:
  Hide progress bar + pct (save space)
  Hide category badge (color bar is sufficient indicator)
  Reduce padding: 14px 14px
  Content paddingLeft: 44px
Stats bar: stack vertical if < 400px
Story page h1: 26px
```

### Tablet (640-1024px):
```
Treemap: 2 columns as designed
Accordion: full layout visible
Stats: 3 horizontal cards
```

---

## 5. Interactive States

### Treemap Blocks
```
Default:    solid accent bg, subtle shadow
Hover:      scale 1.01 (main) to 1.05 (small), shadow glow {color}40
Click:      → Story Page (scroll to top)
```

### Accordion Row
```
Collapsed:   bg white/alt, border between rows
Hover:       bg #F7F5F0
Expanded:    bg category light tint, chevron rotated, content slides in
             Only 1 open at a time
```

### Story Source Card
```
Default:    bg #FAFAF7, border #E8E3D8
Hover:      border #CCC
Expanded:   bg white, border accent/40, shadow, snippet visible
```

### Deep-dive Button
```
Default:    border accent/30, color accent, bg transparent
Hover:      bg accent/10
Click:      → Story Page
```

---

## 6. Empty, Loading & Error States

### Loading
```
Stats:     3 skeleton rectangles, pulse animation
Treemap:   skeleton blocks matching grid, gray gradient pulse
Accordion: 5 skeleton bars, pulse
```

### Empty
```
Centered in accordion area:
  italic, color #BBB
  "Không có xu hướng nào trong danh mục này"
```

### Error
```
Card with border-left 4px #C0392B:
  ⚠ "Không thể tải dữ liệu. Thử lại sau."
  [Thử lại] button
```

---

## 7. Navigation Flow

```
User → Trang chủ (/)
  │
  ├── Treemap Hero: nhìn tổng quan
  │   └── Click ô → /xu-huong/{slug} (Story Page)
  │
  ├── Scroll ↓ → Accordion List
  │   ├── Scan ranks, bars, traffic
  │   ├── Click row → expand preview
  │   │   └── "Xem câu chuyện đầy đủ →" → /xu-huong/{slug}
  │   └── Only 1 expanded at a time
  │
  └── Story Page (/xu-huong/{slug})
      ├── Summary (AI)
      ├── Source cards (expandable)
      ├── Timeline
      └── "‹ Quay lại" → / (trang chủ)
```
