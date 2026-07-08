const STORAGE = {
  USER: "trackfi_user",
  LOGIN: "trackfi_login",
  THEME: "trackfi_theme",
  CURRENCY: "trackfi_currency",
  TRANSACTIONS: "trackfi_transactions",
};

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getData(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Login / Signup
const loginPage = document.getElementById("loginPage");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

showSignup?.addEventListener("click", () => {
  loginForm?.classList.add("hidden");
  signupForm?.classList.remove("hidden");
});

showLogin?.addEventListener("click", () => {
  signupForm?.classList.add("hidden");
  loginForm?.classList.remove("hidden");
});

signupForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById("signupFullName").value.trim(),
    email: document.getElementById("signupEmail").value.trim(),
    password: document.getElementById("signupPassword").value,
  };

  if (user.password.length < 6) {
  alert("Password must be at least 6 characters.");
  return;
}

  const confirmPassword = document.getElementById("signupConfirm").value;

  if (user.password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  saveData(STORAGE.USER, user);

  alert("Account Created Successfully");

  signupForm.reset();

  signupForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
});

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const savedUser = getData(STORAGE.USER);

  if (!savedUser) {
    alert("Please create account first.");
    return;
  }

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (email === savedUser.email && password === savedUser.password) {
    localStorage.setItem(STORAGE.LOGIN, "true");

    if (loginPage) {
      loginPage.style.display = "none";
    }

    loadUser();
    refreshDashboard?.();
  } else {
    alert("Invalid Email or Password");
  }
});

function loadUser(showMessage = false) {
  const user = getData(STORAGE.USER);

  if (!user) return;

  const nameInput = document.getElementById("fullName");

  if (nameInput) {
    nameInput.value = user.name;
  }

  document.querySelectorAll(".user-name").forEach((element) => {
    element.textContent = user.name;
  });

  const avatar = document.getElementById("avatarLetter");

  if (avatar) {
    avatar.textContent = user.name.charAt(0).toUpperCase();
  }

  const currency = localStorage.getItem(STORAGE.CURRENCY);
  const currencySelect = document.getElementById("currencySelect");

  if (currency && currencySelect) {
    currencySelect.value = currency;
  }

  if (showMessage) {
    alert("Profile Updated");
  }
}

if (localStorage.getItem(STORAGE.LOGIN) && loginPage) {
  loginPage.style.display = "none";

  loadUser();
}

const logoutBtn = document.getElementById("logout");

logoutBtn?.addEventListener("click", () => {
  if (confirm("Logout?")) {
    localStorage.removeItem(STORAGE.LOGIN);

    location.reload();
  }
});

// Theme
const themeBtn = document.getElementById("theme-btn");
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeSidebar = document.getElementById("darkModeSidebar");
const themeIcon = themeBtn?.querySelector("i");

function applyTheme(darkMode) {
  document.body.classList.toggle("dark-theme", darkMode);

  if (themeIcon) {
    themeIcon.className = darkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  if (darkModeToggle) {
    darkModeToggle.checked = darkMode;
  }

  if (darkModeSidebar) {
    darkModeSidebar.checked = darkMode;
  }

  localStorage.setItem(STORAGE.THEME, darkMode ? "dark" : "light");
}

applyTheme(localStorage.getItem(STORAGE.THEME) === "dark");

themeBtn?.addEventListener("click", () => {
  const dark = document.body.classList.contains("dark-theme");

  applyTheme(!dark);
});

darkModeToggle?.addEventListener("change", () => {
  applyTheme(darkModeToggle.checked);
});

darkModeSidebar?.addEventListener("change", () => {
  applyTheme(darkModeSidebar.checked);
});

// Sidebar
const sidebar = document.querySelector(".sidebar");
const menuBtn = document.getElementById("menu-btn");

menuBtn?.addEventListener("click", () => {
  sidebar?.classList.toggle("active");
});

const dashboard = document.getElementById("dashboard");
const settings = document.getElementById("settings");
const dashLink = document.querySelector(".dashLink");
const settLink = document.querySelector(".settLink");

function openDashboard() {
  dashboard?.classList.remove("hidden");
  settings?.classList.add("hidden");
  dashLink?.classList.add("active");
  settLink?.classList.remove("active");
}

function openSettings() {
  dashboard?.classList.add("hidden");
  settings?.classList.remove("hidden");
  settLink?.classList.add("active");
  dashLink?.classList.remove("active");
}

dashLink?.addEventListener("click", (e) => {
  e.preventDefault();
  openDashboard();
  sidebar?.classList.remove("active");
});

settLink?.addEventListener("click", (e) => {
  e.preventDefault();
  openSettings();
  sidebar?.classList.remove("active");
});

// Transactions
let transactions = getData(STORAGE.TRANSACTIONS) || [];
let editId = null;

const modal = document.getElementById("modal");
const addBtn = document.getElementById("addBtn");
const closeBtn = document.getElementById("closeBtn");
const transactionForm = document.getElementById("transactionForm");
const type = document.getElementById("type");
const description = document.getElementById("description");
const amount = document.getElementById("txAmount");
const date = document.getElementById("txDate");
const category = document.getElementById("category");
const tableBody = document.getElementById("transactionTableBody");

function openModal() {
  modal?.classList.remove("hidden");
  if (date) {
    date.value = new Date().toISOString().split("T")[0];
  }
}

function closeModal() {
  modal?.classList.add("hidden");
  transactionForm?.reset();
  editId = null;
}

addBtn?.addEventListener("click", openModal);
closeBtn?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

function saveTransactions() {
  saveData(STORAGE.TRANSACTIONS, transactions);
}

transactionForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const transaction = {
    id: editId || Date.now(),
    type: type.value,
    description: description.value.trim(),
    amount: Number(amount.value),
    date: date.value,
    category: category.value,
  };

  if (
    !transaction.description ||
    transaction.amount <= 0 ||
    !transaction.date ||
    !transaction.category
  ) {
    alert("Please fill all fields.");
    return;
  }

  if (editId) {
    const index = transactions.findIndex((item) => item.id === editId);

    if (index !== -1) {
      transactions[index] = transaction;
    }
  } else {
    transactions.push(transaction);
  }

  saveTransactions();
  closeModal();
  refreshDashboard();
});

