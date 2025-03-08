
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


// Navbar Toggle Logic

document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const sidebarMenu = document.getElementById("sidebarMenu");

  menuToggle.addEventListener("click", function () {
    sidebarMenu.classList.toggle("active");
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (event) {
    if (!sidebarMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebarMenu.classList.remove("active");
    }
  });
});

//js code for add new item field in menuForm
function addItemField() {
  let itemFields = document.getElementById("itemFields");

  let newItemGroup = document.createElement("div");
  newItemGroup.classList.add("mb-3", "item-group");

  newItemGroup.innerHTML = `
      <label class="form-label">Item Name & Price</label>
      <div class="input-group">
          <input type="text" name="itemName[]" class="form-control" placeholder="Enter item name" required>
          <input type="number" name="itemPrice[]" class="form-control" placeholder="Enter item price" required>
          <button type="button" class="btn btn-danger" onclick="removeItemField(this)">-</button>
      </div>
  `;

  itemFields.appendChild(newItemGroup);
}

function removeItemField(button) {
  button.closest(".item-group").remove();
}



//Disable one of the category in a single time JS code
document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("category");
  const newCategoryInput = document.getElementById("newCategory");

  // Disable one field when the other is used
  categorySelect.addEventListener("change", function () {
    if (this.value) {
      newCategoryInput.disabled = true;
    } else {
      newCategoryInput.disabled = false;
    }
  });

  newCategoryInput.addEventListener("input", function () {
    if (this.value.trim() !== "") {
      categorySelect.disabled = true;
    } else {
      categorySelect.disabled = false;
    }
  });
});








$(document).ready(function () {
  $(".category-btn").click(function () {
    let categoryId = $(this).data("category");
    console.log("hee..........hee..........hoo..........hoo")
    $.ajax({
      url: "/menu/items/" + categoryId,
      method: "GET",
      success: function (items) {
        let html = "";
        if (items.length > 0) {
          items.forEach(item => {
            html += `
                          <div class="col-md-4 mb-3 item-card">
                              <div class="card">
                                  <img src="https://via.placeholder.com/200" class="card-img-top" alt="${item.name}">
                                  <div class="card-body text-center">
                                      <h5 class="card-title">${item.name}</h5>
                                      <p class="card-text">£${item.itemPrice.toFixed(2)}</p>
                                  </div>
                              </div>
                          </div>
                      `;
          });
        } else {
          html = '<p class="text-center">No items available.</p>';
        }
        $("#itemsContainer").html(html);
      }
    });
  });
});