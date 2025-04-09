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
		document.documentElement.classList.toggle('dark');
				const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
				localStorage.setItem('theme', theme);
				
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
});
