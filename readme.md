 🎬 Xem Phim Online - Website Xem Phim Chuyên Nghiệp

Website xem phim online được xây dựng với \*\*static frontend + Google Drive\*\* làm media storage, không cần backend server. Giao diện đẹp mắt, tính năng phong phú như các website xem phim chuyên nghiệp.

LINK OF WEBSITE: https://maxxalan.github.io/Playing-FilmP2P


# 🔄 Cập nhật 2025-10: JSON từ Internet + Hỗ trợ phim bộ

- Dữ liệu phim nay được tải từ JSON REMOTE (GitHub Raw), không còn `data/movies.json` trong repo.
- URL JSON hiện tại:

```text
https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json
```

- Player hỗ trợ phim bộ (episodes). Khi một phim có trường `episodes`, UI sẽ hiển thị danh sách tập và đổi video khi chọn tập.

Ví dụ cấu trúc phim bộ trong JSON REMOTE:

```json
{
  "id": "2",
  "title": "Series Demo",
  "year": 2024,
  "poster": "https://via.placeholder.com/300x450/202430/FFFFFF?text=Series+Demo",
  "desc": "Demo phim bộ với danh sách tập để kiểm thử player.",
  "sub": "",
  "duration": "Tập ~45 phút",
  "genre": ["Drama"],
  "rating": 4.2,
  "category": "phim-bo",
  "episodes": [
    { "name": "Tập 1", "driveId": "1DEFghijKLmNOPqrSTuvWxyz123" },
    { "name": "Tập 2", "driveId": "1ABCDEFGhijKLmNOPqrSTuvWx45" }
  ]
}
```

- Chỉnh sửa/cập nhật nội dung: cập nhật file `movies.json` trong repository REMOTE của bạn rồi push; website sẽ tự động tải dữ liệu mới.
- Dùng `movie-editor.html` để soạn danh sách, bấm “Tải JSON” để xuất file và upload lên repo REMOTE.

# 🚀 Tính năng chính

# 🎯 Tính năng cốt lõi

- ✅ Static Frontend: Host trên GitHub Pages (HTML + CSS + JS tĩnh)

- ✅ Google Drive Integration: Video và hình ảnh lưu trên Google Drive

- ✅ Responsive Design: Hoạt động tốt trên mobile và desktop

- ✅ Multi-page Structure: Trang chủ, thể loại, tìm kiếm, giới thiệu, liên hệ

# 🔍 Tìm kiếm \& Lọc nâng cao

- ✅ Tìm kiếm thông minh: Tìm phim theo tên, mô tả, thể loại

- ✅ Bộ lọc nâng cao: Theo thể loại, năm, đánh giá

- ✅ Gợi ý tìm kiếm: Auto-suggestions khi gõ

- ✅ Sắp xếp: Theo tên, năm, đánh giá, thời lượng

# 🎨 Giao diện \& Trải nghiệm

- ✅ Load More: Pagination với nút "Xem thêm"

- ✅ Hover Effects: Hiệu ứng đẹp mắt khi hover

- ✅ Loading States: Animation loading mượt mà

# 🎬 Video Player

- ✅ Google Drive Player: Iframe player tích hợp

- ✅ Fullscreen Support: Toàn màn hình với phím tắt

# 📱 Responsive \& Mobile

\- ✅ Mobile Optimized: Tối ưu cho điện thoại

# 📁 Cấu trúc thư mục

```

/

├── index.html               # Trang chủ: danh sách phim với grid/list view

├── movie.html               # Trang xem phim (Google Drive player)

├── categories.html          # Trang thể loại phim

├── search.html              # Trang tìm kiếm nâng cao

├── about.html               # Trang giới thiệu về website

├── contact.html             # Trang liên hệ với form gửi tin nhắn

├── 404.html                 # Trang lỗi 404 thân thiện

├── style.css                # CSS chính (responsive design)

├── assets/

│   ├── css/                 # CSS bổ sung (nếu có)

│   └── js/

│       ├── main.js          # Trang chủ: load JSON, render, tìm kiếm, view switching

│       ├── player.js        # Video player với Google Drive integration (hỗ trợ episodes)

│       ├── utils.js         # Utility functions (toast, storage, etc.)

│       ├── categories.js    # Trang thể loại: hiển thị categories, navigation

│       ├── search.js        # Trang tìm kiếm: advanced search, filters

│       ├── contact.js       # Form liên hệ: validation, submission

│       └── 404.js           # Trang 404: gợi ý phim phổ biến

├── images/                  # Thư mục hình ảnh (poster, thumbnails)

├── favicon.ico

├── thumbnails/              # Thumbnails cho phim

└── README.md               # Hướng dẫn này

```

