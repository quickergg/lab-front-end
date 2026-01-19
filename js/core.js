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


// Toggle Student Fields in Modal
document.addEventListener('DOMContentLoaded', () => {
    // Select elements
    const addAccountBtn = document.querySelector('#tab-users .btn-primary'); // Targets the button in Manage Users
    const modal = document.getElementById('modal-add-account');
    const closeModal = document.querySelector('.close-modal');
    const cancelModal = document.getElementById('cancel-modal');
    const roleSelect = document.getElementById('role-select');
    const studentFields = document.getElementById('student-extra-fields');
    const subTabs = document.querySelectorAll('.sub-tab');
    const accountViews = document.querySelectorAll('.account-view');
    const accountFilter = document.getElementById('account-filter');
    const facultyView = document.getElementById('view-faculty');
    const studentView = document.getElementById('view-students');
    const schedModal = document.getElementById('modal-add-schedule');
    const openSchedBtn = document.querySelector('#tab-schedule .btn-primary'); // The "Add Schedule" button
    const closeSchedBtns = document.querySelectorAll('.close-modal-sched');
    const schedForm = document.getElementById('add-schedule-form');
    const scheduleTableBody = document.querySelector('#tab-schedule tbody');

    // for modal (add lab schedule)
if(openSchedBtn) {
        openSchedBtn.addEventListener('click', () => {
            schedModal.classList.remove('hidden');
            schedModal.classList.add('flex-display');
        });
    }

    // 2. Close Modal
    closeSchedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            schedModal.classList.add('hidden');
            schedModal.classList.remove('flex-display');
            schedForm.reset();
        });
    });

    // 3. Handle Form Submission
    schedForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Capture Form Values
        const lab = document.getElementById('sched-lab').value;
        const faculty = document.getElementById('sched-faculty').value;
        const section = document.getElementById('sched-section').value;
        const year = document.getElementById('sched-year').value;
        const day = document.getElementById('sched-day').value;
        const start = document.getElementById('sched-start').value;
        const end = document.getElementById('sched-end').value;

        // Create the new row HTML
        const newRow = `
            <tr>
                <td>${lab}</td>
                <td>${faculty}</td>
                <td>${section}</td>
                <td>${year}</td>
                <td>${day}</td>
                <td>${start}</td>
                <td>${end}</td>
                <td>
                    <button class="btn btnSmall">Edit</button>
                    <button class="btn btnSmall btnDanger">Delete</button>
                </td>
            </tr>
        `;

        // Append to table
        scheduleTableBody.insertAdjacentHTML('beforeend', newRow);

        // UI Feedback & Cleanup
        alert('Schedule added successfully!');
        schedModal.classList.add('hidden');
        schedModal.classList.remove('flex-display');
        schedForm.reset();
        
        // Refresh the Dashboard analytics numbers
        if(typeof updateDashboardCounts === "function") updateDashboardCounts();
    });

    // Account filtering logic
    if (accountFilter) {
        accountFilter.addEventListener('change', (e) => {
            const selected = e.target.value;

            if (selected === 'Student' ) {
                facultyView.classList.add('hidden');
                studentView.classList.remove('hidden');
            } else if (selected === 'Faculty') {
                studentView.classList.add('hidden');
                facultyView.classList.remove('hidden');
            } else if (selected === 'All') {
                // Show both tables or a unified view
                facultyView.classList.remove('hidden');
                studentView.classList.remove('hidden');
            }
            // Note: You can add logic for 'admin' here if you create an Admin table
        });
    }

    // 1. Open Modal
    addAccountBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex-display'); // We use flex to center the card
    });

    // 2. Close Modal (X button or Cancel)
    const hideModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex-display');
        document.getElementById('add-account-form').reset(); // Clear form on close
        studentFields.classList.add('hidden'); // Hide student fields for next time
    };

    closeModal.addEventListener('click', hideModal);
    cancelModal.addEventListener('click', hideModal);

    // 3. Toggle Student Fields based on Role
    roleSelect.addEventListener('change', (e) => {
        if (e.target.value === 'student') {
            studentFields.classList.remove('hidden');
            document.getElementById('course-year-select').setAttribute('required', 'true');
        } else {
            studentFields.classList.add('hidden');
            document.getElementById('course-year-select').removeAttribute('required');
        }
    });

    // Close on clicking outside the card
    window.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 1. Remove active class from all tabs
            subTabs.forEach(t => t.classList.remove('active'));
            // 2. Add active class to clicked tab
            tab.classList.add('active');

            // 3. Hide all views
            accountViews.forEach(view => view.classList.add('hidden'));
            // 4. Show the target view
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Update your Analytics count to look into both tables now
    updateDashboardCounts();

});

