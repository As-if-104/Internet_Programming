function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  const menuToggle = document.querySelector(".menu-toggle");
  const body = document.body;

  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
  menuToggle.classList.toggle("active");
  body.classList.toggle("sidebar-open");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.querySelector(".sidebar-overlay");
  const menuToggle = document.querySelector(".menu-toggle");
  const body = document.body;

  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  menuToggle.classList.remove("active");
  body.classList.remove("sidebar-open");
}

function toggleSubmenu(element) {
  const navItem = element.parentElement;
  const submenu = navItem.querySelector(".submenu");

  // Close other open submenus
  document.querySelectorAll(".nav-item.open").forEach((item) => {
    if (item !== navItem) {
      item.classList.remove("open");
      item.querySelector(".submenu").classList.remove("open");
    }
  });

  // Toggle current submenu
  navItem.classList.toggle("open");
  submenu.classList.toggle("open");
}

function handleNavClick(action) {
  // Remove active class from all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to clicked link
  event.target.closest(".nav-link").classList.add("active");

  // Handle different navigation actions
  switch (action) {
    case "dashboard":
      if (window.turfTime) {
        window.turfTime.showDashboard();
      }
      break;
    case "new-booking":
      if (window.turfTime) {
        window.turfTime.handleBookNow();
      }
      break;
    case "my-bookings":
      if (window.turfTime) {
        window.turfTime.showDashboard();
      }
      break;
    case "login":
      if (window.turfTime) {
        window.turfTime.showLoginModal();
      }
      break;
    case "contact-us":
      if (window.turfTime) {
        window.turfTime.showContact();
      }
      break;
    default:
      console.log("Navigation:", action);
      // You can add more specific handlers here
      break;
  }

  closeSidebar();
}

function handleLogout() {
  if (window.turfTime) {
    window.turfTime.logout();
  }
  updateSidebarUserInfo();
  closeSidebar();
}

// Update sidebar user info
function updateSidebarUserInfo() {
  const userProfile = document.getElementById("sidebarUserProfile");
  const userAvatar = document.getElementById("sidebarUserAvatar");
  const userName = document.getElementById("sidebarUserName");
  const userEmail = document.getElementById("sidebarUserEmail");
  const logoutItem = document.getElementById("sidebarLogout");
  const authItem = document.getElementById("sidebarAuth");

  // Check if user is logged in (you'll need to integrate this with your existing auth system)
  if (window.currentUser) {
    userName.textContent = window.currentUser.name;
    userEmail.textContent = window.currentUser.email;
    userAvatar.textContent = window.currentUser.name.charAt(0).toUpperCase();
    logoutItem.style.display = "block";
    authItem.style.display = "none";
  } else {
    userName.textContent = "Guest User";
    userEmail.textContent = "Please login";
    userAvatar.textContent = "👤";
    logoutItem.style.display = "none";
    authItem.style.display = "block";
  }
}

// Initialize sidebar on load
document.addEventListener("DOMContentLoaded", function () {
  updateSidebarUserInfo();

  // Update sidebar when user logs in/out
  const originalUpdateAuthState = window.turfTime?.updateAuthState;
  if (originalUpdateAuthState) {
    window.turfTime.updateAuthState = function () {
      originalUpdateAuthState.call(this);
      updateSidebarUserInfo();
    };
  }
});

// Close sidebar when clicking outside
document.addEventListener("click", function (e) {
  const sidebar = document.getElementById("sidebar");
  const menuToggle = document.querySelector(".menu-toggle");

  if (
    !sidebar.contains(e.target) &&
    !menuToggle.contains(e.target) &&
    sidebar.classList.contains("active")
  ) {
    closeSidebar();
  }
});

// Close sidebar on escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeSidebar();
  }
});