# 🎯 Cách hoạt động

 1. Multi-page Architecture

- Trang chủ (`index.html`): Hiển thị danh sách phim với grid/list view, tìm kiếm cơ bản

- Thể loại (`categories.html`): Duyệt phim theo category và genre

- Tìm kiếm (`search.html`): Tìm kiếm nâng cao với nhiều bộ lọc

- Giới thiệu (`about.html`): Thông tin về website, đội ngũ, giá trị

- Liên hệ (`contact.html`): Form liên hệ, FAQ, hỗ trợ

- 404 (`404.html`): Trang lỗi thân thiện với gợi ý phim

# 2. Frontend (GitHub Pages)

- Host toàn bộ code tĩnh trên GitHub Pages

- Load danh sách phim từ JSON

- Render giao diện responsive với CSS Grid/Flexbox

- JavaScript modules cho từng trang riêng biệt

# 3. Media Storage (Google Drive)

- Upload video và poster lên Google Drive

- Lấy `driveId` từ link chia sẻ công khai

- Sử dụng iframe preview để phát video

- CDN của Google Drive cho tốc độ tải nhanh

# 4. Metadata \& Data Management

- File `movies.json` (REMOTE) chứa thông tin chi tiết phim

- Bao gồm `driveId`, poster URL, mô tả, thể loại, đánh giá; với phim bộ có thêm `episodes`

- URL parameters để navigation giữa các trang

# 🛠️ Cài đặt và triển khai

# Bước 1: Chuẩn bị Google Drive

1\. Upload video lên Google Drive:

&nbsp; - Tạo thư mục riêng cho videos

&nbsp; - Upload file video (MP4, AVI, MKV...)

&nbsp; - Đặt quyền "Anyone with the link can view"

2\. Lấy Drive ID:

&nbsp; ```

&nbsp; Link chia sẻ: https://drive.google.com/file/d/1XyzABCdEfGhIJklMNopQRsTuVw/view

&nbsp; Drive ID: 1XyzABCdEfGhIJklMNopQRsTuVw

&nbsp; ```

3\. Tạo poster/thumbnail:

&nbsp; - Chụp ảnh màn hình hoặc tìm poster

&nbsp; - Upload lên Google Drive hoặc dùng URL khác

# Bước 2: Cập nhật movies.json (REMOTE)

- Chỉnh sửa file `movies.json` trong repository chứa dữ liệu, sau đó dùng GitHub Raw làm URL để ứng dụng tải về.

- Ví dụ URL đã dùng trong dự án: `https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json`

- Sử dụng Movie JSON Editor để soạn danh sách và tải file JSON.

**Lưu ý về cấu trúc JSON:**

- `id`: ID duy nhất cho phim

- `title`: Tên phim

- `year`: Năm sản xuất

- `poster`: URL hình ảnh poster

- `desc`: Mô tả ngắn về phim

- `driveId`: Google Drive ID của video (phim lẻ)

- `episodes`: Danh sách tập (phim bộ). Mỗi phần tử gồm `name`, `driveId`

- `sub`: Phụ đề (để trống nếu không có)

- `duration`: Thời lượng phim

- `genre`: Mảng các thể loại

- `rating`: Điểm đánh giá (0-5)

- `category`: Phân loại (phim-le, phim-bo, phim-hoat-hinh, phim-tai-lieu)

\### Bước 3: Deploy lên GitHub Pages

1\. \*\*Tạo repository mới\*\*:

&nbsp; ```bash

&nbsp; git init

&nbsp; git add .

&nbsp; git commit -m "Initial commit"

&nbsp; git branch -M main

&nbsp; git remote add origin https://github.com/username/movie-site.git

&nbsp; git push -u origin main

&nbsp; ```

2\. \*\*Kích hoạt GitHub Pages\*\*:

&nbsp; - Vào Settings → Pages

&nbsp; - Chọn Source: Deploy from a branch

&nbsp; - Chọn Branch: main / (root)

&nbsp; - Save

3\. \*\*Truy cập website\*\*:

&nbsp; ```

&nbsp; https://username.github.io/movie-site

&nbsp; ```

\## 🎮 Cách sử dụng

