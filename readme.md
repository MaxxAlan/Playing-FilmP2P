

# 🎬 Playing-FilmP2P

**Xem phim online chỉ với frontend tĩnh + Google Drive làm media storage**
Không cần backend server.

## 🚀 Tính năng chính

* Load dữ liệu phim từ JSON remote (GitHub Raw)
* Hỗ trợ phim lẻ & phim bộ (episodes)
* Tìm kiếm, lọc, sắp xếp phim (tên, năm, thể loại, đánh giá)
* Responsive cho desktop & mobile
* Giao diện đa trang: home, categories, search, about, contact, 404
* Player tích hợp Google Drive iframe + chế độ fullscreen

## 🧩 Cấu trúc dự án (tóm)

```
/ (root)
├── index.html, movie.html, categories.html, search.html, about.html, contact.html, 404.html  
├── style.css  
├── assets/
│   └── js/ (main.js, player.js, utils.js, …)  
├── images/, thumbnails/  
└── README.md  
```

## ⚙️ Cách chạy & triển khai

1. Upload video + poster lên Google Drive, đặt chế độ chia sẻ công khai → lấy `driveId`.
2. Soạn / chỉnh `movies.json` (theo schema phim lẻ / phim bộ) → push lên repo JSON remote.
3. Đẩy front-end code lên GitHub Pages (branch `main`, root) để host tĩnh.

## 📦 Lưu ý & hạn chế

* Giới hạn băng thông Drive (~100-200 GB/ngày/file)
* Người truy cập đồng thời nhiều có thể gây nghẽn
* Không có hệ thống xác thực → ai có link đều xem được
* Dữ liệu người dùng chỉ lưu trong `localStorage`

## 🛠 Hướng mở rộng (Roadmap)

* PWA / Service Worker / cache offline
* Hệ thống đánh giá, bình luận
* Gợi ý phim tương tự, API tìm kiếm nâng cao
* Hỗ trợ nhiều chất lượng video, subtitle, tự động play tập tiếp

## 📄 License & Bản quyền

MIT License — dùng & chia sẻ tự do.
Project open source, cộng đồng có thể đóng góp.
---

## ☕ Ủng hộ dự án

Dự án phát triển hoàn toàn miễn phí.
Nếu bạn thấy hữu ích và muốn “mời tôi một ly cà phê” để tiếp thêm động lực.
Cảm ơn bạn đã ủng hộ! MOMO, BANK-Eximbank: 0364219021


<img width="337" height="344" alt="image" src="https://github.com/user-attachments/assets/f2e366b0-3ced-4d6f-9d50-66629863ef68" />
