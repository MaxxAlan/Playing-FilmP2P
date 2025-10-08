// Contact Page Handler
class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeFAQ();
    }

    bindEvents() {
        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Real-time form validation
        const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea, #contact-form select');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    initializeFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherToggle = otherItem.querySelector('.faq-toggle');
                        otherToggle.textContent = '+';
                    }
                });

                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    toggle.textContent = '+';
                } else {
                    item.classList.add('active');
                    toggle.textContent = '-';
                }
            });
        });
    }

    handleFormSubmission() {
        const form = document.getElementById('contact-form');
        const formData = new FormData(form);
        
        // Validate all fields
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (!isValid) {
            Utils.showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Đang gửi...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Show success message
            Utils.showToast('Tin nhắn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.', 'success', 5000);
            
            // Reset form
            form.reset();
            
            // Save to localStorage for demo purposes
            this.saveContactSubmission(formData);
            
        }, 2000);
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Trường này là bắt buộc';
        }

        // Email validation
        if (fieldName === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email không hợp lệ';
            }
        }

        // Phone validation
        if (fieldName === 'phone' && value) {
            const phoneRegex = /^[0-9\-\+\(\)\s]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                isValid = false;
                errorMessage = 'Số điện thoại không hợp lệ';
            }
        }

        // Message length validation
        if (fieldName === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Nội dung phải có ít nhất 10 ký tự';
        }

        // Show error if validation fails
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            let errorElement = formGroup.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                formGroup.appendChild(errorElement);
            }
            errorElement.textContent = message;
            
            // Add error styling
            field.classList.add('error');
            formGroup.classList.add('has-error');
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            const errorElement = formGroup.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
            
            // Remove error styling
            field.classList.remove('error');
            formGroup.classList.remove('has-error');
        }
    }

    saveContactSubmission(formData) {
        // Save contact submission to localStorage for demo
        const submission = {
            id: Utils.generateId(),
            timestamp: new Date().toISOString(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            status: 'pending'
        };

        const submissions = Utils.getFromStorage('contactSubmissions', []);
        submissions.unshift(submission);
        
        // Keep only last 50 submissions
        submissions.splice(50);
        
        Utils.saveToStorage('contactSubmissions', submissions);
        
        console.log('Contact submission saved:', submission);
    }

    // Chat functionality (placeholder)
    openChat() {
        Utils.showToast('Tính năng chat trực tuyến đang được phát triển', 'info');
    }
}

// Global function for chat button
function openChat() {
    const contactPage = new ContactPage();
    contactPage.openChat();
}

// Initialize contact page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPage();
});
