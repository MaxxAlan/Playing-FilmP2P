# 🎬 Xem Phim Online - Website Xem Phim Chuyên Nghiệp

Website xem phim online được xây dựng với **static frontend + Google Drive** làm media storage, không cần backend server. Giao diện đẹp mắt, tính năng phong phú như các website xem phim chuyên nghiệp.

## 🚀 Tính năng chính

### 🎯 Tính năng cốt lõi

- ✅ **Static Frontend**: Host trên GitHub Pages (HTML + CSS + JS tĩnh)
- ✅ **Google Drive Integration**: Video và hình ảnh lưu trên Google Drive
- ✅ **Responsive Design**: Hoạt động tốt trên mobile và desktop
- ✅ **Multi-page Structure**: Trang chủ, thể loại, tìm kiếm, giới thiệu, liên hệ

### 🔍 Tìm kiếm & Lọc nâng cao

- ✅ **Tìm kiếm thông minh**: Tìm phim theo tên, mô tả, thể loại
- ✅ **Bộ lọc nâng cao**: Theo thể loại, năm, đánh giá
- ✅ **Gợi ý tìm kiếm**: Auto-suggestions khi gõ
- ✅ **Sắp xếp**: Theo tên, năm, đánh giá, thời lượng

### 🎨 Giao diện & Trải nghiệm

- ✅ **View Switching**: Chuyển đổi giữa Grid và List view
- ✅ **Load More**: Pagination với nút "Xem thêm"
- ✅ **Lịch sử xem**: Lưu tiến độ xem bằng localStorage
- ✅ **Hover Effects**: Hiệu ứng đẹp mắt khi hover
- ✅ **Loading States**: Animation loading mượt mà

### 🎬 Video Player

- ✅ **Google Drive Player**: Iframe player tích hợp
- ✅ **Fullscreen Support**: Toàn màn hình với phím tắt
- ✅ **Keyboard Shortcuts**: F (fullscreen), B (back), Esc (exit)
- ✅ **Auto-resume**: Tự động lưu tiến độ xem

### 📱 Responsive & Mobile

- ✅ **Mobile Optimized**: Tối ưu cho điện thoại
- ✅ **Touch Friendly**: Buttons và controls dễ chạm
- ✅ **Adaptive Layout**: Layout tự động điều chỉnh

## 📁 Cấu trúc thư mục

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
│       ├── player.js        # Video player với Google Drive integration
│       ├── utils.js         # Utility functions (toast, storage, etc.)
│       ├── categories.js    # Trang thể loại: hiển thị categories, navigation
│       ├── search.js        # Trang tìm kiếm: advanced search, filters
│       ├── contact.js       # Form liên hệ: validation, submission
│       └── 404.js           # Trang 404: gợi ý phim phổ biến
├── data/
│   └── movies.json          # Metadata các phim (driveId, poster, genre, etc.)
├── images/                  # Thư mục hình ảnh (poster, thumbnails)
├── thumbnails/              # Thumbnails cho phim
└── README.md               # Hướng dẫn này
```

## 🎯 Cách hoạt động

### 1. Multi-page Architecture

- **Trang chủ** (`index.html`): Hiển thị danh sách phim với grid/list view, tìm kiếm cơ bản
- **Thể loại** (`categories.html`): Duyệt phim theo category và genre
- **Tìm kiếm** (`search.html`): Tìm kiếm nâng cao với nhiều bộ lọc
- **Giới thiệu** (`about.html`): Thông tin về website, đội ngũ, giá trị
- **Liên hệ** (`contact.html`): Form liên hệ, FAQ, hỗ trợ
- **404** (`404.html`): Trang lỗi thân thiện với gợi ý phim

### 2. Frontend (GitHub Pages)

- Host toàn bộ code tĩnh trên GitHub Pages
- Load danh sách phim từ `data/movies.json`
- Render giao diện responsive với CSS Grid/Flexbox
- JavaScript modules cho từng trang riêng biệt

### 3. Media Storage (Google Drive)

- Upload video và poster lên Google Drive
- Lấy `driveId` từ link chia sẻ công khai
- Sử dụng iframe preview để phát video
- CDN của Google Drive cho tốc độ tải nhanh

### 4. Metadata & Data Management

- File `movies.json` chứa thông tin chi tiết phim
- Bao gồm `driveId`, poster URL, mô tả, thể loại, đánh giá
- localStorage để lưu lịch sử xem và preferences
- URL parameters để navigation giữa các trang

## 🛠️ Cài đặt và triển khai

### Bước 1: Chuẩn bị Google Drive

1. **Upload video lên Google Drive**:

   - Tạo thư mục riêng cho videos
   - Upload file video (MP4, AVI, MKV...)
   - Đặt quyền "Anyone with the link can view"

2. **Lấy Drive ID**:

   ```
   Link chia sẻ: https://drive.google.com/file/d/1XyzABCdEfGhIJklMNopQRsTuVw/view
   Drive ID: 1XyzABCdEfGhIJklMNopQRsTuVw
   ```

3. **Tạo poster/thumbnail**:
   - Chụp ảnh màn hình hoặc tìm poster
   - Upload lên Google Drive hoặc dùng URL khác

### Bước 2: Cập nhật movies.json

```json
[
  {
    "id": "1",
    "title": "Nhiệm Vụ Bất Khả Thi - Nghiệp Báo Cuối Cùng",
    "year": 2025,
    "poster": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBsWBQUCZVnEx11IFulfQC-NtVo6Yv19dHA575ySV84SofSU9M",
    "desc": "Câu chuyện về một chàng trai trẻ với ước mơ trở thành thợ săn rồng, nhưng định mệnh lại đưa đẩy anh đến tình bạn bất ngờ với một chú rồng.",
    "driveId": "1N-lJ3dTqUEjbTeOp1vb2cdDpGPDyqDlQ",
    "sub": "",
    "duration": "2:52:55",
    "genre": ["Sci-Fi", "Romantic", "Action"],
    "rating": 4.9,
    "category": "phim-le"
  },
  {
    "id": "2",
    "title": "Interstellar",
    "year": 2014,
    "poster": "https://via.placeholder.com/300x450/000080/FFFFFF?text=Interstellar",
    "desc": "A journey beyond the stars in search of a new home for humanity.",
    "driveId": "1DEFghijKLmNOPqrSTuvWxyz123",
    "sub": "",
    "duration": "169 phút",
    "genre": ["Sci-Fi", "Drama", "Adventure"],
    "rating": 4.6,
    "category": "phim-le"
  }
]
```

**Lưu ý về cấu trúc JSON:**

- `id`: ID duy nhất cho phim
- `title`: Tên phim
- `year`: Năm sản xuất
- `poster`: URL hình ảnh poster
- `desc`: Mô tả ngắn về phim
- `driveId`: Google Drive ID của video
- `sub`: Phụ đề (để trống nếu không có)
- `duration`: Thời lượng phim
- `genre`: Mảng các thể loại
- `rating`: Điểm đánh giá (0-5)
- `category`: Phân loại (phim-le, phim-bo, phim-hoat-hinh, phim-tai-lieu)

### Bước 3: Deploy lên GitHub Pages

1. **Tạo repository mới**:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/movie-site.git
   git push -u origin main
   ```

