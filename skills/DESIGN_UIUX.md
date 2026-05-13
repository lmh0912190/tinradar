# DESIGN UI/UX — Tin Radar

## 1. Design Philosophy

**Phong cách: Editorial** — Lấy cảm hứng từ báo chí cao cấp (NYT, The Economist), typography là nhân vật chính. Tạo cảm giác uy tín, đáng tin cậy, đọc lâu không mỏi mắt. Khác biệt hoàn toàn với các trang tin Việt Nam hiện tại vốn quá ồn ào và đầy quảng cáo.

**Nguyên tắc thiết kế:**
- Typography-first: Nội dung dẫn dắt, không phải hình ảnh
- Whitespace rộng rãi: Tạo cảm giác thở, thoáng đãng
- Restraint: Dùng ít màu, ít effect, để nội dung nổi bật
- Mobile-first: Thiết kế cho mobile trước, responsive lên desktop

---

## 2. Design Tokens

### 2.1 Color Palette

```
Background:
  --bg-primary:     #FAFAF7    // Nền chính (kem nhẹ, không trắng tinh)
  --bg-card:        #FFFFFF    // Nền card
  --bg-muted:       #F7F5F0    // Nền section phụ (summary box...)

Border:
  --border-primary: #E8E3D8    // Border chính
  --border-light:   #EDE9E0    // Border nhẹ
  --border-dark:    #1A1A1A    // Border đậm (masthead double border)

Text:
  --text-primary:   #1A1A1A    // Heading, text chính
  --text-body:      #444444    // Body text
  --text-muted:     #888888    // Text phụ
  --text-subtle:    #AAAAAA    // Text rất nhẹ (timestamp, metadata)
  --text-disabled:  #BBBBBB
  --text-rank:      #DDDDDD    // Số ranking

Category Accent (mỗi category 1 màu trầm, sang trọng):
  --cat-kinh-doanh:  #2D7D5F   bg: #E8F5EE
  --cat-tai-chinh:   #2568A8   bg: #E3EFF8
  --cat-the-thao:    #B83230   bg: #FBEAEA
  --cat-cong-nghe:   #7B3FA0   bg: #F3E8FA
  --cat-xa-hoi:      #A08520   bg: #FAF5E4
  --cat-giai-tri:    #C44569   bg: #FCE8EF
  --cat-doi-song:    #A08520   bg: #FAF5E4

Source Colors (mỗi tòa soạn 1 màu nhận diện):
  CafeF:       #C68A17
  VnExpress:   #1A5276
  Tuổi Trẻ:    #C0392B
  Thanh Niên:  #1B6B4A
  GenK:        #7B3FA0
  Zing:        #C44569
  Dân Trí:     #117A65
```

### 2.2 Typography

```
Font stack:
  --font-display:  'Playfair Display', Georgia, serif    // Heading lớn, ranking
  --font-body:     'Source Serif 4', Georgia, serif       // Body text, story content
  --font-ui:       'DM Sans', system-ui, sans-serif      // UI elements, metadata, buttons

Scale (mobile → desktop):
  Masthead title:    40px / 48px   font-display  weight 900
  Story page h1:     34px / 40px   font-display  weight 800
  Bubble keyword:    12-15px       font-display  weight 700
  List item title:   15px / 17px   font-display  weight 700
  Body text:         15px          font-body     weight 400  line-height 1.75
  Summary text:      15px          font-body     weight 400  line-height 1.75
  Source badge:      11px          font-ui       weight 600
  Category label:    10px          font-ui       weight 700  uppercase  letter-spacing 0.15em
  Timestamp:         11px          font-ui       weight 400
  Stats number:      22px          font-display  weight 800
  Filter button:     12px          font-ui       weight 400-700
```

### 2.3 Spacing

```
Page padding:         20px (mobile) / 40px (desktop)
Max content width:    800px (centered)
Card padding:         14px 16px (list) / 16px 20px (story cards)
Section gap:          28px
Card gap:             6-8px
Bubble gap:           14px
```

### 2.4 Border & Shadow

```
Masthead border:      3px double #1A1A1A (top & bottom)
Card border:          1px solid #EDE9E0
Card border-radius:   8px
Bubble border:        1.5px solid {accent}35
Bubble border-radius: 50% (circle)
Story header border:  4px solid {accent} (top only)
Card shadow:          0 1px 3px rgba(0,0,0,0.03)
Card hover shadow:    0 2px 12px {accent}12
Section divider:      1px solid #E8E3D8 hoặc double border
```

