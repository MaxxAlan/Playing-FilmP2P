# 🎬 XemPhim Online - Nền Tảng Xem Phim Hiện Đại

Một ứng dụng web xem phim được xây dựng bằng React, TypeScript và Tailwind CSS, mang đến trải nghiệm duyệt và xem phim nhanh chóng, hiện đại và hoàn toàn responsive.

Truy cập trang demo trực tiếp tại: https://xemphimonline.vercel.app/

Vì không thể trực tiếp cập nhập các bộ phim liên tục, nếu bạn thích bộ phim nào mà chúng tôi chưa có hãy cập nhập nó tại đây:

https://film-editor-pro.vercel.app/ hoặc
https://crytals-sc.github.io/json-link/
## ✨ Tính Năng Nổi Bật

- **Giao Diện Hiện Đại**: Thiết kế sạch sẽ, tập trung vào trải nghiệm người dùng với các hiệu ứng chuyển động mượt mà.
- **Hoàn Toàn Responsive**: Tự động điều chỉnh giao diện để tương thích hoàn hảo trên mọi thiết bị.
- **Chủ Đề Sáng & Tối**: Cho phép người dùng dễ dàng chuyển đổi giao diện để phù hợp với sở thích.
- **Tìm Kiếm & Lọc Nâng Cao**: Dễ dàng tìm kiếm phim theo tên, mô tả, năm sản xuất, và thể loại.
- **Trang Chi Tiết Phim**: Cung cấp thông tin đầy đủ, trailer và danh sách các tập phim (nếu có).
- **Trợ Lý AI Chatbot**: Tích hợp Gemini API để gợi ý phim và trả lời câu hỏi của người dùng.
- **Tối Ưu Hóa Hiệu Suất**: Sử dụng kỹ thuật lazy loading cho hình ảnh để tăng tốc độ tải trang.
- **Mã Nguồn Mở**: Sẵn sàng để cộng đồng đóng góp và phát triển.

## 💖 Ủng Hộ Dự Án (Support the Project)

Nếu bạn thấy dự án này hữu ích và muốn hỗ trợ mình, bạn có thể ủng hộ qua mã QR (Momo/VietQR) bên dưới. Sự ủng hộ của bạn, dù nhỏ, cũng là nguồn động viên to lớn để mình tiếp tục phát triển và duy trì dự án.

<img src="https://github.com/user-attachments/assets/540f9876-6ffb-43ac-aa86-478b72cdd86a" alt="Mã QR ủng hộ dự án" width="337" height="344"/>

Xin chân thành cảm ơn!

Bạn cũng có thể ghé thăm hoặc theo dõi mình qua trang GitHub cá nhân [tại đây](https://github.com/MaxxAlan).

## 🚀 Công Nghệ Sử Dụng

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Build Tool**: Vite
- **AI Chatbot**: Google Gemini API
- **Deployment**: GitHub Pages

## 🔧 Cài Đặt và Chạy Dự Án Tại Local

### Yêu cầu:
- Node.js (phiên bản 18.x trở lên)
- npm

### Các bước thực hiện:

1. Clone repository về máy:
   ```
   git clone https://github.com/MaxxAlan/Playing-FilmP2P.git
   cd Playing-FilmP2P
   ```

2. Cài đặt các gói phụ thuộc:
   ```
   npm install
   ```

3. Tạo tệp môi trường:
   Tạo một tệp `.env` ở thư mục gốc và thêm khóa API của bạn vào:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   Lưu ý: Để lấy Gemini API key, hãy truy cập [Google AI Studio](https://aistudio.google.com/).

4. Chạy máy chủ phát triển:
   ```
   npm run dev
   ```

   Mở trình duyệt và truy cập `http://localhost:3000`.

## 🌐 Triển Khai Lên GitHub Pages

1. Cài đặt gh-pages:
   ```
   npm install gh-pages --save-dev
   ```

2. Cập nhật package.json:
   Mở tệp `package.json` và thêm/cập nhật các dòng sau:
   - Thêm `homepage` ở đầu tệp:
     ```
     "homepage": "https://MaxxAlan.github.io/Playing-FilmP2P",
     ```

   - Thêm script `predeploy` và `deploy`:
     ```
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview",
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     ```

3. Cập nhật vite.config.ts:
   Mở tệp `vite.config.ts` và thêm thuộc tính `base`:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     base: '/Playing-FilmP2P/', 
     plugins: [react()],
   })
   ```

4. Triển khai:
   Chạy lệnh sau trong terminal:
   ```
   npm run deploy
   ```

5. Cấu hình GitHub Repository:
   - Vào Settings > Pages.
   - Dưới mục Source, chọn Deploy from a branch.
   - Dưới mục Branch, chọn nhánh gh-pages và thư mục /(root), sau đó Save.
   - Chờ vài phút, trang web của bạn sẽ có tại: https://user-name.github.io/repo/.

## 📄 Giấy Phép (License)

Dự án này được cấp phép theo Giấy phép MIT.

## 🙏 Lời Cảm Ơn
- Mã nguồn của dự án là công khai, tự do chỉnh sửa, cải thiện.
- Cảm hứng từ một web xem phim xưa, công khai mọi link nguồn.
- Dữ liệu phim có trong web này sẽ luôn công khai cho cộng đồng.
