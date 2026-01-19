

/* =========================================
   CORE UTILITIES & GLOBAL BEHAVIOR
========================================= */

const $ = (id) => document.getElementById(id);

/* -----------------------------------------
   Header hide/show on scroll
----------------------------------------- */
(() => {
  const header = document.querySelector("header");
  if (!header) return;

  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const current = window.pageYOffset || document.documentElement.scrollTop;

    if (current > lastScrollTop && current > 100) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }

    lastScrollTop = current <= 0 ? 0 : current;
  });
})();

/* -----------------------------------------
   Active nav link on scroll
----------------------------------------- */
(() => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!sections.length || !navLinks.length) return;

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;

      if (pageYOffset >= top && pageYOffset < top + height) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  });
})();

/* -----------------------------------------
   Session helpers
----------------------------------------- */
function setWho() {
  const who = $("who");
  const email = sessionStorage.getItem("email");
  if (who && email) who.textContent = `(${email})`;
}

function logoutSetup() {
  const btn = $("logout-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
}

function guardRole(role) {
  if (sessionStorage.getItem("role") !== role) {
    window.location.href = "index.html";
  }
}

/* -----------------------------------------
   Form helpers
----------------------------------------- */
function setupOthersToggle(chkId, txtId) {
  const chk = $(chkId);
  const txt = $(txtId);
  if (!chk || !txt) return;

  const update = () => {
    txt.disabled = !chk.checked;
    if (!chk.checked) txt.value = "";
  };

  chk.addEventListener("change", update);
  update();
}

function setupPurposeOthers(radioId, txtId) {
  const radio = $(radioId);
  const txt = $(txtId);
  if (!radio || !txt) return;

  const update = () => {
    txt.disabled = !radio.checked;
    if (!radio.checked) txt.value = "";
  };

  document
    .querySelectorAll('input[name="purpose"]')
    .forEach((r) => r.addEventListener("change", update));

  update();
}

function setupNewCancel(formId, onResetExtra) {
  const form = $(formId);
  if (!form) return;

  const reset = () => {
    form.reset();
    onResetExtra?.();
  };

  $("newRequestBtn")?.addEventListener("click", () => {
    if (confirm("Start a new request?")) reset();
  });

  $("cancelBtn")?.addEventListener("click", () => {
    if (confirm("Cancel this request?")) reset();
  });
}

/* =========================================
   LOGIN PAGE
========================================= */
(() => {
  const form = $("loginForm");
  if (!form) return;

  const accounts = [
    { role: "Student", email: "student@smartlab.com", password: "student123", page: "student.html" },
    { role: "Faculty", email: "faculty@smartlab.com", password: "faculty123", page: "faculty.html" },
    { role: "Admin",   email: "admin@smartlab.com",   password: "admin123",   page: "admin.html" }
  ];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = $("email").value.trim().toLowerCase();
    const password = $("password").value;
    const err = $("errorMsg");

    const user = accounts.find(
      (a) => a.email === email && a.password === password
    );

    if (!user) {
      err && (err.style.display = "block");
      return;
    }

    err && (err.style.display = "none");
    sessionStorage.setItem("role", user.role);
    sessionStorage.setItem("email", user.email);
    window.location.href = user.page;
  });
})();
/* -----------------------------------------
   Sidebar Tab Navigation
----------------------------------------- */
function setupTabs() {
  const navItems = document.querySelectorAll(".navItem");
  const tabPanels = document.querySelectorAll(".tabPanel");

  if (!navItems.length) return;

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");

      // Update active button
      navItems.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");

      // Show/Hide panels
      tabPanels.forEach((panel) => {
        if (panel.id === `tab-${target}`) {
          panel.classList.remove("hidden");
        } else {
          panel.classList.add("hidden");
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevents click from bubbling up
            sidebar.classList.toggle('active');
        });

        // Optional: Close sidebar if user clicks outside of it
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });
    }
});

/**
 * SmartLab Core - Shared Functions
 */

const SmartLab = {
    // 1. SHARED TAB SWITCHING
    // Automatically handles any button with .navItem and any panel with .tabPanel
    initTabs: function() {
        const navItems = document.querySelectorAll('.navItem');
        const tabPanels = document.querySelectorAll('.tabPanel');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.getAttribute('data-tab');
                
                // Update Buttons
                navItems.forEach(btn => btn.classList.remove('active'));
                item.classList.add('active');

                // Update Panels
                tabPanels.forEach(panel => panel.classList.add('hidden'));
                const targetPanel = document.getElementById(`tab-${target}`);
                if (targetPanel) targetPanel.classList.remove('hidden');
            });
        });
    },

    // 2. UNIVERSAL TABLE FILTER
    // @param selectId: The ID of the dropdown
    // @param tableId: The ID of the table or tbody to filter
    // @param colIndex: Which column index to check (0, 1, 2...)
    initTableFilter: function(selectId, tableId, colIndex) {
        const filterSelect = document.getElementById(selectId);
        const table = document.getElementById(tableId);
        
        if (!filterSelect || !table) return;

        filterSelect.addEventListener('change', (e) => {
            const filterValue = e.target.value.toLowerCase();
            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                const cellText = row.cells[colIndex].innerText.toLowerCase();
                
                // If "all" is selected or the text matches the filter
                if (filterValue === 'all' || cellText.includes(filterValue)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    },

    // 3. MODAL HANDLER
    toggleModal: function(modalId, show = true) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        if (show) {
            modal.classList.remove('hidden');
            modal.classList.add('flex-display');
        } else {
            modal.classList.add('hidden');
            modal.classList.remove('flex-display');
        }
    }
};

// Auto-initialize tabs on every page that has core.js
document.addEventListener('DOMContentLoaded', () => {
    SmartLab.initTabs();
});

// laboratory filter for faculty schedule
const labFilter = document.getElementById('lab-filter');
const scheduleTableRows = document.querySelectorAll('#tab-schedule tbody tr');

if (labFilter) {
    labFilter.addEventListener('change', (e) => {
        const selectedLab = e.target.value; // Will be "1", "2", "3", or "all"

        scheduleTableRows.forEach(row => {
            // Get the text from the first column and remove any extra spaces
            const cellValue = row.cells[0].innerText.trim(); 
            
            if (selectedLab === 'all' || cellValue === selectedLab) {
                row.style.display = ''; 
            } else {
                row.style.display = 'none'; 
            }
        });
    });
}