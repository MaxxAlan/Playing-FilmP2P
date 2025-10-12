(function() {
  const { $, toast } = window.$u;
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();
    if (!name || !email || !message) { toast('Vui lòng điền đầy đủ thông tin', 'error'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Email không hợp lệ', 'error'); return; }
    toast('Đã ghi nhận liên hệ! (demo, không gửi server)', 'success');
    form.reset();
  });
})();