2. **Kích hoạt GitHub Pages**:

   - Vào Settings → Pages
   - Chọn Source: Deploy from a branch
   - Chọn Branch: main / (root)
   - Save

3. **Truy cập website**:
   ```
   https://username.github.io/movie-site
   ```

## 🎮 Cách sử dụng

### 👤 Cho người dùng cuối

1. **Xem phim**: Click vào poster phim → Chọn "Xem ngay"
2. **Tìm kiếm**: Dùng thanh tìm kiếm hoặc trang Search nâng cao
3. **Duyệt thể loại**: Vào trang Categories để xem theo thể loại
4. **Chuyển đổi view**: Toggle giữa Grid và List view
5. **Lịch sử xem**: Tự động lưu, xem lại trong sidebar

### 🛠️ Cho quản trị viên

#### Thêm phim mới

1. Upload video lên Google Drive
2. Lấy Drive ID từ link chia sẻ
3. Tìm poster/thumbnail cho phim
4. Thêm entry vào `data/movies.json`
5. Commit và push lên GitHub

#### Cập nhật thông tin phim

1. Chỉnh sửa `data/movies.json`
2. Commit và push lên GitHub
3. Website sẽ tự động cập nhật

#### Quản lý nội dung

- **Categories**: Thêm/xóa categories trong categories.js
- **Genres**: Cập nhật danh sách genre trong search.html
- **Contact Info**: Cập nhật thông tin liên hệ trong contact.html
- **About**: Chỉnh sửa nội dung giới thiệu trong about.html

## 🔧 Tùy chỉnh

### 🎨 Thay đổi giao diện

- **Màu sắc**: Chỉnh sửa CSS variables trong `style.css`
- **Layout**: Thay đổi grid columns, spacing
- **Typography**: Cập nhật fonts, sizes
- **Animations**: Thêm CSS animations và transitions
- **Mobile**: Tùy chỉnh responsive breakpoints

### 🚀 Thêm tính năng mới

- **Phân trang**: Thêm pagination cho danh sách phim
- **Playlist**: Tạo danh sách phát tự động
- **Đánh giá**: Cho phép user đánh giá phim
- **Bình luận**: Tích hợp Disqus hoặc similar
- **Favorites**: Lưu phim yêu thích
- **Watch Later**: Danh sách xem sau
- **Recommendations**: Gợi ý phim tương tự

### 📱 Responsive Design

- **Breakpoints**: 768px (tablet), 480px (mobile)
- **Touch gestures**: Swipe, pinch-to-zoom
- **Mobile menu**: Hamburger menu cho mobile
- **Touch targets**: Buttons đủ lớn cho mobile