function updateDashboardCounts() {
    // 1. Count Total Users (Faculty + Students)
    const facultyCount = document.querySelectorAll('#view-faculty tbody tr').length;
    const studentCount = document.querySelectorAll('#view-students tbody tr').length;
    const totalUsers = facultyCount + studentCount;

    // 2. Count Active Schedules
    const scheduleCount = document.querySelectorAll('#tab-schedule tbody tr').length;

    // 3. Count Pending Requests (Room + Equipment)
    const roomReqCount = document.querySelectorAll('#tab-requests .innerCard:first-child tbody tr').length;
    const equipReqCount = document.querySelectorAll('#tab-requests .innerCard:last-child tbody tr').length;
    const totalRequests = roomReqCount + equipReqCount;

    // 4. Update the Dashboard Display
    // We target the stats-number by their index or specific ID
    const statsNumbers = document.querySelectorAll('.stats-number');    
    if (statsNumbers.length >= 3) {
        statsNumbers[0].innerText = totalUsers;
        statsNumbers[1].innerText = scheduleCount;
        statsNumbers[2].innerText = totalRequests;
    }
}

// Call this function when the page loads
// document.addEventListener('DOMContentLoaded', updateDashboardCounts);

// const labFilter = document.getElementById('lab-filter');
// const scheduleTableRows = document.querySelectorAll('#tab-schedule tbody tr');

// if (labFilter) {
//     labFilter.addEventListener('change', (e) => {
//         const selectedLab = e.target.value; // Will be "1", "2", "3", or "all"

//         scheduleTableRows.forEach(row => {
//             // Get the text from the first column and remove any extra spaces
//             const cellValue = row.cells[0].innerText.trim(); 
            
//             if (selectedLab === 'all' || cellValue === selectedLab) {
//                 row.style.display = ''; 
//             } else {
//                 row.style.display = 'none'; 
//             }
//         });
//     });
// }

let currentRow = null; // Stores the row being edited

document.addEventListener('DOMContentLoaded', () => {
    const schedModal = document.getElementById('modal-add-schedule');
    const schedForm = document.getElementById('add-schedule-form');
    const modalTitle = document.getElementById('modal-title');
    const saveBtn = document.getElementById('save-btn');
    const scheduleTableBody = document.querySelector('#tab-schedule tbody');

    // --- 1. DELETE & EDIT TRIGGER (Event Delegation) ---
    scheduleTableBody.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        
        // Handle Delete
        if (e.target.classList.contains('btnDanger')) {
            if (confirm("Are you sure you want to delete this schedule?")) {
                row.remove();
                updateDashboardCounts();
            }
        }

        // Handle Edit
        if (e.target.innerText === 'Edit') {
            currentRow = row;
            schedForm.setAttribute('data-mode', 'edit');
            modalTitle.innerText = "Edit Lab Schedule";
            saveBtn.innerText = "Update Schedule";

            // Fill form with current row data
            document.getElementById('sched-lab').value = row.cells[0].innerText;
            document.getElementById('sched-faculty').value = row.cells[1].innerText;
            document.getElementById('sched-section').value = row.cells[2].innerText;
            document.getElementById('sched-year').value = row.cells[3].innerText;
            document.getElementById('sched-day').value = row.cells[4].innerText;
            document.getElementById('sched-start').value = row.cells[5].innerText;
            document.getElementById('sched-end').value = row.cells[6].innerText;

            schedModal.classList.remove('hidden');
            schedModal.classList.add('flex-display');
        }
    });

    // --- 2. SAVE/UPDATE LOGIC ---
    schedForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = {
            lab: document.getElementById('sched-lab').value,
            faculty: document.getElementById('sched-faculty').value,
            section: document.getElementById('sched-section').value,
            year: document.getElementById('sched-year').value,
            day: document.getElementById('sched-day').value,
            start: document.getElementById('sched-start').value,
            end: document.getElementById('sched-end').value
        };

        if (schedForm.getAttribute('data-mode') === 'edit' && currentRow) {
            // UPDATE EXISTING ROW
            currentRow.cells[0].innerText = data.lab;
            currentRow.cells[1].innerText = data.faculty;
            currentRow.cells[2].innerText = data.section;
            currentRow.cells[3].innerText = data.year;
            currentRow.cells[4].innerText = data.day;
            currentRow.cells[5].innerText = data.start;
            currentRow.cells[6].innerText = data.end;
            alert('Schedule updated!');
        } else {
            // ADD NEW ROW
            const newRowHtml = `
                <tr>
                    <td>${data.lab}</td><td>${data.faculty}</td><td>${data.section}</td>
                    <td>${data.year}</td><td>${data.day}</td><td>${data.start}</td>
                    <td>${data.end}</td>
                    <td>
                        <button class="btn btnSmall">Edit</button>
                        <button class="btn btnSmall btnDanger">Delete</button>
                    </td>
                </tr>`;
            scheduleTableBody.insertAdjacentHTML('beforeend', newRowHtml);
        }

        // Reset and Close
        closeModal();
        updateDashboardCounts();
    });

    function closeModal() {
        schedModal.classList.add('hidden');
        schedModal.classList.remove('flex-display');
        schedForm.reset();
        schedForm.setAttribute('data-mode', 'add');
        modalTitle.innerText = "Add New Lab Schedule";
        saveBtn.innerText = "Save Schedule";
        currentRow = null;
    }
    
    // Attach closeModal to cancel buttons
    document.querySelectorAll('.close-modal-sched').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
});