function editTransaction(id) {
  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) return;

  editId = id;
  type.value = transaction.type;
  description.value = transaction.description;
  amount.value = transaction.amount;
  date.value = transaction.date;
  category.value = transaction.category;

  openModal();
}

function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) {
    return;
  }

  transactions = transactions.filter((item) => item.id !== id);
  saveTransactions();
  refreshDashboard();
}

function getCurrencySymbol() {
  const currency = localStorage.getItem(STORAGE.CURRENCY) || "INR";

  const symbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
  };

  return symbols[currency];
}

function renderTable(list = transactions) {
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (list.length === 0) {
    tableBody.innerHTML = `
 <tr>
   <td colspan="6">
    No Transactions Found
   </td>
 </tr>
 `;

    return;
  }

  const symbol = getCurrencySymbol();

  list.forEach((tx) => {
    tableBody.innerHTML += `
 <tr>
  <td>${tx.date}</td>
  <td>${tx.description}</td>
  <td>${tx.category}</td>

  <td>
   <span class="${tx.type}">${tx.type}</span>
  </td>

  <td>${symbol}${tx.amount.toFixed(2)}</td>

  <td>
    <button class="btn-primary" onclick="editTransaction(${tx.id})">Edit</button>
    <button class="btn-danger" onclick="deleteTransaction(${tx.id})">Delete</button>
  </td>
 </tr>
 `;
  });
}

window.editTransaction = editTransaction;
window.deleteTransaction = deleteTransaction;

// Dashboard
let chart = null;
const displayBalance = document.getElementById("displayBalance");
const displayIncome = document.getElementById("displayIncome");
const displayExpense = document.getElementById("displayExpense");
const displayCount = document.getElementById("displayCount");
const chartCanvas = document.getElementById("myChart");

function getFinancialSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
}

function updateCards() {
  const summary = getFinancialSummary();
  const symbol = getCurrencySymbol();

  if (displayBalance) {
    displayBalance.textContent = `${symbol}${summary.balance.toFixed(2)}`;
  }

  if (displayIncome) {
    displayIncome.textContent = `${symbol}${summary.income.toFixed(2)}`;
  }

  if (displayExpense) {
    displayExpense.textContent = `${symbol}${summary.expense.toFixed(2)}`;
  }

  if (displayCount) {
    displayCount.textContent = transactions.length;
  }
}

function updateChart() {
  if (!chartCanvas) return;

  const summary = getFinancialSummary();

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [
        {
          label: "Amount",
          data: [summary.income, summary.expense],
          backgroundColor: ["#22c55e", "#ef4444"],
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },

      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function refreshDashboard() {
  renderTable();

  updateCards();

  updateChart();
}

// Search and Filter
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortTransactions = document.getElementById("sortTransactions");

let currentFilter = "all";

searchInput?.addEventListener("input", applyFilters);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    applyFilters();
  });
});

sortTransactions?.addEventListener("change", applyFilters);

function applyFilters() {
  let filtered = [...transactions];

  const keyword = searchInput?.value.trim().toLowerCase();

  if (keyword) {
    filtered = filtered.filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(keyword) ||
        transaction.category.toLowerCase().includes(keyword),
    );
  }

  if (currentFilter !== "all") {
    filtered = filtered.filter(
      (transaction) => transaction.type === currentFilter,
    );
  }

  if (sortTransactions?.value === "latest") {
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else {
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  renderTable(filtered);
}

// setting
const profileForm = document.getElementById("profileForm");

profileForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = getData(STORAGE.USER);

  if (!user) return;

  user.name = document.getElementById("fullName").value.trim();
  saveData(STORAGE.USER, user);
  loadUser(true);
});

const passwordForm = document.getElementById("passwordForm");

passwordForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const user = getData(STORAGE.USER);

  if (user) {
    user.password = newPassword;
    saveData(STORAGE.USER, user);
  }

  passwordForm.reset();
  alert("Password Updated");
});

const currencySelect = document.getElementById("currencySelect");

currencySelect?.addEventListener("change", () => {
  localStorage.setItem(STORAGE.CURRENCY, currencySelect.value);
  refreshDashboard();
});

// import
const exportBtn = document.getElementById("exportData");

exportBtn?.addEventListener("click", () => {
  if (transactions.length === 0) {
    alert("No data found.");
    return;
  }

  let csv = "Date,Description,Category,Type,Amount\n";

  transactions.forEach((transaction) => {
    csv +=
      `${transaction.date},` +
      `${transaction.description},` +
      `${transaction.category},` +
      `${transaction.type},` +
      `${transaction.amount}\n`;
  });

  const file = new Blob([csv], {
    type: "text/csv",
  });

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "TrackFi_Data.csv";
  link.click();
  URL.revokeObjectURL(url);
});

const resetBtn = document.getElementById("resetData");

resetBtn?.addEventListener("click", () => {
  if (!confirm("Delete all transactions?")) {
    return;
  }

  transactions = [];
  saveTransactions();
  refreshDashboard();
});

refreshDashboard();
applyFilters();
