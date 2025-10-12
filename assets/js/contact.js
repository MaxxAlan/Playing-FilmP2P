// assets/js/contact.js
(function() {
  const { $, toast } = window.$u;
  const form = $('#contactForm');
  if (!form) return;

  async function handleSubmit(event) {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Vô hiệu hóa nút bấm để tránh gửi nhiều lần
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'Đang gửi...';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
      });

      if (response.ok) {
        toast('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.', 'success');
        form.reset(); // Xóa nội dung form sau khi gửi thành công
      } else {
        const data = await response.json();
        const errorMessage = data.errors?.map(e => e.message).join(', ') || 'Đã có lỗi xảy ra khi gửi.';
        toast(`Lỗi: ${errorMessage}`, 'error');
      }
    } catch (error) {
      toast('Lỗi mạng, không thể gửi tin nhắn. Vui lòng thử lại.', 'error');
    } finally {
      // Kích hoạt lại nút bấm dù thành công hay thất bại
      submitButton.disabled = false;
      submitButton.querySelector('span').textContent = 'Gửi tin nhắn';
    }
  }

  form.addEventListener('submit', handleSubmit);
})();