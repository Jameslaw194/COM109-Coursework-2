document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // Check stored dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
    }
    

    // Function to toggle dark mode
    function toggleDarkMode() {
        if (body.classList.contains("dark")) {
            body.classList.remove("dark");
            localStorage.setItem("darkMode", "disabled");
        } else {
            body.classList.add("dark");
            localStorage.setItem("darkMode", "enabled");
        }
    }

    // If toggle exists on the page, add event listener
    if (darkModeToggle) {
        darkModeToggle.checked = body.classList.contains("dark");
        darkModeToggle.addEventListener("change", toggleDarkMode);
    }
});
