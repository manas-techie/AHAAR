document.addEventListener("DOMContentLoaded", function () {
    // Get the current page URL
    let currentUrl = window.location.pathname;

    // Select all nav links inside the navbar
    let navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    navLinks.forEach(link => {
        // Check if the link's href matches the current URL
        if (link.href.includes(currentUrl)) {
            // Remove 'active' class from any previously active link
            document.querySelector('.navbar-nav .nav-link.active')?.classList.remove('active');
            // Add 'active' class to the current page link
            link.classList.add("active");
        }
    });
});