### 2.5 Animation

```
Bubble enter:    scale 0.3→1, opacity 0→1, 0.6s cubic-bezier(0.34,1.56,0.64,1), stagger 0.07s
Bubble hover:    scale 1→1.12, shadow appear, 0.3s ease
Page transition: translateY 20px→0, opacity 0→1, 0.4s ease-out
List item enter: opacity 0→1, 0.3s, stagger 0.05s
Expand content:  opacity 0→1, 0.3s ease-out
Live dot:        opacity pulse 1→0.3→1, 2s infinite
```

---

## 3. Components Specification

### 3.1 Masthead (Header)

```
┌──────────────────────────────────────────┐
│           thứ hai, 12 tháng 5, 2026      │  ← font-ui, uppercase, tracking wide
│            Tin Radar                    │  ← font-display, 40px, weight 900
│    Bản đồ dư luận VN — Cập nhật mỗi giờ  │  ← font-body, italic, color muted
│══════════════════════════════════════════│  ← 3px double border
└──────────────────────────────────────────┘
```

- Centered layout
- Date phía trên title
- Subtitle italic bên dưới
- Double border bottom ngăn cách với content

### 3.2 Stats Bar

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ 🔥 Đang      │  │ 📊 Tổng lượt │  │ 📰 Nguồn    │
│ trending     │  │ tìm          │  │ tin          │
│     10       │  │   160K+      │  │    11        │
└─────────────┘  └─────────────┘  └─────────────┘
```

- 3 card ngang, flex wrap
- Background white, border nhẹ, shadow minimal
- Icon + label nhỏ phía trên, số lớn font-display phía dưới

### 3.3 Filter Bar

```
──────────────────────────────────────────────────
[Tất cả] [Kinh doanh] [Tài chính] [Thể thao]...   Hot nhất | Mới nhất
──────────────────────────────────────────────────
```

- Nằm giữa 2 border top/bottom mỏng
- Category pills: border-radius 20px, active state có background accent nhẹ + border
- Sort buttons: bên phải, text underline khi active
- Font: font-ui

### 3.4 Bubble Chart Area

```
            ┌─────┐
        ┌───┤     ├────┐
       ┌┤   │ U23 │    ├┐
       ││   │ VN  │    ││
       │└───┤50K+ ├────┘│
  ┌────┤    └─────┘     ├──────┐
  │    │   ┌────┐       │      │
  │ BTC│   │Vàng│  ┌──┐ │iPhone│
  │20K+│   │35K+│  │BĐS│ │10K+ │
  └────┘   └────┘  └──┘ └──────┘
```

- Flex wrap, centered, gap 14px
- Mỗi bubble là button tròn (border-radius: 50%)
- Size: `80 + sqrt(traffic/maxTraffic) * 100` px
- Background: category pastel color (e.g. #E3EFF8 cho Tài chính)
- Border: `1.5px solid {accent}35`
- Nội dung: keyword (font-display, bold) + traffic (font-ui, nhỏ hơn)
- Live dot: góc trên phải, 6px, pulse animation
- Hover: scale 1.12, shadow glow nhẹ bằng accent color

### 3.5 List View (dưới bubble)

```
──── Chi tiết ────────────────────────────────────

  1  │ U23 Việt Nam          Thể thao       50K+
     │ 4 bài viết · Bóng Đá +3              1h trước

  2  │ Giá vàng              Tài chính      35K+
     │ 3 bài viết · VnExpress +2             15p trước

  3  │ Bitcoin               Tài chính      20K+
     │ 3 bài viết · CoinDesk VN +2           30p trước
