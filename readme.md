# 🎬 Xem Phim Online - Static Frontend với Google Drive

Ứng dụng xem phim online được xây dựng với **static frontend + Google Drive** làm media storage, không cần backend server.

## 🚀 Tính năng chính

- ✅ **Static Frontend**: Host trên GitHub Pages (HTML + CSS + JS tĩnh)
- ✅ **Google Drive Integration**: Video và hình ảnh lưu trên Google Drive
- ✅ **Responsive Design**: Hoạt động tốt trên mobile và desktop
- ✅ **Tìm kiếm & Lọc**: Tìm phim theo tên, mô tả, thể loại
- ✅ **Lịch sử xem**: Lưu tiến độ xem bằng localStorage
- ✅ **Sắp xếp**: Theo tên, năm, đánh giá, thời lượng
- ✅ **Phím tắt**: F (fullscreen), B (back), Esc (exit fullscreen)
- ✅ **SEO Friendly**: Meta tags động cho từng phim

## 📁 Cấu trúc thư mục

```
/
├── index.html               # Trang chủ: danh sách phim
├── movie.html               # Trang xem phim (Google Drive player)
├── style.css                # CSS chính
├── assets/
│   └── js/
│       ├── main.js          # Load JSON, render danh sách, tìm kiếm
│       ├── player.js        # Google Drive iframe player
│       └── utils.js         # Utility functions
├── data/
│   └── movies.json          # Metadata các phim (driveId, poster, etc.)
└── README.md               # Hướng dẫn này
```

## 🎯 Cách hoạt động

### 1. Frontend (GitHub Pages)
- Host toàn bộ code tĩnh trên GitHub Pages
- Load danh sách phim từ `data/movies.json`
- Render giao diện danh mục và player

### 2. Media Storage (Google Drive)
- Upload video và poster lên Google Drive
- Lấy `driveId` từ link chia sẻ công khai
- Sử dụng iframe preview để phát video

### 3. Metadata (JSON)
- File `movies.json` chứa thông tin phim
- Bao gồm `driveId`, poster URL, mô tả, thể loại

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
    "title": "Inception",
    "year": 2010,
    "poster": "https://example.com/poster.jpg",
    "desc": "A mind-bending thriller by Christopher Nolan.",
    "driveId": "1XyzABCdEfGhIJklMNopQRsTuVw",
    "sub": "",
    "duration": "148 phút",
    "genre": ["Sci-Fi", "Thriller", "Action"],
    "rating": 4.8,
    "category": "phim-le"
  }
]
```

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

### Thêm phim mới
1. Upload video lên Google Drive
2. Lấy Drive ID từ link chia sẻ
3. Thêm entry vào `data/movies.json`
4. Commit và push lên GitHub

### Cập nhật thông tin phim
1. Chỉnh sửa `data/movies.json`
2. Commit và push lên GitHub
3. Website sẽ tự động cập nhật

## 🔧 Tùy chỉnh

### Thay đổi giao diện
- Chỉnh sửa `style.css` để thay đổi màu sắc, layout
- Thêm animation, hiệu ứng theo ý muốn

### Thêm tính năng
- **Phân trang**: Thêm pagination cho danh sách phim
- **Playlist**: Tạo danh sách phát tự động
- **Đánh giá**: Cho phép user đánh giá phim
- **Bình luận**: Tích hợp Disqus hoặc similar

### SEO Optimization
- Thêm meta tags cho từng phim
- Tạo sitemap.xml
- Thêm structured data (JSON-LD)

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

## 🚀 Tính năng nâng cao (có thể thêm)

- [ ] **Service Worker**: Cache offline
- [ ] **PWA**: Progressive Web App
- [ ] **Search API**: Algolia hoặc Elasticsearch
- [ ] **Analytics**: Google Analytics
- [ ] **Comments**: Disqus integration
- [ ] **Ratings**: User rating system
- [ ] **Playlists**: Custom playlists
- [ ] **Subtitle support**: VTT files
- [ ] **Multiple quality**: 720p, 1080p, 4K
- [ ] **Auto-play next**: Play next episode

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Xem GitHub Issues
3. Đảm bảo Google Drive link public
4. Kiểm tra CORS policy

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa.

---

**🎬 Enjoy your movie streaming site!**
