import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border mt-16 py-10">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted text-sm space-y-4">
        <div className="flex justify-center mb-6">
          <ThemeSwitcher />
        </div>
        <p>Chúng tôi tuyên bố miễn trừ mọi trách nhiệm đối với nội dung được phát.</p>
        <p>Dự án mã nguồn mở, dành cho tất cả mọi người.</p>
        <p className="mt-4 pt-4 border-t border-border/50">© {new Date().getFullYear()} XemPhim • Inspired by @Hoang Manh</p>
      </div>
    </footer>
  );
};

export default Footer;
