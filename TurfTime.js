// TurfTime Booking System - Fixed JavaScript Code
(function () {
  ("use strict");

  // Application state
  let currentUser = null;
  let users = [];
  let bookings = [];
  let selectedSlot = null;
  let selectedDate = null;
  let reviews = [];
  let selectedSlots = [];
  let currentRating = 0;

  // Available time slots
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
    "08:00 PM",
  ];

  // Initialize app
  document.addEventListener("DOMContentLoaded", function () {
    console.log("TurfTime app initialized");

    // Set minimum date to today
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];
    const dateInput = document.getElementById("bookingDate");
    if (dateInput) {
      dateInput.min = todayString;
      dateInput.value = todayString;
    }

    // Load sample data for demo
    loadSampleData();

    // Check if user is already logged in (from demo data)
    if (currentUser) {
      updateAuthState();
    }

    // Initialize event listeners
    initializeEventListeners();
  });

  // Initialize all event listeners
  function initializeEventListeners() {
    // Register form event listener
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", handleRegister);
    }

    // Login form event listener
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", handleLogin);
    }

    // Review form event listener
    const reviewForm = document.getElementById("reviewForm");
    if (reviewForm) {
      reviewForm.addEventListener("submit", submitReview);
    }

    // Modal event handlers
    window.addEventListener("click", handleModalClick);

    // Keyboard event handlers
    document.addEventListener("keydown", handleKeydown);

    // Form input event handlers
    document.addEventListener("input", handleFormInput);
  }

  // Authentication functions
  function showLoginModal() {
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  function showRegisterModal() {
    const modal = document.getElementById("registerModal");
    if (modal) {
      modal.style.display = "block";
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
      clearFormErrors();
    }
  }

  function switchToRegister() {
    closeModal("loginModal");
    showRegisterModal();
  }

  function switchToLogin() {
    closeModal("registerModal");
    showLoginModal();
  }

  // Form validation
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ""));
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + "Error");
    if (field && errorDiv) {
      field.classList.add("error");
      errorDiv.textContent = message;
    }
  }

  function clearFormErrors() {
    const errorInputs = document.querySelectorAll(".error");
    const errorMessages = document.querySelectorAll(".error-message");

    errorInputs.forEach((input) => input.classList.remove("error"));
    errorMessages.forEach((msg) => (msg.textContent = ""));
  }

  // Register functionality
  function handleRegister(e) {
    e.preventDefault();
    clearFormErrors();

    const name = document.getElementById("registerName")?.value?.trim() || "";
    const email = document.getElementById("registerEmail")?.value?.trim() || "";
    const phone = document.getElementById("registerPhone")?.value?.trim() || "";
    const password = document.getElementById("registerPassword")?.value || "";
    const confirmPassword =
      document.getElementById("confirmPassword")?.value || "";

    let isValid = true;

    // Validation
    if (name.length < 2) {
      showFieldError("registerName", "Name must be at least 2 characters");
      isValid = false;
    }

    if (!validateEmail(email)) {
      showFieldError("registerEmail", "Please enter a valid email address");
      isValid = false;
    }

    if (users.find((user) => user.email === email)) {
      showFieldError("registerEmail", "Email already registered");
      isValid = false;
    }

    if (!validatePhone(phone)) {
      showFieldError("registerPhone", "Please enter a valid phone number");
      isValid = false;
    }

    if (password.length < 6) {
      showFieldError(
        "registerPassword",
        "Password must be at least 6 characters"
      );
      isValid = false;
    }

    if (password !== confirmPassword) {
      showFieldError("confirmPassword", "Passwords do not match");
      isValid = false;
    }

    if (isValid) {
      try {
        // Create new user
        const newUser = {
          id: Date.now(),
          name: name,
          email: email,
          phone: phone,
          password: btoa(password), // Basic encoding (better than plain text)
        };

        users.push(newUser);
        currentUser = newUser;

        updateAuthState();
        closeModal("registerModal");
        showNotification(
          "Registration successful! Welcome to TurfTime!",
          "success"
        );

        // Clear form
        const registerForm = document.getElementById("registerForm");
        if (registerForm) {
          registerForm.reset();
        }
      } catch (error) {
        console.error("Registration error:", error);
        showNotification("Registration failed. Please try again.", "error");
      }
    }
  }

  // Login functionality
  function handleLogin(e) {
    e.preventDefault();
    clearFormErrors();

    const email = document.getElementById("loginEmail")?.value?.trim() || "";
    const password = document.getElementById("loginPassword")?.value || "";

    try {
      const user = users.find(
        (u) => u.email === email && u.password === btoa(password)
      );

      if (user) {
        currentUser = user;
        updateAuthState();
        closeModal("loginModal");
        showNotification(`Welcome back, ${user.name}!`, "success");

        // Clear form
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
          loginForm.reset();
        }
      } else {
        showFieldError("loginEmail", "Invalid email or password");
        showFieldError("loginPassword", "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      showNotification("Login failed. Please try again.", "error");
    }
  }

  // Update authentication state
  function updateAuthState() {
    const authButtons = document.getElementById("authButtons");
    const userInfo = document.getElementById("userInfo");
    const userName = document.getElementById("userName");

    if (currentUser && authButtons && userInfo && userName) {
      authButtons.style.display = "none";
      userInfo.style.display = "flex";
      userName.textContent = currentUser.name;

      // Update sidebar user info
      updateSidebarUserInfo();
    } else if (authButtons && userInfo) {
      authButtons.style.display = "flex";
      userInfo.style.display = "none";

      // Update sidebar user info
      updateSidebarUserInfo();
    }
  }

  // Logout functionality
  function logout() {
    currentUser = null;
    updateAuthState();
    showHome();
    showNotification("Logged out successfully", "info");
  }

  // Booking functionality
  function handleBookNow() {
    // if (!currentUser) {
    //   showNotification("Please login or register to book a slot", "error");
    //   showLoginModal();
    //   return;
    // }

    window.location.href = "book-now.html";

    // const modal = document.getElementById("bookingModal");
    // if (modal) {
    //   modal.style.display = "block";
    //   loadTimeSlots();
    // }
  }

  function loadTimeSlots() {
    const dateInput = document.getElementById("bookingDate");
    const selectedDateValue = dateInput?.value;

    if (!selectedDateValue) return;

    selectedDate = selectedDateValue;
    selectedSlots = []; // Reset selected slots
    const slotsContainer = document.getElementById("timeSlots");

    if (!slotsContainer) return;

    slotsContainer.innerHTML = "";

    timeSlots.forEach((slot) => {
      const button = document.createElement("button");
      button.className = "slot-button";
      button.textContent = slot;

      // Check if slot is already booked
      const isBooked = bookings.some(
        (booking) => booking.date === selectedDate && booking.time === slot
      );

      if (isBooked) {
        button.classList.add("booked");
        button.textContent += " (Booked)";
        button.disabled = true;
      } else {
        button.onclick = () => selectSlot(button, slot);
      }

      slotsContainer.appendChild(button);
    });

    // Enable confirm button only if slots are selected
    const confirmBtn = document.getElementById("confirmBooking");
    if (confirmBtn) {
      confirmBtn.disabled = true;
    }
  }

  function selectSlot(button, slot) {
    // Remove previous selection
    const prevSelected = document.querySelector(".slot-button.selected");
    if (prevSelected) {
      prevSelected.classList.remove("selected");
    }

    // Select new slot
    button.classList.add("selected");
    selectedSlot = slot;

    // Enable confirm button
    const confirmBtn = document.getElementById("confirmBooking");
    if (confirmBtn) {
      confirmBtn.disabled = false;
    }
  }

  function confirmBooking() {
    if (!currentUser || !selectedDate || !selectedSlot) {
      showNotification("Please select a date and time slot", "error");
      return;
    }

    try {
      // Check if slot is still available
      const isBooked = bookings.some(
        (booking) =>
          booking.date === selectedDate && booking.time === selectedSlot
      );

      if (isBooked) {
        showNotification("This slot has already been booked", "error");
        loadTimeSlots(); // Refresh slots
        return;
      }

      // Create booking
      const newBooking = {
        id: Date.now(),
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        date: selectedDate,
        time: selectedSlot,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      bookings.push(newBooking);

      closeModal("bookingModal");
      showNotification(
        `Booking confirmed for ${selectedDate} at ${selectedSlot}`,
        "success"
      );

      // Reset selection
      selectedSlot = null;
      selectedDate = null;

      // Update dashboard if visible
      const dashboardContent = document.getElementById("dashboardContent");
      if (dashboardContent && dashboardContent.style.display !== "none") {
        loadUserBookings();
      }
    } catch (error) {
      console.error("Booking error:", error);
      showNotification("Booking failed. Please try again.", "error");
    }
  }

  // Navigation functions
  function showHome() {
    const homeContent = document.getElementById("homeContent");
    const dashboardContent = document.getElementById("dashboardContent");

    if (homeContent && dashboardContent) {
      homeContent.style.display = "block";
      dashboardContent.style.display = "none";
    }
  }

  function showDashboard() {
    if (!currentUser) {
      showNotification("Please login to view your bookings", "error");
      showLoginModal();
      return;
    }

    const homeContent = document.getElementById("homeContent");
    const dashboardContent = document.getElementById("dashboardContent");

    if (homeContent && dashboardContent) {
      homeContent.style.display = "none";
      dashboardContent.style.display = "block";
      loadUserBookings();
    }
  }

  function showContact() {
    showNotification("Contact feature coming soon!", "info");
  }

  // Load user bookings - FIXED THE CRITICAL ERROR HERE
  function loadUserBookings() {
    if (!currentUser) return;

    const bookingsList = document.getElementById("bookingsList");
    if (!bookingsList) return;

    const userBookings = bookings.filter(
      (booking) => booking.userId === currentUser.id
    );

    if (userBookings.length === 0) {
      bookingsList.innerHTML =
        '<p style="color: #6b7280; text-align: center; margin: 40px 0;">No bookings found. Book your first slot!</p>';
      return;
    }

    // Sort bookings by date and time
    userBookings.sort((a, b) => {
      const dateA = new Date(a.date + " " + convertTo24Hour(a.time));
      const dateB = new Date(b.date + " " + convertTo24Hour(b.time));
      return dateA - dateB;
    });

    let bookingsHTML = "";
    userBookings.forEach((booking) => {
      const bookingDate = new Date(booking.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // FIXED: Set time to start of day
      const isPast = bookingDate < today; // FIXED: Proper comparison

      bookingsHTML += `
          <div class="booking-card">
              <div class="booking-info">
                  <h4>Turf Booking</h4>
                  <p><strong>Date:</strong> ${formatDate(booking.date)}</p>
                  <p><strong>Time:</strong> ${booking.time}</p>
                  <p><strong>Status:</strong> <span style="color: ${
                    isPast ? "#ef4444" : "#10b981"
                  }">${isPast ? "Completed" : "Upcoming"}</span></p>
              </div>
              <div style="display: flex; gap: 10px;">
                  ${
                    isPast && !reviews.some((r) => r.bookingId === booking.id)
                      ? `<button class="btn" style="background: #6366f1; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;" onclick="window.turfTime.showReviewModal()">Review</button>`
                      : ""
                  }
                  ${
                    !isPast
                      ? `<button class="btn-cancel" onclick="window.turfTime.cancelBooking(${booking.id})">Cancel</button>`
                      : ""
                  }
              </div>
          </div>
      `;
    });

    bookingsList.innerHTML = bookingsHTML;
  }

  // Cancel booking
  function cancelBooking(bookingId) {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        bookings = bookings.filter((booking) => booking.id !== bookingId);
        loadUserBookings();
        showNotification("Booking cancelled successfully", "success");
      } catch (error) {
        console.error("Cancel booking error:", error);
        showNotification(
          "Failed to cancel booking. Please try again.",
          "error"
        );
      }
    }
  }

  // Utility functions
  function convertTo24Hour(timeStr) {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  }

  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateStr;
    }
  }

  // Notification system
  function showNotification(message, type = "info") {
    try {
      // Remove existing notifications
      const existingNotifications = document.querySelectorAll(".notification");
      existingNotifications.forEach((notif) => notif.remove());

      const notification = document.createElement("div");
      notification.className = `notification ${type}`;
      notification.textContent = message;

      document.body.appendChild(notification);

      // Auto remove after 4 seconds
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 4000);
    } catch (error) {
      console.error("Notification error:", error);
    }
  }

  // Load sample data for demo
  function loadSampleData() {
    try {
      // Sample users with encoded passwords
      users = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          password: btoa("password123"),
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1234567891",
          password: btoa("password123"),
        },
      ];

      // Sample bookings
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayStr = today.toISOString().split("T")[0];
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      bookings = [
        {
          id: 1,
          userId: 1,
          userName: "John Doe",
          userEmail: "john@example.com",
          date: todayStr,
          time: "10:00 AM",
          status: "confirmed",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          userId: 1,
          userName: "John Doe",
          userEmail: "john@example.com",
          date: tomorrowStr,
          time: "02:00 PM",
          status: "confirmed",
          createdAt: new Date().toISOString(),
        },
        {
          id: 3,
          userId: 2,
          userName: "Jane Smith",
          userEmail: "jane@example.com",
          date: todayStr,
          time: "04:00 PM",
          status: "confirmed",
          createdAt: new Date().toISOString(),
        },
      ];

      // Sample reviews
      reviews = [
        {
          id: 1,
          bookingId: 1,
          userId: 1,
          userName: "John Doe",
          userEmail: "john@example.com",
          rating: 5,
          title: "Excellent facility!",
          text: "Great turf quality and well-maintained facilities. The booking process was smooth and the staff was helpful.",
          date: todayStr,
          time: "10:00 AM",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        },
      ];

      console.log("Sample data loaded");
    } catch (error) {
      console.error("Error loading sample data:", error);
    }
  }

  // Event handlers
  function handleModalClick(event) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
        clearFormErrors();
      }
    });
  }

  function handleKeydown(event) {
    if (event.key === "Escape") {
      const openModals = document.querySelectorAll('.modal[style*="block"]');
      openModals.forEach((modal) => {
        modal.style.display = "none";
        clearFormErrors();
      });
    }
  }

  function handleFormInput(event) {
    if (event.target.classList.contains("error")) {
      event.target.classList.remove("error");
      const errorDiv = document.getElementById(event.target.id + "Error");
      if (errorDiv) {
        errorDiv.textContent = "";
      }
    }
  }

  // Auto-login demo user (for testing)
  function demoLogin() {
    try {
      if (users.length > 0) {
        currentUser = users[0];
        updateAuthState();
        showNotification(`Demo login as ${currentUser.name}`, "info");
      }
    } catch (error) {
      console.error("Demo login error:", error);
    }
  }

  // Multiple slot booking functions
  function selectSlot(button, slot) {
    if (button.classList.contains("booked")) return;

    if (button.classList.contains("selected-multiple")) {
      // Remove from selection
      button.classList.remove("selected-multiple");
      selectedSlots = selectedSlots.filter((s) => s !== slot);
    } else {
      // Add to selection
      button.classList.add("selected-multiple");
      selectedSlots.push(slot);
    }

    updateSelectedSlotsDisplay();

    // Enable/disable confirm button
    const confirmBtn = document.getElementById("confirmBooking");
    if (confirmBtn) {
      confirmBtn.disabled = selectedSlots.length === 0;
    }
  }

  function updateSelectedSlotsDisplay() {
    let summaryContainer = document.querySelector(".selected-slots-summary");

    if (selectedSlots.length === 0) {
      if (summaryContainer) {
        summaryContainer.remove();
      }
      return;
    }

    if (!summaryContainer) {
      summaryContainer = document.createElement("div");
      summaryContainer.className = "selected-slots-summary";

      const timeSlotsContainer = document.getElementById("timeSlots");
      if (timeSlotsContainer) {
        timeSlotsContainer.parentNode.insertBefore(
          summaryContainer,
          timeSlotsContainer.nextSibling
        );
      }
    }

    let summaryHTML = `
      <div class="selected-slots-title">Selected Slots (${selectedSlots.length}):</div>
  `;

    selectedSlots.forEach((slot) => {
      summaryHTML += `
          <div class="selected-slot-item">
              <span>${slot}</span>
              <button class="remove-slot" onclick="removeSlot('${slot}')">Remove</button>
          </div>
      `;
    });

    summaryContainer.innerHTML = summaryHTML;
  }

  function removeSlot(slot) {
    selectedSlots = selectedSlots.filter((s) => s !== slot);

    // Update button appearance
    const slotButtons = document.querySelectorAll(".slot-button");
    slotButtons.forEach((button) => {
      if (button.textContent === slot) {
        button.classList.remove("selected-multiple");
      }
    });

    updateSelectedSlotsDisplay();

    // Enable/disable confirm button
    const confirmBtn = document.getElementById("confirmBooking");
    if (confirmBtn) {
      confirmBtn.disabled = selectedSlots.length === 0;
    }
  }

  // Updated confirm booking function
  function confirmBooking() {
    if (!currentUser || !selectedDate || selectedSlots.length === 0) {
      showNotification(
        "Please select a date and at least one time slot",
        "error"
      );
      return;
    }

    try {
      // Check if any selected slots are already booked
      const conflictingSlots = selectedSlots.filter((slot) => {
        return bookings.some(
          (booking) => booking.date === selectedDate && booking.time === slot
        );
      });

      if (conflictingSlots.length > 0) {
        showNotification(
          `These slots are already booked: ${conflictingSlots.join(", ")}`,
          "error"
        );
        loadTimeSlots(); // Refresh slots
        return;
      }

      // Create bookings for all selected slots
      const newBookings = selectedSlots.map((slot) => ({
        id: Date.now() + Math.random(), // Ensure unique IDs
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        date: selectedDate,
        time: slot,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      }));

      bookings.push(...newBookings);

      closeModal("bookingModal");
      showNotification(
        `${selectedSlots.length} slot${
          selectedSlots.length > 1 ? "s" : ""
        } booked for ${selectedDate}`,
        "success"
      );

      // Reset selections
      selectedSlots = [];
      selectedDate = null;

      // Remove summary display
      const summaryContainer = document.querySelector(
        ".selected-slots-summary"
      );
      if (summaryContainer) {
        summaryContainer.remove();
      }

      // Update dashboard if visible
      const dashboardContent = document.getElementById("dashboardContent");
      if (dashboardContent && dashboardContent.style.display !== "none") {
        loadUserBookings();
      }
    } catch (error) {
      console.error("Booking error:", error);
      showNotification("Booking failed. Please try again.", "error");
    }
  }

  // Review system functions
  function showReviews() {
    const modal = document.getElementById("reviewsDisplayModal");
    if (modal) {
      modal.style.display = "block";
      loadAllReviews();
    }
  }

  function showReviewModal() {
    if (!currentUser) {
      showNotification("Please login to leave a review", "error");
      showLoginModal();
      return;
    }

    const modal = document.getElementById("reviewModal");
    if (modal) {
      modal.style.display = "block";
      loadCompletedBookings();
      initializeRatingStars();
    }
  }

  function loadCompletedBookings() {
    const select = document.getElementById("reviewBookingSelect");
    if (!select || !currentUser) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return booking.userId === currentUser.id && bookingDate < today;
    });

    // Filter out bookings that already have reviews
    const unreviewed = completedBookings.filter((booking) => {
      return !reviews.some((review) => review.bookingId === booking.id);
    });

    select.innerHTML =
      '<option value="">Choose a completed booking...</option>';

    unreviewed.forEach((booking) => {
      const option = document.createElement("option");
      option.value = booking.id;
      option.textContent = `${formatDate(booking.date)} at ${booking.time}`;
      select.appendChild(option);
    });

    if (unreviewed.length === 0) {
      select.innerHTML =
        '<option value="">No completed bookings available for review</option>';
    }
  }

  function initializeRatingStars() {
    const stars = document.querySelectorAll("#ratingStars .star");
    const ratingText = document.getElementById("ratingText");

    stars.forEach((star, index) => {
      star.addEventListener("mouseenter", () => {
        highlightStars(index + 1);
        ratingText.textContent = getRatingText(index + 1);
      });

      star.addEventListener("mouseleave", () => {
        highlightStars(currentRating);
        ratingText.textContent =
          currentRating > 0 ? getRatingText(currentRating) : "Click to rate";
      });

      star.addEventListener("click", () => {
        currentRating = index + 1;
        highlightStars(currentRating);
        ratingText.textContent = getRatingText(currentRating);
      });
    });
  }

  function highlightStars(rating) {
    const stars = document.querySelectorAll("#ratingStars .star");
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("active");
      } else {
        star.classList.remove("active");
      }
    });
  }

  function getRatingText(rating) {
    const texts = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return texts[rating] || "";
  }

  function submitReview(e) {
    e.preventDefault();

    const bookingId = document.getElementById("reviewBookingSelect").value;
    const title = document.getElementById("reviewTitle").value.trim();
    const text = document.getElementById("reviewText").value.trim();

    if (!bookingId || !title || !text || currentRating === 0) {
      showNotification("Please fill all fields and select a rating", "error");
      return;
    }

    const booking = bookings.find((b) => b.id == bookingId);
    if (!booking) {
      showNotification("Invalid booking selected", "error");
      return;
    }

    const newReview = {
      id: Date.now(),
      bookingId: parseInt(bookingId),
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      rating: currentRating,
      title: title,
      text: text,
      date: booking.date,
      time: booking.time,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);

    closeModal("reviewModal");
    showNotification("Thank you for your review!", "success");

    // Reset form
    document.getElementById("reviewForm").reset();
    currentRating = 0;
    highlightStars(0);
    document.getElementById("ratingText").textContent = "Click to rate";
  }

  function loadAllReviews() {
    displayReviewsSummary();
    displayReviewsList();
  }

  function displayReviewsSummary() {
    const avgRatingEl = document.getElementById("avgRatingNumber");
    const avgStarsEl = document.getElementById("avgRatingStars");
    const totalReviewsEl = document.getElementById("totalReviews");
    const breakdownEl = document.getElementById("ratingBreakdown");

    if (reviews.length === 0) {
      avgRatingEl.textContent = "0.0";
      avgStarsEl.innerHTML = "☆☆☆☆☆";
      totalReviewsEl.textContent = "No reviews yet";
      breakdownEl.innerHTML =
        '<p style="color: #6b7280; text-align: center;">No reviews available</p>';
      return;
    }

    const avgRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    avgRatingEl.textContent = avgRating.toFixed(1);

    // Display stars
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      starsHTML += i <= Math.round(avgRating) ? "★" : "☆";
    }
    avgStarsEl.innerHTML = starsHTML;

    totalReviewsEl.textContent = `${reviews.length} review${
      reviews.length !== 1 ? "s" : ""
    }`;

    // Rating breakdown
    const ratingCounts = [0, 0, 0, 0, 0]; // for ratings 1-5
    reviews.forEach((review) => {
      ratingCounts[review.rating - 1]++;
    });

    let breakdownHTML = "";
    for (let i = 4; i >= 0; i--) {
      const percentage =
        reviews.length > 0 ? (ratingCounts[i] / reviews.length) * 100 : 0;
      breakdownHTML += `
          <div class="rating-row">
              <span class="rating-label">${i + 1}</span>
              <div class="rating-bar">
                  <div class="rating-fill" style="width: ${percentage}%"></div>
              </div>
              <span class="rating-count">${ratingCounts[i]}</span>
          </div>
      `;
    }
    breakdownEl.innerHTML = breakdownHTML;
  }

  function displayReviewsList() {
    const reviewsList = document.getElementById("reviewsList");

    if (reviews.length === 0) {
      reviewsList.innerHTML =
        '<p style="color: #6b7280; text-align: center; margin: 40px 0;">No reviews yet. Be the first to leave a review!</p>';
      return;
    }

    // Sort reviews by date (newest first)
    const sortedReviews = [...reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    let reviewsHTML = "";
    sortedReviews.forEach((review) => {
      const reviewDate = new Date(review.createdAt).toLocaleDateString();
      const starsHTML =
        "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
      const initials = review.userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      reviewsHTML += `
          <div class="review-card">
              <div class="review-header">
                  <div class="reviewer-info">
                      <div class="reviewer-avatar">${initials}</div>
                      <div class="reviewer-details">
                          <h4>${review.userName}</h4>
                          <p>Verified Customer</p>
                      </div>
                  </div>
                  <div class="review-rating">
                      <span class="review-stars">${starsHTML}</span>
                      <span class="review-date">${reviewDate}</span>
                  </div>
              </div>
              <div class="review-title">${review.title}</div>
              <div class="review-text">${review.text}</div>
              <div class="review-booking-info">
                  Booking: ${formatDate(review.date)} at ${review.time}
              </div>
          </div>
      `;
    });

    reviewsList.innerHTML = reviewsHTML;
  }

  // Expose functions to global scope for HTML onclick handlers
  window.turfTime = {
    showLoginModal,
    showRegisterModal,
    closeModal,
    switchToRegister,
    switchToLogin,
    logout,
    handleBookNow,
    loadTimeSlots,
    confirmBooking,
    showHome,
    showDashboard,
    showContact,
    cancelBooking,
    demoLogin,
    showReviews,
    showReviewModal,
    removeSlot,
  };

  console.log("TurfTime JavaScript loaded successfully");
  console.log(
    "Demo users available:",
    users.map((u) => ({ name: u.name, email: u.email }))
  );
  console.log("Type turfTime.demoLogin() in console for quick demo access");
})();