\### 👤 Cho người dùng cuối

1\. \*\*Xem phim\*\*: Click vào poster phim → Chọn "Xem ngay"

2\. \*\*Tìm kiếm\*\*: Dùng thanh tìm kiếm hoặc trang Search nâng cao

3\. \*\*Duyệt thể loại\*\*: Vào trang Categories để xem theo thể loại

4\. \*\*Chuyển đổi view\*\*: Toggle giữa Grid và List view

5\. \*\*Lịch sử xem\*\*: Tự động lưu, xem lại trong sidebar

\### 🛠️ Cho quản trị viên

\#### Thêm phim mới

1\. Upload video lên Google Drive

2\. Lấy Drive ID từ link chia sẻ

3\. Tìm poster/thumbnail cho phim

4\. Cập nhật file JSON REMOTE (hoặc dùng Movie JSON Editor xuất file và upload)

5\. Commit và push lên GitHub (repo chứa JSON)

\#### Cập nhật thông tin phim

1\. Chỉnh sửa `movies.json` trong repo REMOTE

2\. Commit và push lên GitHub

3\. Website sẽ tự động cập nhật

\#### Quản lý nội dung

\- \*\*Categories\*\*: Thêm/xóa categories trong categories.js

\- \*\*Genres\*\*: Cập nhật danh sách genre trong search.html

\- \*\*Contact Info\*\*: Cập nhật thông tin liên hệ trong contact.html

\- \*\*About\*\*: Chỉnh sửa nội dung giới thiệu trong about.html

\## 🔧 Tùy chỉnh

\### 🎨 Thay đổi giao diện

\- \*\*Màu sắc\*\*: Chỉnh sửa CSS variables trong `style.css`

\- \*\*Layout\*\*: Thay đổi grid columns, spacing

\- \*\*Typography\*\*: Cập nhật fonts, sizes

\- \*\*Animations\*\*: Thêm CSS animations và transitions

\- \*\*Mobile\*\*: Tùy chỉnh responsive breakpoints

\### 🚀 Thêm tính năng mới

\- \*\*Phân trang\*\*: Thêm pagination cho danh sách phim

\- \*\*Playlist\*\*: Tạo danh sách phát tự động

\- \*\*Đánh giá\*\*: Cho phép user đánh giá phim (upload late)

\- \*\*Bình luận\*\*: Tích hợp Disqus hoặc similar

\- \*\*Favorites\*\*: Lưu phim yêu thích (upload late)

\- \*\*Watch Later\*\*: Danh sách xem sau (upload late)

\- \*\*Recommendations\*\*: Gợi ý phim tương tự (upload late)

\### 📱 Responsive Design

\- \*\*Breakpoints\*\*: 768px (tablet), 480px (mobile) (upload late)

\- \*\*Touch gestures\*\*: Swipe, pinch-to-zoom (upload late)

\- \*\*Mobile menu\*\*: Hamburger menu cho mobile (upload late)

\- \*\*Touch targets\*\*: Buttons đủ lớn cho mobile (upload late)

\### 🔍 SEO Optimization

\- \*\*Meta tags\*\*: Động cho từng phim (upload late)

\- \*\*Sitemap\*\*: Tạo sitemap.xml (upload late)

\- \*\*Structured data\*\*: JSON-LD cho movies (upload late)

\- \*\*Open Graph\*\*: Tags cho social sharing (upload late)

\- \*\*Performance\*\*: Optimize images, lazy loading (upload late)

\## ⚠️ Lưu ý quan trọng

\### Giới hạn Google Drive

\- \*\*Băng thông\*\*: 100-200GB/ngày/file

\- \*\*Concurrent viewers\*\*: ~100 người xem đồng thời

\- \*\*File size\*\*: Tối đa 5TB/file (Google Drive limit)

\### Bảo mật

\- Không có authentication system

\- Ai có link đều xem được

\- Không lưu user data (chỉ localStorage)

\### Performance

\- Static files load nhanh

\- Google Drive CDN tốt

\- Có thể cache JSON với service worker

\## 🚀 Tính năng nâng cao (Roadmap)

\### 📱 PWA \& Performance

\- \[ ] \*\*Service Worker\*\*: Cache offline cho phim đã xem

\- \[ ] \*\*PWA\*\*: Progressive Web App với install prompt

\- \[ ] \*\*Lazy Loading\*\*: Load images khi cần thiết

\- \[ ] \*\*Image Optimization\*\*: WebP format, responsive images

