function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }
  
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }
  
  // Close modals when clicking outside
  window.onclick = function (event) {
    const modals = ["loginModal", "signupModal"];
    modals.forEach((id) => {
      const modal = document.getElementById(id);
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
  };
  
  // jQuery form validation and storage
  $(document).ready(function () {
    // Handle login
    $("#loginForm").on("submit", function (e) {
      e.preventDefault();
      const username = $("#loginUsername").val();
      const password = $("#loginPassword").val();
  
      const storedUser = localStorage.getItem(username);
      if (!storedUser) {
        alert("User not found.");
      } else {
        const userData = JSON.parse(storedUser);
        if (userData.password === password) {
          alert("Login successful!");
          document.cookie = `username=${username}; path=/`;
          closeModal("loginModal");
        } else {
          alert("Incorrect password.");
        }
      }
    });
  
    // Handle signup
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
    });
  });
  