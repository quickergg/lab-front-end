(() => {
  // 1. Global Initialization (Runs on every page load)
  guardRole("Admin");    // Ensures only Admins can stay on this page [cite: 9]
  setWho();              // Displays the user's email [cite: 5, 6]
  logoutSetup();         // Sets up the log out button [cite: 7]
  setupTabs();           // THIS FIXES THE NAVIGATION: Initializes sidebar switching 

  // 2. Admin-Specific Logic
  console.log("Admin panel initialized.");

  // Example: Add Account Button logic
  const addAccountBtn = document.querySelector(".cardHeader .btn-primary");
  if (addAccountBtn) {
    addAccountBtn.addEventListener("click", () => {
      alert("Add Account modal/form would open here.");
    });
  }

  // If you later add a specific form to admin.html, put its logic here:
  const adminForm = $("someAdminFormId");
  if (adminForm) {
    adminForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // form handling...
    });
  }
})();