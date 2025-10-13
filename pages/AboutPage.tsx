import React from 'react';

const FeatureItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-6 bg-input rounded-2xl text-left border border-border">
    <h3 className="text-lg font-semibold text-link mb-3">{title}</h3>
    <p className="text-muted leading-normal">{children}</p>
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 sm:py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-link mb-6">Về dự án của chúng tôi</h1>
      <p className="text-lg text-foreground leading-relaxed mb-12">
        Website xem phim nhẹ nhất, phát video từ Google công khai mọi đường dẫn nguồn phim. Thiết kế hiện đại, responsive và tối ưu hóa trải nghiệm người dùng.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureItem title="📱 Responsive Design">
          Trải nghiệm xem phim mượt mà trên mọi thiết bị, từ điện thoại đến máy tính.
        </FeatureItem>
        <FeatureItem title="⚡ Tốc độ nhanh">
          Tối ưu hóa hiệu suất, tải trang nhanh chóng để bạn không phải chờ đợi.
        </FeatureItem>
        <FeatureItem title="🔓 Mã nguồn mở">
          Dự án mã nguồn mở, cho phép cộng đồng cùng đóng góp và phát triển.
        </FeatureItem>
      </div>
    </div>
  );
};

export default AboutPage;
