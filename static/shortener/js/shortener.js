
const originalUrlInput = document.getElementById('originalUrl');
const urlPasswordInput = document.getElementById('urlPassword');
const enablePasswordCheckbox = document.getElementById('enablePassword');
const passwordSection = document.getElementById('passwordSection');
const showPasswordCheckbox = document.getElementById('showPassword');
const shortenButton = document.getElementById('shortenButton');
const resultDiv = document.getElementById('result');
const shortUrlInput = document.getElementById('shortUrl');
const copyButton = document.getElementById('copyButton');
const passwordProtectedMsg = document.getElementById('passwordProtectedMsg');
const removePassword = document.getElementById('changepassword')
// Handle password section visibility toggle
const inputList = [originalUrlInput, urlPasswordInput]
inputList.forEach((input) => {
    try {
        input.addEventListener('keypress', function (e) {
            if (e.key.toLowerCase() == 'enter') {
                shortenFunc()
            }
        })
    }
    catch {
        console.log('particular input not available')
    }
})
try {
    enablePasswordCheckbox.addEventListener('change', function () {
        passwordSection.classList.toggle('show', this.checked);
        if (!this.checked) {
            urlPasswordInput.value = ''; // Clear password when section is hidden
            showPasswordCheckbox.checked = false;
            urlPasswordInput.type = 'password';
        }
    });
}
catch {
    console.log('enable password not available in this page')
}

// Handle password visibility toggle
showPasswordCheckbox.addEventListener('change', function () {
    urlPasswordInput.type = this.checked ? 'text' : 'password';
});
shortenFunc = async () => {
    const url = originalUrlInput.value.trim();
    const password = enablePasswordCheckbox.checked ? urlPasswordInput.value.trim() : '';

    if (!url) {
        alert('Please enter a valid URL');
        return;
    }

    if (enablePasswordCheckbox.checked && !password) {
        alert('Please enter a password or uncheck the password protection option');
        return;
    }

    try {
        const response = await fetch('/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify({
                url: url,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            shortUrlInput.value = data.short_url;
            resultDiv.classList.add('show');

            if (data.is_password_protected) {
                passwordProtectedMsg.classList.add('show');
            } else {
                passwordProtectedMsg.classList.remove('show');
            }

            // Clear inputs and reset form
            originalUrlInput.value = '';
            urlPasswordInput.value = '';
            enablePasswordCheckbox.checked = false;
            showPasswordCheckbox.checked = false;
            urlPasswordInput.type = 'password';
            passwordSection.classList.remove('show');
        } else {
            alert(data.error || 'An error occurred');
        }
    } catch (error) {
        alert('An error occurred while shortening the URL');
    }
}
try {

    shortenButton.addEventListener('click', shortenFunc);
} catch {
    console.log('shorten button not available in this page')
}
try {
    copyButton.addEventListener('click', () => {
        shortUrlInput.select();
        document.execCommand('copy');

        copyButton.textContent = 'Copied!';
        copyButton.classList.add('copy-success');

        setTimeout(() => {
            copyButton.textContent = 'Copy';
            copyButton.classList.remove('copy-success');
        }, 2000);
    });
} catch {
    console.log('copy button not available in this page')
}


function getCsrfToken() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'csrftoken') {
            return value;
        }
    }
    return '';
}
