document.addEventListener('DOMContentLoaded', () => {
    // Auto-hide messages after 5 seconds
    const messages = document.querySelectorAll('.message');
    messages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 300);
        }, 5000);
    });

    // Password visibility toggle for login/register forms
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const showPasswordCheckboxes = document.querySelectorAll('.show-password');

    showPasswordCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function () {
            const passwordInput = passwordInputs[index];
            passwordInput.type = this.checked ? 'text' : 'password';
        });
    });

    // Handle password visibility toggles
    const passwordToggles = document.querySelectorAll('.show-password');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            // Find the closest password input within the same form-group
            const passwordWrapper = this.closest('.password-wrapper');
            const passwordInput = passwordWrapper.querySelector('input[type="password"], input[type="text"]');

            if (passwordInput) {
                passwordInput.type = this.checked ? 'text' : 'password';
            }
        });
    });

    // Add HTML5 validation classes to form inputs
    const formInputs = document.querySelectorAll('.auth-form input[type="text"], .auth-form input[type="password"], .auth-form input[type="email"]');

    formInputs.forEach(input => {
        // Add required class for styling
        if (input.hasAttribute('required')) {
            input.classList.add('required');
        }

        // Add validation styling on blur
        input.addEventListener('blur', function () {
            if (this.value.trim() === '' && this.hasAttribute('required')) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });

        // Remove error styling when user starts typing
        input.addEventListener('input', function () {
            this.classList.remove('error');
        });
    });
});
