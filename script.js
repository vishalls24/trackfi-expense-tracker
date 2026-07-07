// theme
const themeBtn = document.getElementById("theme-btn");
const themeIcon = themeBtn?.querySelector("i");
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeSidebar = document.getElementById("darkModeSidebar");

function applyTheme(isDark) {
  document.body.classList.toggle("dark-theme", isDark);

  if (themeIcon) {
    themeIcon.classList.toggle("fa-sun", isDark);
    themeIcon.classList.toggle("fa-moon", !isDark);
  }

  if (darkModeToggle) {
    darkModeToggle.checked = isDark;
  }

  if (darkModeSidebar) {
    darkModeSidebar.checked = isDark;
  }

  localStorage.setItem("theme", isDark ? "dark" : "light");
}

const savedTheme = localStorage.getItem("theme");

applyTheme(savedTheme === "dark");

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-theme");

    applyTheme(isDark);
  });
}

if (darkModeToggle) {
  darkModeToggle.addEventListener("change", () => {
    applyTheme(darkModeToggle.checked);
  });
}

if (darkModeSidebar) {
  darkModeSidebar.addEventListener("change", () => {
    applyTheme(darkModeSidebar.checked);
  });
}

// page switching
const dashboard = document.querySelector("#dashboard");
const settings = document.querySelector("#settings");

const dashLink = document.querySelector(".dashLink");
const settLink = document.querySelector(".settLink");

dashboard.classList.remove("hidden");
settings.classList.add("hidden");

settLink?.addEventListener("click", (e) => {
  e.preventDefault();

  dashboard.classList.add("hidden");
  settings.classList.remove("hidden");

  settLink.classList.add("active");
  dashLink.classList.remove("active");
});

dashLink?.addEventListener("click", (e) => {
  e.preventDefault();

  settings.classList.add("hidden");
  dashboard.classList.remove("hidden");

  dashLink.classList.add("active");
  settLink.classList.remove("active");
});

// modal
const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("closeBtn");
const form = document.querySelector(".modal-form");

function openModal() {
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");

  if (form) {
    form.reset();
  }
}

if (addBtn) {
  addBtn.addEventListener("click", openModal);
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// mobile minu
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.querySelector(".sidebar");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("active");
  });
});
