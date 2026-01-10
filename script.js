// ------------------------------- all for navigation header behavior -------------------------------

// behavior ito ng navigation header on scroll
let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const currentScroll =
    window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop && currentScroll > 100) {
    // Scrolling DOWN
    header.classList.add("hide");
  } else {
    // Scrolling UP
    header.classList.remove("hide");
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

// nav-links active state on click
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;

    if (
      window.pageYOffset >= sectionTop &&
      window.pageYOffset < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
});

