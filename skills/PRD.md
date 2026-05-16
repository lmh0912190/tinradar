# PRD — Tin Radar

## 1. Tổng quan sản phẩm

**Tin Radar** là một nền tảng tin tức thế hệ mới, tự động tổng hợp và trực quan hóa các xu hướng tìm kiếm tại Việt Nam theo thời gian thực. Thay vì đăng bài như các trang tin truyền thống, Tin Radar cung cấp **bản đồ dư luận** dạng treemap mosaic và **deep-dive story page** cho từng trend — giúp người đọc nắm bắt bức tranh toàn cảnh thay vì đọc từng bài rời rạc.

## 2. Vấn đề cần giải quyết

- Các trang tin VN (VnExpress, CafeF, Tuổi Trẻ...) đăng bài trùng lặp, cùng một sự kiện có 20 bài gần giống nhau
- Người đọc bị ngập thông tin nhưng thiếu ngữ cảnh, góc nhìn tổng hợp
- Không có trang nào trực quan hóa "người Việt đang quan tâm gì" theo thời gian thực
- Không có nơi nào tổng hợp multi-source cho một trend thành một trang duy nhất

## 3. Giải pháp

### 3.1 Hai tầng giá trị

| Tầng | Mô tả | Tương tự |
|------|--------|----------|
| **Tin Radar** (Trang chủ) | Dashboard trực quan hóa trending topics dạng treemap mosaic | Bloomberg Terminal cho đại chúng |
| **Câu Chuyện Đằng Sau** (Story Page) | Deep-dive tự động cho từng trend: tóm lược, so sánh nguồn, timeline | Wikipedia cho tin tức thời sự |

### 3.2 Core Features — MVP

#### F1: Trang chủ — 3 tầng thông tin
- **Stats bar**: Tổng trends đang active, tổng lượt tìm kiếm, số nguồn tin
- **Treemap Hero**: Mỗi trend là 1 ô, diện tích tỷ lệ với lượng tìm kiếm, màu sắc theo category. Trend nóng nhất chiếm gần nửa bên trái, các trend nhỏ co lại. Click ô → vào Story Page
- **Accordion List**: Bên dưới treemap, mỗi trend là 1 thanh bar có rank, progress bar tỷ lệ %, category badge, traffic number. Click bar → mở rộng hiển thị preview tin tức + nút "Xem câu chuyện đầy đủ →". Chỉ 1 accordion mở tại 1 thời điểm

#### F2: Story Page — Deep-Dive
- **Header**: Keyword, category badge, traffic real-time, thời gian cập nhật
- **Tóm lược tự động**: AI tổng hợp từ tất cả nguồn thành 2-3 câu
- **So sánh nguồn tin**: Danh sách các bài từ các tòa soạn, click expand để xem snippet
- **Dòng thời gian**: Timeline hiển thị tin nào ra trước, tin nào ra sau, từ nguồn nào

#### F3: SEO-Optimized URLs
- Trang chủ: `/`
- Story page: `/xu-huong/{slug}` (ví dụ: `/xu-huong/sun-group-dien-bien-2026`)
- Category: `/danh-muc/{category-slug}`
- Sitemap tự động cập nhật

#### F4: Responsive Design
- Mobile-first, hoạt động tốt trên điện thoại
- Treemap mosaic responsive (co giãn theo viewport)

### 3.3 Features — Post-MVP

- **Trend history**: Biểu đồ xu hướng theo thời gian (đang lên / đang nguội)
- **Newsletter**: Bản tin buổi sáng tự động top 5 trends
- **Push notification**: Thông báo khi có trend đột biến
- **Personalization**: Người dùng chọn danh mục quan tâm
- **Trend comparison**: So sánh 2 trend cạnh nhau
- **Social sharing**: Card preview tối ưu cho Facebook/Zalo

## 4. User Flow

```
Người dùng → Trang chủ (/)
  ├── Treemap Hero: nhìn tổng quan — ô nào to nhất = hot nhất
  │   └── Click ô → Story Page (/xu-huong/{slug})
  │
  ├── Scroll xuống → Accordion List
  │   ├── Scan ranks, progress bars, traffic
  │   ├── Click bar → expand preview (tin tức + nguồn)
  │   │   └── "Xem câu chuyện đầy đủ →" → Story Page
  │   └── Chỉ 1 accordion mở tại 1 thời điểm
  │
  └── Story Page
        ├── Đọc tóm lược AI
        ├── Expand từng nguồn để so sánh
        ├── Xem timeline
        └── "‹ Quay lại" → Trang chủ
```

## 5. Target Audience

- **Primary**: 25-45 tuổi, quan tâm kinh tế-xã hội, đọc tin hàng ngày
- **Secondary**: Nhà báo, content creator, marketer cần nắm trend nhanh
- **Tertiary**: Gen Z muốn biết "chuyện gì đang xảy ra" mà không cần đọc nhiều báo

## 6. KPIs

| Metric | Target (3 tháng đầu) |
|--------|----------------------|
| DAU | 5,000 |
| Avg. session duration | > 2 phút |
| Pages/session | > 3 |
| Story page read rate | > 40% clicks from radar |
| Bounce rate | < 50% |

## 7. Constraints

- **Budget thấp**: Tối ưu chi phí AI bằng batch processing + Haiku model
- **Không cần đội biên tập**: Hệ thống tự động hoàn toàn, chỉ cần curation/QC
- **Nguồn dữ liệu free**: Google Trends RSS + Google News RSS (không cần license)
- **Tuân thủ bản quyền**: Chỉ hiển thị title + snippet, link về bài gốc
