document.addEventListener("DOMContentLoaded", function () {
    const formTitle = document.getElementById("form-title");
    const submitBtn = document.getElementById("submit-btn");
    const switchFormLink = document.getElementById("switch-form");
    const confirmPasswordGroup = document.getElementById("confirm-password-group");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    console.log('Main.js loaded!')
    let isSignup = false;
    
    // Check if user is logged in
    checkLoginStatus();
    
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

    document.getElementById("auth-form").addEventListener("submit", async function (e) {
        e.preventDefault();
        
        // Clear existing errors
        clearErrors();

        // Validate form inputs
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

        if (!isValid) {
            console.log('Validation failed');
            return;
        }

        try {
            if (isSignup) {
                // Handle signup flow
                await handleSignup(emailInput.value, passwordInput.value);
                alert('Account created successfully!');
            } else {
                // Handle login flow
                await handleLogin(emailInput.value, passwordInput.value);
            }
            
            // Store account info and redirect
            saveAccountInfo(
                emailInput.value.split('@')[0],
                emailInput.value,
                true
            );
            window.location.href = "/dashboard.html";
        } catch (error) {
            console.error('Authentication failed:', error);
            showError(passwordInput, error.message || "Authentication failed");
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
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    }

    function saveAccountInfo(username, email, isLoggedIn) {
        const accountData = {
            username: username,
            email: email,
            isLoggedIn: isLoggedIn,
            lastLogin: new Date().toISOString()
        };
        localStorage.setItem('accountInfo', JSON.stringify(accountData));
    }

    function getAccountInfo() {
        const stored = localStorage.getItem('accountInfo');
        return stored ? JSON.parse(stored) : null;
    }

    function removeAccountInfo() {
        localStorage.removeItem('accountInfo');
    }

    function updateNavbarForLoggedInUser() {
        const loginLink = document.getElementById("login-link");
        const signupLink = document.getElementById("signup-link");
        const logoutLink = document.getElementById("logout-link");
        const accountInfo = getAccountInfo();
        
        if (accountInfo?.isLoggedIn) {
            if (loginLink) loginLink.style.display = "none";
            if (signupLink) signupLink.style.display = "none";
            if (logoutLink) {
                logoutLink.style.display = "block";
                logoutLink.textContent = `Logout (${accountInfo.username})`;
                
                logoutLink.addEventListener("click", function (e) {
                    e.preventDefault();
                    removeAccountInfo();
                    window.location.href = "/index.html";
                });
            }
        }
    }

    function showLoginSignupLinks() {
        const loginLink = document.getElementById("login-link");
        const signupLink = document.getElementById("signup-link");
        const logoutLink = document.getElementById("logout-link");
        
        if (loginLink) loginLink.style.display = "block";
        if (signupLink) signupLink.style.display = "block";
        if (logoutLink) logoutLink.style.display = "none";
    }

    function checkLoginStatus() {
        const accountInfo = getAccountInfo();
        if (accountInfo?.isLoggedIn) {
            updateNavbarForLoggedInUser();
        } else {
            showLoginSignupLinks();
        }
    }

    async function handleSignup(email, password) {
        try {
            if (!validateEmail(email)) {
                throw new Error('Invalid email address');
            }
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            
            // Store the new user in localStorage
            saveAccountInfo(
                email.split('@')[0],
                email,
                true
            );
            
            return true;
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    }

    async function handleLogin(email, password) {
        try {
            const existingAccount = getAccountInfo();
            if (!existingAccount || existingAccount.email !== email) {
                throw new Error('Invalid email or password');
            }
            
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }
});