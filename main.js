/*
    <!--
    CARANTO, CRISIANE JOSEF A.
    MANGALIMAN, ROLAIGNE E.
    VELASCO, AIKEN A.

    CYB 202
    INTROWEB - FINAL REQUIREMENT - MAIN JAVASCRIPT
    -->
*/

document.addEventListener('DOMContentLoaded', () => {
    setupLogin();
    setupSignup();
});

/* ============================================
    LOGIN FORM
============================================= */
    
function setupLogin() {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassBtn = document.getElementById('toggle-pass');
    const googleBtn = document.getElementById('google');
    const canvasBtn = document.getElementById('canvas');
    const canvasOption = document.getElementById('canvas-option');
    const canvasContinue = document.getElementById('canvas-btn');
    const selectUniv = document.getElementById('select-univ');
    const hauLogo = document.getElementById('hau-logo');

    //Student login credentials
    const validUser = "Tolits";
    const validEmail = "linakoTatamarin@gmail.com"
    const validPass = "uno1saiwebpls_";
   
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
        
            const enteredValue = emailInput.value.trim();
            const enteredPass = passwordInput.value.trim();

            if ((enteredValue === validUser || enteredValue === validEmail) && enteredPass === validPass) {
                const displayName = (enteredValue === validEmail) ? validUser : enteredValue;
                localStorage.setItem('linaUsername', displayName);

                alert("Login successfully! Welcome back, " + displayName + ".");
                window.location.href = "home.html";
            }
            else {
                alert("LOGIN FAILED: Invalid username/email or password. Please try again.");
            }
        });
    }

    if (togglePassBtn && passwordInput) {
        togglePassBtn.addEventListener('click', () => {
            const icon = togglePassBtn.querySelector('i');
            const willShow = passwordInput.type === 'password';

            passwordInput.type = willShow ? 'text' : 'password';
            icon.classList.toggle('fa-eye', willShow);
            icon.classList.toggle('fa-eye-slash', !willShow);

            const label = willShow ? 'Hide password' : 'Show password';
          togglePassBtn.setAttribute('aria-label', label);
            togglePassBtn.setAttribute('title', label);
        });
    }

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            localStorage.setItem('linaUsername', validUser);
            window.location.href = 'home.html';
        });
    }

    if (canvasBtn && canvasOption) {
        canvasBtn.addEventListener('click', () => {
            canvasOption.classList.toggle('canvas-hidden');
            canvasOption.classList.toggle('canvas-visible');
            if (canvasOption.classList.contains('canvas-visible')) {
                canvasOption.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    if (canvasContinue) {
        canvasContinue.addEventListener('click', () => {
            if (selectUniv && !selectUniv.value) {
                alert("Please select your university before continuing with Canvas.");
                return;
            }
            localStorage.setItem('linaUsername', validUser);
            window.location.href = 'home.html';
        });
    }

    if (selectUniv && hauLogo) {
        selectUniv.addEventListener('change', () => {
            hauLogo.style.display = selectUniv.value === 'hau' ? 'inline-block' : 'none';
        });
    }

    const usernameDisplay = document.getElementById('username-display');
    const savedUser = localStorage.getItem('linaUsername');

    if (savedUser && usernameDisplay) {
        usernameDisplay.textContent = savedUser;
    }
}

/* ============================================
    SIGNUP FORM
============================================= */

function setupSignup() {
    const signupForm = document.getElementById('get-started-form');
    if(!signupForm) return;

    const firstName = document.getElementById('first-name');
    const lastName = document.getElementById('last-name');
    const email = document.getElementById('email');
    const username = document.getElementById('username');
    const password = document.getElementById('enter-password')
    const confirmPassword = document.getElementById('confirm-password');     
    const togglePassBtn = document.getElementById('toggle-pass');
    const toggleConfirmBtn = document.getElementById('toggle-confirm-pass');
    
    function wireToggle(btn, input) {
            if (!btn || !input) return;
            btn.addEventListener('click', () => {
                const icon = btn.querySelector('i');
                const willShow = input.type === 'password';
                input.type = willShow ? 'text' : 'password';
                if (icon) {
                    icon.classList.toggle('fa-eye', willShow);
                    icon.classList.toggle('fa-eye-slash', !willShow);
                }
                const label = willShow ? 'Hide password' : 'Show password';
                btn.setAttribute('aria-label', label);
                btn.setAttribute('title', label);
            });
        }

        wireToggle(togglePassBtn, password);
        wireToggle(toggleConfirmBtn, confirmPassword);

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!firstName.value.trim() || !email.value.trim() || !username.value.trim() || !password.value.trim()) {
                alert("SIGNUP FAILED: Please fill out all required fields.");
                return;
            }

            if (password.value !== confirmPassword.value) {
                alert("SIGNUP FAILED: Passwords do not match.");
                return;
            }

            localStorage.setItem('signupFirstName', firstName.value.trim());
            localStorage.setItem('signupLastName', lastName.value.trim());
            localStorage.setItem('signupEmail', email.value.trim());
            localStorage.setItem('signupUsername', username.value.trim());
            localStorage.setItem('signupPassword', password.value);
            localStorage.setItem('linaUsername', username.value.trim());

            alert("Account created successfully! Welcome, " + username.value.trim() + ".");
            window.location.href = "home.html";
        });
    }

/* ============================================
    Dark Mode
============================================= */
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme(); // Check and apply dark mode on every page load
    setupLogin();
    setupSignup();
});

/**
 * Checks localStorage and applies the dark theme if saved as enabled.
 */
function applySavedTheme() {
    const savedTheme = localStorage.getItem('linaDarkMode');
    if (savedTheme === 'enabled') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}