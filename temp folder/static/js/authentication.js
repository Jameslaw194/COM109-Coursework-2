document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const submitBtn = document.getElementById("submit-btn");
    const switchFormLink = document.getElementById("switch-form");
    const confirmPasswordGroup = document.getElementById("confirm-password-group");

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    let isSignup = false;

    // Check if user is logged in
    if (getCookie('loggedIn')) {
        updateNavbarForLoggedInUser();
    } else {
        showLoginSignupLinks();
    }

    switchFormLink.addEventListener("click", function (e) {
        e.preventDefault();
        isSignup = !isSignup;

        if (isSignup) {
            formTitle.textContent = "Sign Up";
            submitBtn.textContent = "Sign Up";
            switchFormLink.textContent = "Already have an account? Login";
            confirmPasswordGroup.style.display = "block";
        } else {
            formTitle.textContent = "Login";
            submitBtn.textContent = "Login";
            switchFormLink.textContent = "Don't have an account? Sign up";
            confirmPasswordGroup.style.display = "none";
        }
    });

    document.getElementById("auth-form").addEventListener("submit", function (e) {
        e.preventDefault();
        
        clearErrors();

        let isValid = true;

        if (!validateEmail(emailInput.value)) {
            showError(emailInput, "Please enter a valid email address.");
            isValid = false;
        }

        if (passwordInput.value.length < 6) {
            showError(passwordInput, "Password must be at least 6 characters.");
            isValid = false;
        }

        if (isSignup && passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, "Passwords do not match.");
            isValid = false;
        }

        if (isValid) {
            setCookie('loggedIn', true, 7);
            window.location.href = "/index.html";
        }
    });

    function showError(input, message) {
        const errorElement = document.createElement("div");
        errorElement.classList.add("error-message");
        errorElement.textContent = message;
        input.parentElement.appendChild(errorElement);
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll(".error-message");
        errorMessages.forEach(function (errorMessage) {
            errorMessage.remove();
        });
    }

    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA0-9]{2,6}$/;
        return regex.test(email);
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        let nameEq = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEq) === 0) {
                return c.substring(nameEq.length, c.length);
            }
        }
        return "";
    }

    function deleteCookie(name) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }

    function updateNavbarForLoggedInUser() {
        const loginLink = document.getElementById("login-link");
        const signupLink = document.getElementById("signup-link");
        const logoutLink = document.getElementById("logout-link");

        if (loginLink) loginLink.style.display = "none";
        if (signupLink) signupLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "block";
        
        logoutLink.addEventListener("click", function (e) {
            e.preventDefault();
            deleteCookie('loggedIn');
            window.location.href = "/index.html";
        });
    }

    function showLoginSignupLinks() {
        const loginLink = document.getElementById("login-link");
        const signupLink = document.getElementById("signup-link");
        const logoutLink = document.getElementById("logout-link");

        if (loginLink) loginLink.style.display = "block";
        if (signupLink) signupLink.style.display = "block";
        if (logoutLink) logoutLink.style.display = "none";
    }
});
