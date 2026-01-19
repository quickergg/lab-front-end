(() => {
  // 1. GLOBAL INITIALIZATION
  guardRole("Student");    // Check security
  setWho();                // Display student email
  logoutSetup();           // Initialize logout button
  setupTabs();             // THIS FIXES NAVIGATION: Enables tab switching

  const studentForm = document.getElementById('studentRequestForm');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching Logic
    const navItems = document.querySelectorAll('.navItem');
    const tabPanels = document.querySelectorAll('.tabPanel');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.add('hidden'));

            item.classList.add('active');
            const target = item.getAttribute('data-tab');
            document.getElementById(`tab-${target}`).classList.remove('hidden');
        });
    });

    // 2. Form Submission with Auto-Date
    const studentForm = document.getElementById('studentRequestForm');
    
    if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Automatic date recording
            const today = new Date().toISOString().split('T')[0];
            
            const formData = new FormData(studentForm);
            const data = Object.fromEntries(formData.entries());

            // Get all checked particulars
            const items = Array.from(formData.getAll('particulars')).join(', ');

            // Constructing the data for the table
            const newRequest = {
                dateFiled: today,
                items: items,
                dateOfUse: data.dateOfUse,
                schedule: `${data.timeStart} - ${data.timeEnd}`,
                status: 'Pending'
            };

            console.log("Saving student request:", newRequest);
            
            // Add to table (Visual only for now)
            addRequestToTable(newRequest);
            
            alert('Request submitted! You can track the status in the "My Requests" tab.');
            studentForm.reset();
        });
    }

    function addRequestToTable(req) {
        const tbody = document.getElementById('studentRequestsBody');
        const row = `
            <tr>
                <td>${req.dateFiled}</td>
                <td>${req.items}</td>
                <td>${req.dateOfUse}</td>
                <td>${req.schedule}</td>
                <td><span class="pill status-pending">${req.status}</span></td>
            </tr>
        `;
        tbody.insertAdjacentHTML('afterbegin', row);
    }
});
})();