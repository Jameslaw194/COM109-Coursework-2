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

	// Modal handlers
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

	// jQuery login/signup
	$("#loginForm").on("submit", function (e) {
		e.preventDefault();
		const email = $("#loginEmail").val(); // This input is still using id="loginUsername"
		const password = $("#loginPassword").val();

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
	});

	$("#signupForm").on("submit", function (e) {
		e.preventDefault();
		const email = $("#signupEmail").val();
		const password = $("#signupPassword").val();
		const repeatPassword = $("#signupPasswordRepeat").val();

		if (password !== repeatPassword) {
			alert("Passwords do not match.");
			return;
		}

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
		window.location.href = "dashboard.html";
	});

	
});
