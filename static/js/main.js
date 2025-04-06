// Apply dark mode as early as possible to prevent flash of unstyled content
if (localStorage.getItem("darkMode") === "enabled") {
    document.documentElement.classList.add("dark");
}

document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // Check stored dark mode preference again just in case
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
    }

    // Toggle dark mode function
    function toggleDarkMode() {
        if (body.classList.contains("dark")) {
            body.classList.remove("dark");
            localStorage.setItem("darkMode", "disabled");
        } else {
            body.classList.add("dark");
            localStorage.setItem("darkMode", "enabled");
        }
    }

    // Bind toggle if it exists
    if (darkModeToggle) {
        darkModeToggle.checked = body.classList.contains("dark");
        darkModeToggle.addEventListener("change", toggleDarkMode);
    }
});