\### 🔍 Search \& Discovery

\- \[ ] \*\*Search API\*\*: Algolia hoặc Elasticsearch integration

\- \[ ] \*\*Smart Recommendations\*\*: AI-based movie suggestions

\- \[ ] \*\*Trending Movies\*\*: Phim đang hot

\- \[ ] \*\*Recently Added\*\*: Phim mới nhất

\- \[ ] \*\*Similar Movies\*\*: Phim tương tự

\### 👥 Social Features

\- \[ ] \*\*User Accounts\*\*: Đăng ký/đăng nhập

\- \[ ] \*\*Comments\*\*: Disqus integration

\- \[ ] \*\*Ratings\*\*: User rating system

\- \[ ] \*\*Reviews\*\*: Viết review phim

\- \[ ] \*\*Social Sharing\*\*: Share lên social media

\- \[ ] \*\*User Profiles\*\*: Trang cá nhân

\### 🎬 Video Features

\- \[ ] \*\*Subtitle support\*\*: VTT files với multiple languages

\- \[ ] \*\*Multiple quality\*\*: 720p, 1080p, 4K options

\- \[ ] \*\*Auto-play next\*\*: Play next episode automatically

\- \[ ] \*\*Playback speed\*\*: 0.5x, 1x, 1.25x, 1.5x, 2x

\- \[ ] \*\*Picture-in-Picture\*\*: PiP mode support

# 📊 Analytics \& Admin

\- \[ ] Google Analytics: Track user behavior

\- \[ ] Admin Panel: Dashboard quản lý phim

\- \[ ] Content Management: Easy add/edit movies

\- \[ ] User Management: Manage users and permissions

\- \[ ] Reports: Viewing statistics, popular movies

# 🔧 Technical Enhancements

- \[ ] API Backend: Node.js/Express backend

- \[ ] Database: MongoDB/PostgreSQL cho metadata

- \[ ] CDN: CloudFlare cho static assets

- \[ ] Caching: Redis cho performance

- \[ ] Monitoring: Error tracking, uptime monitoring

# 📞 Hỗ trợ

# 🐛 Troubleshooting

# Video không phát được

1\. Kiểm tra Google Drive link có public không

2\. Xem console browser (F12) có lỗi gì

3\. Thử refresh trang

4\. Kiểm tra internet connection

# Website không load

1\. Kiểm tra GitHub Pages có hoạt động không

2\. Xem repository có public không

3\. Kiểm tra file paths trong code

4\. Clear browser cache

# Mobile không responsive

1\. Kiểm tra viewport meta tag

2\. Test trên different screen sizes

3\. Xem CSS media queries

4\. Kiểm tra touch events

# 📧 Liên hệ

- Email: aizasybxitjpvbi@zohomail.com

- Email Backup: manhhoangvipbao@gmail.com

- Facebook: https://www.facebook.com/abcxyz

- Instagram: https://www.instagram.com/abcxyz/

- TikTok: https://www.tiktok.com/@abcxyz

# 🔧 Technical Support

- GitHub Issues: Báo bug hoặc feature request

- Documentation: Đọc kỹ README này

- Community: Tham gia discussion trong Issues

# 📄 License

MIT License - Tự do sử dụng và chỉnh sửa cho mục đích cá nhân và thương mại.

# 🙏 Credits

- Design: Modern UI/UX với CSS Grid \& Flexbox

- Icons: Emoji icons cho simplicity

- Fonts: System fonts cho performance

- Images: Placeholder.com cho demo

- Video: Google Drive cho hosting

---

🎬 Chúc bạn có trải nghiệm xem phim tuyệt vời!

\_Website được phát triển bởi Hoang Manh - 2025\_

\## Movie JSON Editor (tool bổ trợ)
  
TOOL: https://crytals-sc.github.io/json-link/  
Đã thêm `movie-editor.html` và `assets/js/movie-editor.js` — trang nhập liệu để tạo/biên tập danh sách phim và xuất file `movies.json` để upload lên repository REMOTE.

- Mở `movie-editor.html` bằng trình duyệt.

- Điền `id`, `title` và các trường khác. `genre` dùng dấu phẩy để phân tách; với phim bộ, thêm trường `episodes` theo schema ở phần cập nhật.

- Dùng "Thêm vào list" để quản lý danh sách, "Tải JSON" để lưu file, sau đó upload lên repo REMOTE (GitHub Raw).
