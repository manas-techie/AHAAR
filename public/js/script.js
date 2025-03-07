
// navbar active link logic

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


// new form novalidate logic

(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()
  


  // For flash disappear logic

  document.addEventListener("DOMContentLoaded", function () {
    let flashMessage = document.querySelector(".flash-message");
    if (flashMessage) {
        setTimeout(() => {
            let bsAlert = new bootstrap.Alert(flashMessage);
            bsAlert.close();
        }, 3000); // Hide after 3 seconds
    }
});



// Navbar Dropdown logic

document.addEventListener("DOMContentLoaded", function () {
  const profileIcon = document.getElementById("profile-icon");
  const dropdownMenu = document.getElementById("dropdown-menu");

  profileIcon.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevents event bubbling
      dropdownMenu.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (event) {
      if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.remove("show");
      }
  });
});