```

- Section divider: "Chi tiết" với lines 2 bên
- Mỗi item: card trắng, border nhẹ, shadow minimal
- Layout: rank number (font-display, light, color #DDD) → accent bar (3px, gradient) → info block → traffic block → chevron ›
- Hover: border chuyển sang accent color nhẹ, shadow tăng
- Click: navigate đến Story Page

### 3.6 Story Page — Header

```
════════════════════════════════════════════  ← 4px solid accent top
│  ┌──────────────────────────────────────┐ │
│  │ THỂ THAO  ·  1h trước     ● 50K+   │ │  ← category + time + traffic
│  │                                      │ │
│  │ U23 Việt Nam                         │ │  ← h1, font-display, 34px
│  │                                      │ │
│  │ Tổng hợp từ 4 nguồn tin · Cập nhật  │ │  ← subtitle, italic
│  └──────────────────────────────────────┘ │
│        Background: category pastel        │
```

### 3.7 Story Page — Summary Box

```
  ┃ TÓM LƯỢC                                    ← accent left border 4px
  ┃ Từ khóa "U23 Việt Nam" đang thu hút hơn     ← body text, line-height 1.75
  ┃ 50K lượt tìm kiếm. Sự kiện được phản ánh
  ┃ đa chiều qua 4 tòa soạn...
```

- Background: white
- Border left: 4px solid accent
- Border: 1px solid #E8E3D8
- Label "TÓM LƯỢC": uppercase, accent color, font-ui

### 3.8 Story Page — Source Cards (Expandable)

```
  ┌───────────────────────────────────────────┐
  │ [Bóng Đá]  1 giờ trước                  ▾ │
  │ U23 Việt Nam thắng thuyết phục 3-0...     │
  │                                            │
  │ ─────────── (expanded) ──────────────      │
  │ Với lối chơi pressing tầm cao, U23 VN     │
  │ hoàn toàn áp đảo đối thủ truyền kiếp...   │
  └───────────────────────────────────────────┘
```

- Default: collapsed, chỉ hiển thị source badge + time + title
- Click: expand ra snippet, có border-top divider
- Active state: background white (thay vì #FAFAF7), border accent nhẹ, shadow
- Chevron ▾ xoay 180° khi expanded

### 3.9 Story Page — Timeline

```
  ──── Dòng thời gian ────────────────────────

  ●  1 giờ trước
  │  Bóng Đá — U23 Việt Nam thắng thuyết phục...
  │
  ○  2 giờ trước
  │  VnExpress — HLV Hoàng Anh Tuấn: 'Các cầu thủ...'
  │
  ○  2 giờ trước
     Tuổi Trẻ — Quang Nho lập cú đúp...
```

- Nằm trong card trắng, border nhẹ, shadow minimal
- Dot đầu tiên: lớn hơn (12px), filled accent color
- Dot còn lại: nhỏ hơn (8px), filled #DDD
- Line nối: 1px solid #E8E3D8
- Source name: bold, accent color của tòa soạn đó

### 3.10 Footer

```
══════════════════════════════════════════  ← 3px double border
  Tin Radar — Dữ liệu từ Google Trends · Cập nhật mỗi giờ
```

- Double border top (match masthead)
- Text centered, font-ui, color muted

---

## 4. Responsive Breakpoints

```
Mobile:    < 640px   — single column, smaller bubbles, stacked stats
Tablet:    640-1024px — 2-column stats, medium bubbles
Desktop:   > 1024px  — max-width 800px centered, full bubbles
```

### Mobile-specific adjustments:
- Masthead title: 32px (thay vì 40px)
- Bubble size scale giảm: `60 + ratio * 80`
- Stats bar: stack vertical nếu < 400px
- Filter bar: horizontal scroll nếu overflow
- Story page h1: 26px

---

## 5. Interactive States

### Bubble
```
Default:    bg pastel, border accent/35, shadow subtle
Hover:      scale 1.12, border accent solid, shadow glow accent/25
Active:     scale 0.95 (click feedback)
```

### List Card
```
Default:    bg white, border #EDE9E0, shadow minimal
Hover:      border accent/40, shadow accent/12
```

### Filter Pill
```
Default:    bg transparent, border transparent, color muted
Active:     bg accent/10, border accent/30, color accent, font bold
```

### Source Card (Story Page)
```
Default:    bg #FAFAF7, border #E8E3D8
Hover:      border #CCC
Expanded:   bg white, border accent/40, shadow appear
```

---

## 6. Empty & Loading States

### Loading (khi fetch data)
- Bubble area: 3-5 skeleton circles, pulse animation, random sizes
- List area: 5 skeleton cards, pulse animation

### Empty (filter không có kết quả)
- Text centered, italic, color muted: "Không có xu hướng nào trong danh mục này"

### Error
- Card với border #C0392B, icon ⚠, message ngắn gọn
