// Authentication Logic - Multi-user support

const AUTH_CREDENTIALS = [
    {
        email: "admin@stock.com",
        password: "admin123",
        name: "Administrateur"
    },
    {
        email: "charlescisse86@gmail.com",
        password: "cisse123",
        name: "Charles Cissé"
    }
    // Vous pouvez ajouter d'autres utilisateurs ici
];

// Check if user is already logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    if (isLoggedIn === 'true' && currentPage.includes('index.html')) {
        window.location.href = 'dashboard.html';
    } else if (isLoggedIn !== 'true' && !currentPage.includes('index.html')) {
        window.location.href = 'index.html';
    }
}

// Login function
function login(email, password) {
    // Rechercher l'utilisateur dans la liste
    const user = AUTH_CREDENTIALS.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.name);
        
        // Initialize user-specific data if first login
        if (typeof initializeData === 'function') {
            initializeData();
        }
        
        return true;
    }
  return false;
}

// Logout function
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.location.href = "index.html";
}

// Get current user
function getCurrentUser() {
  return {
    email: localStorage.getItem("userEmail"),
    name: localStorage.getItem("userName"),
  };
}

// Handle login form submission
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    if (login(email, password)) {
      window.location.href = "dashboard.html";
    } else {
      errorMessage.classList.remove("hidden");
      setTimeout(() => {
        errorMessage.classList.add("hidden");
      }, 3000);
    }
  });
}

// Handle logout button
if (document.getElementById("logoutBtn")) {
  document.getElementById("logoutBtn").addEventListener("click", function (e) {
    e.preventDefault();
    logout();
  });
}

// Check authentication on page load
checkAuth();