### 🔍 SEO Optimization

- **Meta tags**: Động cho từng phim
- **Sitemap**: Tạo sitemap.xml
- **Structured data**: JSON-LD cho movies
- **Open Graph**: Tags cho social sharing
- **Performance**: Optimize images, lazy loading

## ⚠️ Lưu ý quan trọng

### Giới hạn Google Drive

- **Băng thông**: 100-200GB/ngày/file
- **Concurrent viewers**: ~100 người xem đồng thời
- **File size**: Tối đa 5TB/file (Google Drive limit)

### Bảo mật

- Không có authentication system
- Ai có link đều xem được
- Không lưu user data (chỉ localStorage)

### Performance

- Static files load nhanh
- Google Drive CDN tốt
- Có thể cache JSON với service worker

## 🚀 Tính năng nâng cao (Roadmap)

### 📱 PWA & Performance

- [ ] **Service Worker**: Cache offline cho phim đã xem
- [ ] **PWA**: Progressive Web App với install prompt
- [ ] **Lazy Loading**: Load images khi cần thiết
- [ ] **Image Optimization**: WebP format, responsive images

### 🔍 Search & Discovery

- [ ] **Search API**: Algolia hoặc Elasticsearch integration
- [ ] **Smart Recommendations**: AI-based movie suggestions
- [ ] **Trending Movies**: Phim đang hot
- [ ] **Recently Added**: Phim mới nhất
- [ ] **Similar Movies**: Phim tương tự

### 👥 Social Features

- [ ] **User Accounts**: Đăng ký/đăng nhập
- [ ] **Comments**: Disqus integration
- [ ] **Ratings**: User rating system
- [ ] **Reviews**: Viết review phim
- [ ] **Social Sharing**: Share lên social media
- [ ] **User Profiles**: Trang cá nhân

### 🎬 Video Features

- [ ] **Subtitle support**: VTT files với multiple languages
- [ ] **Multiple quality**: 720p, 1080p, 4K options
- [ ] **Auto-play next**: Play next episode automatically
- [ ] **Playback speed**: 0.5x, 1x, 1.25x, 1.5x, 2x
- [ ] **Picture-in-Picture**: PiP mode support

### 📊 Analytics & Admin

- [ ] **Google Analytics**: Track user behavior
- [ ] **Admin Panel**: Dashboard quản lý phim
- [ ] **Content Management**: Easy add/edit movies
- [ ] **User Management**: Manage users and permissions
- [ ] **Reports**: Viewing statistics, popular movies

### 🔧 Technical Enhancements

- [ ] **API Backend**: Node.js/Express backend
- [ ] **Database**: MongoDB/PostgreSQL cho metadata
- [ ] **CDN**: CloudFlare cho static assets
- [ ] **Caching**: Redis cho performance
- [ ] **Monitoring**: Error tracking, uptime monitoring

## 📞 Hỗ trợ

### 🐛 Troubleshooting

#### Video không phát được

1. Kiểm tra Google Drive link có public không
2. Xem console browser (F12) có lỗi gì
3. Thử refresh trang
4. Kiểm tra internet connection

#### Website không load

1. Kiểm tra GitHub Pages có hoạt động không
2. Xem repository có public không
3. Kiểm tra file paths trong code
4. Clear browser cache

#### Mobile không responsive

1. Kiểm tra viewport meta tag
2. Test trên different screen sizes
3. Xem CSS media queries
4. Kiểm tra touch events

### 📧 Liên hệ

- **Email**: aizasybxitjpvbi@zohomail.com
- **Email Backup**: manhhoangvipbao@gmail.com
- **Facebook**: https://www.facebook.com/abcxyz
- **Instagram**: https://www.instagram.com/abcxyz/
- **TikTok**: https://www.tiktok.com/@abcxyz

### 🔧 Technical Support

- **GitHub Issues**: Báo bug hoặc feature request
- **Documentation**: Đọc kỹ README này
- **Community**: Tham gia discussion trong Issues

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa cho mục đích cá nhân và thương mại.

## 🙏 Credits

- **Design**: Modern UI/UX với CSS Grid & Flexbox
- **Icons**: Emoji icons cho simplicity
- **Fonts**: System fonts cho performance
- **Images**: Placeholder.com cho demo
- **Video**: Google Drive cho hosting

---

**🎬 Chúc bạn có trải nghiệm xem phim tuyệt vời!**

_Website được phát triển bởi Hoang Manh - 2025_

## Movie JSON Editor (tool bổ trợ)

Đã thêm `movie-editor.html` và `assets/js/movie-editor.js` — một trang nhập liệu đơn giản để tạo/biên tập các entry trong `data/movies.json`.

- Mở `movie-editor.html` bằng trình duyệt.
- Điền `id`, `title` và các trường khác. `genre` và `images.gallery` dùng dấu phẩy để phân tách.
- Dùng "Thêm vào list" để quản lý danh sách, "Tải JSON" để lưu file.
