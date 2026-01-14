(() => {
  // 1. GLOBAL INITIALIZATION
  guardRole("Student");    // Check security
  setWho();                // Display student email
  logoutSetup();           // Initialize logout button
  setupTabs();             // THIS FIXES NAVIGATION: Enables tab switching

  // 2. FORM LOGIC
  const form = $("borrowForm");
  
  if (form) {
    // Setup the "Others" checkbox for equipment
    setupOthersToggle("partOthersChk", "partOthersTxt");

    // Handle "New Request" and "Cancel" buttons
    setupNewCancel("borrowForm", () => {
      const othersTxt = $("partOthersTxt");
      if (othersTxt) othersTxt.disabled = true;
    });

    // Form Submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Simple logic to show it works
      const studentName = form.querySelector('input[type="text"]').value;
      console.log("Borrow request from:", studentName);
      
      alert("Student borrow request submitted (mock).");
      form.reset();
      if ($("partOthersTxt")) $("partOthersTxt").disabled = true;
    });
  }

  console.log("Student panel initialized.");
})();