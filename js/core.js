

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

