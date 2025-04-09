// Apply dark mode as early as possible to prevent flash of unstyled content
if (localStorage.getItem("darkMode") === "enabled") {
    document.documentElement.classList.add("dark");
}

document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // Dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
    }

    function toggleDarkMode() {
        if (body.classList.contains("dark")) {
            body.classList.remove("dark");
            localStorage.setItem("darkMode", "disabled");
        } else {
            body.classList.add("dark");
            localStorage.setItem("darkMode", "enabled");
        }
    }

    if (darkModeToggle) {
        darkModeToggle.checked = body.classList.contains("dark");
        darkModeToggle.addEventListener("change", toggleDarkMode);
    }

    // Login/Signup modal handlers
    window.openModal = function (modalId) {
        document.getElementById(modalId).style.display = "block";
    };

    window.closeModal = function (modalId) {
        document.getElementById(modalId).style.display = "none";
    };

    window.onclick = function (event) {
        const modals = ["loginModal", "signupModal"];
        modals.forEach((id) => {
            const modal = document.getElementById(id);
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    };

    // --- jQuery Login Validation ---
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();
        let isValid = true;
        const email = $("#loginEmail").val().trim();
        const password = $("#loginPassword").val();

        // Email validation
        if (!email) {
            $("#loginEmail").addClass("error");
            $("#loginEmail").next(".error-message").text("Please enter your email.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            $("#loginEmail").addClass("error");
            $("#loginEmail").next(".error-message").text("Please enter a valid email address.");
            isValid = false;
        } else {
            $("#loginEmail").removeClass("error");
            $("#loginEmail").next(".error-message").text("");
        }

        // Password validation
        if (!password) {
            $("#loginPassword").addClass("error");
            $("#loginPassword").next(".error-message").text("Please enter your password.");
            isValid = false;
        } else {
            $("#loginPassword").removeClass("error");
            $("#loginPassword").next(".error-message").text("");
        }

        if (isValid) {
            const storedUser = localStorage.getItem(email);
            if (!storedUser) {
                alert("User not found.");
            } else {
                const userData = JSON.parse(storedUser);
                if (userData.password === password) {
                    alert("Login successful!");
                    document.cookie = `email=${email}; path=/`;
                    closeModal("loginModal");
                    window.location.href = "dashboard.html";
                } else {
                    alert("Incorrect password.");
                }
            }
        }
    });

    // --- jQuery Signup Validation ---
    $("#signupForm").on("submit", function (e) {
        e.preventDefault();
        let isValid = true;
        const email = $("#signupEmail").val().trim();
        const password = $("#signupPassword").val();
        const repeatPassword = $("#signupPasswordRepeat").val();

        // Email validation
        if (!email) {
            $("#signupEmail").addClass("error");
            $("#signupEmail").next(".error-message").text("Please enter your email.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            $("#signupEmail").addClass("error");
            $("#signupEmail").next(".error-message").text("Please enter a valid email address.");
            isValid = false;
        } else {
            $("#signupEmail").removeClass("error");
            $("#signupEmail").next(".error-message").text("");
        }

        // Password validation
        if (!password) {
            $("#signupPassword").addClass("error");
            $("#signupPassword").next(".error-message").text("Please enter a password.");
            isValid = false;
        } else if (password.length < 8) {
            $("#signupPassword").addClass("error");
            $("#signupPassword").next(".error-message").text("Password must be at least 8 characters long.");
            isValid = false;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            $("#signupPassword").addClass("error");
            $("#signupPassword").next(".error-message").text("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            isValid = false;
        } else {
            $("#signupPassword").removeClass("error");
            $("#signupPassword").next(".error-message").text("");
        }

        // Repeat Password validation
        if (!repeatPassword) {
            $("#signupPasswordRepeat").addClass("error");
            $("#signupPasswordRepeat").next(".error-message").text("Please repeat your password.");
            isValid = false;
        } else if (password !== repeatPassword) {
            $("#signupPasswordRepeat").addClass("error");
            $("#signupPasswordRepeat").next(".error-message").text("Passwords do not match.");
            isValid = false;
        } else {
            $("#signupPasswordRepeat").removeClass("error");
            $("#signupPasswordRepeat").next(".error-message").text("");
        }

        if (isValid) {
            if (localStorage.getItem(email)) {
                alert("Email already registered.");
                return;
            }

            const userData = {
                email,
                password,
            };

            localStorage.setItem(email, JSON.stringify(userData));
            alert("Signup successful! Please log in.");
            closeModal("signupModal");
        }
    });

    // --- Helper function for email validation ---
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add error message containers dynamically
    $("#loginEmail").after('<div class="error-message"></div>');
    $("#loginPassword").after('<div class="error-message"></div>');
    $("#signupEmail").after('<div class="error-message"></div>');
    $("#signupPassword").after('<div class="error-message"></div>');
    $("#signupPasswordRepeat").after('<div class="error-message"></div>');


	// --- Update Sign In Button based on login state ---

	function getCookie(name) {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	}

	function isLoggedIn() {
		const email = getCookie('email');
		return email && localStorage.getItem(email) !== null;
	}

	function updateSignInButton() {
		const signInButton = document.getElementById('signInButton');
		if (signInButton) {
			if (isLoggedIn()) {
				signInButton.textContent = 'Sign Out';
				signInButton.href = '#';
				signInButton.addEventListener('click', function (e) {
					e.preventDefault();
					// Clear login cookie
					document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
					alert("You have been signed out.");
					location.reload(); // Or redirect to homepage
				});
			} else {
				signInButton.textContent = 'Login/Signup';
				signInButton.href = 'loginSignup.html';
			}
		}
	}

	// Call it after everything has loaded
	updateSignInButton();

});
