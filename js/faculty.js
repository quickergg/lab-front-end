/* ===============================
   SmartLab – Faculty Panel Script
   =============================== */

(() => {
  // 1. Core initialization
  guardRole("Faculty");
  setWho();
  logoutSetup();
  setupTabs(); // Enables the sidebar navigation

  // 2. Mock Data
  const schedulesByLab = {
    "Lab 1": [{ date: "2025-12-20", time: "09:00 - 11:00", faculty: "Prof. Reyes", purpose: "Lecture" }],
    "Lab 2": [{ date: "2025-12-21", time: "13:00 - 15:00", faculty: "Prof. Dizon", purpose: "Exam" }],
    "Lab 3": [{ date: "2025-12-22", time: "08:00 - 10:00", faculty: "Prof. Cruz", purpose: "Seminar" }]
  };

  // 3. Form Selectors
  const form = $("facultyRequestForm");
  const labChk = $("labChk");
  const labSelect = $("labSelect");
  const viewBtn = $("viewScheduleBtn");

  // Logic for Lab Selection Toggle
  const updateLabUI = () => {
    const wrap = $("labSelectWrap");
    if (!labChk || !wrap) return;

    wrap.style.display = labChk.checked ? "block" : "none";
    viewBtn.disabled = !labChk.checked || !labSelect.value;
  };

  if (form) {
    // Shared "Others" toggles from core.js
    setupOthersToggle("partOthersChk", "partOthersTxt");
    setupPurposeOthers("purposeOthersRad", "purposeOthersTxt");

    // Event Listeners for Lab selection
    labChk?.addEventListener("change", updateLabUI);
    labSelect?.addEventListener("change", updateLabUI);

    // New/Cancel Logic
    setupNewCancel("facultyRequestForm", () => {
      $("partOthersTxt").disabled = true;
      $("purposeOthersTxt").disabled = true;
      updateLabUI();
    });

    // Form Submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Faculty Request submitted successfully!");
      form.reset();
      updateLabUI();
    });
  }

  // 4. Schedule Rendering Logic
  viewBtn?.addEventListener("click", () => {
    const lab = labSelect.value;
    const body = $("scheduleBody");
    const title = $("scheduleTitle");

    // 1. Switch to the Schedules tab
    const scheduleTabBtn = document.querySelector('[data-tab="schedules"]');
    if (scheduleTabBtn) scheduleTabBtn.click();

    // 2. Render data
    if (title) title.textContent = `${lab} Schedule`;
    if (body) {
      const rows = schedulesByLab[lab] || [];
      body.innerHTML = rows.length
        ? rows.map(r => `<tr><td>${r.date}</td><td>${r.time}</td><td>${r.faculty}</td><td>${r.purpose}</td></tr>`).join("")
        : `<tr><td colspan="4">No schedule found for this lab.</td></tr>`;
    }
  });

  console.log("Faculty Panel Script Loaded.");
})();

facultyRequestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Auto-generate the timestamp
    const now = new Date();
    const dateFiled = now.toLocaleDateString();
    const timeFiled = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formData = new FormData(facultyRequestForm);
    const requestData = Object.fromEntries(formData.entries());
    
    // Combine with the auto-generated data
    const finalSubmission = {
        ...requestData,
        dateFiled,
        timeFiled,
        status: 'Pending'
    };

    console.log("Submitting Request:", finalSubmission);
    alert('Request submitted successfully!');
});

const requestForm = document.getElementById('facultyRequestForm');

if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Get current date and time
        const now = new Date();
        const dateNow = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeNow = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // 2. Collect Form Data
        const formData = new FormData(requestForm);
        const data = Object.fromEntries(formData.entries());

        // 3. Combine them
        const finalData = {
            ...data,
            dateFiled: dateNow,
            timeFiled: timeNow,
            status: 'Pending'
        };

        console.log("Saving Request:", finalData);
        alert(`Request submitted successfully on ${dateNow} at ${timeNow}!`);
        
        // Optional: Reset form
        requestForm.reset();
        document.getElementById('labSelectWrap').style.display = 'none';
    });
}



