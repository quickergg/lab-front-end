(() => {
  // 1. Global Initialization (Runs on every page load)
  guardRole("Admin");    
  setWho();             
  logoutSetup();         
  setupTabs();           

  // 2. Admin-Specific Logic
  console.log("Admin panel initialized.");

  // Example: Add Account Button logic
  const addAccountBtn = document.querySelector(".cardHeader .btn-primary");
  if (addAccountBtn) {
    addAccountBtn.addEventListener("click", () => {
      alert("Add Account modal/form would open here.");
    });
  }

  const adminForm = $("someAdminFormId");
  if (adminForm) {
    adminForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
    });
  }

})();
