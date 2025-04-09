document.addEventListener("DOMContentLoaded", function () {
	const form = document.getElementById("change-password-form");
	const message = document.getElementById("password-message");

	form.addEventListener("submit", function (e) {
		e.preventDefault();

		const currentPassword = document.getElementById("current-password").value;
		const newPassword = document.getElementById("new-password").value;
		const confirmPassword = document.getElementById("confirm-password").value;

		const email = getCookie("email");
		if (!email || !localStorage.getItem(email)) {
			message.textContent = "You're not logged in.";
			message.style.color = "red";
			return;
		}

		const userData = JSON.parse(localStorage.getItem(email));

		if (currentPassword !== userData.password) {
			message.textContent = "Current password is incorrect.";
			message.style.color = "red";
			return;
		}

		if (newPassword !== confirmPassword) {
			message.textContent = "New passwords do not match.";
			message.style.color = "red";
			return;
		}

		if (newPassword.length < 8 || 
			!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
			message.textContent = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
			message.style.color = "red";
			return;
		}

		// Update password
		userData.password = newPassword;
		localStorage.setItem(email, JSON.stringify(userData));
		message.textContent = "Password changed successfully!";
		message.style.color = "green";

		// Optional: Clear form
		form.reset();
	});

	// Helper: Get cookie value
	function getCookie(name) {
		const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
		return match ? decodeURIComponent(match[2]) : null;
	}
});
