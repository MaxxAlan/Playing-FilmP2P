import React, { useState } from 'react';
import SendIcon from '../components/icons/SendIcon';

const ContactPage: React.FC = () => {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('');
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      // Nhớ thay thế URL này bằng Form Endpoint duy nhất của bạn từ Formspree
      const response = await fetch("https://formspree.io/f/mblzpgzw", { 
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
        form.reset();
      } else {
        const responseData = await response.json();
        if (Object.prototype.hasOwnProperty.call(responseData, 'errors')) {
          setStatus(responseData["errors"].map((error: any) => error["message"]).join(", "));
        } else {
          setStatus("Đã có lỗi xảy ra khi gửi tin nhắn.");
        }
      }
    } catch (error) {
      setStatus("Lỗi mạng, không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // FIX: Simplified the class string to use CSS variables for both light and dark themes consistently.
  const inputClass = "w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition";
  
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-card rounded-2xl border border-border">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Liên hệ với chúng tôi</h1>
        <p className="text-muted mt-2">Hãy để lại thông tin, chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-muted mb-2">Họ và tên</label>
          <input id="name" name="name" type="text" placeholder="Nhập họ tên của bạn" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">Email</label>
          <input id="email" name="_replyto" type="email" placeholder="Nhập địa chỉ email" required className={inputClass} />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-muted mb-2">Nội dung</label>
          <textarea id="message" name="message" rows={6} placeholder="Nội dung tin nhắn của bạn..." required className={inputClass}></textarea>
        </div>
        <div>
          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-wait">
            <SendIcon className="w-5 h-5" />
            <span>{isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}</span>
          </button>
        </div>
        <p className="text-xs text-center text-muted !mt-4">
          Trang này được bảo vệ bởi reCAPTCHA và 
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-link"> Chính sách quyền riêng tư </a>
          cũng như 
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-link"> Điều khoản dịch vụ </a>
          của Google được áp dụng.
        </p>
      </form>
      {status && <p aria-live="polite" className={`mt-4 text-center text-sm ${status.includes('lỗi') ? 'text-red-500' : 'text-green-500'}`}>{status}</p>}
    </div>
  );
};

export default ContactPage;