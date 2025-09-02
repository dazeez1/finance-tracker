// Authentication Module
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    this.checkAuthStatus();
    this.bindEvents();
  }

  // Check if user is already authenticated
  async checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const profile = await apiService.getProfile();
        this.setCurrentUser(profile.data.user);
        this.showDashboard();
      } catch (error) {
        console.error('Token validation failed:', error);
        this.logout();
      }
    }
  }

  // Bind authentication event listeners
  bindEvents() {
    // Login form submission
    document
      .getElementById('loginFormElement')
      .addEventListener('submit', e => {
        e.preventDefault();
        this.handleLogin();
      });

    // Signup form submission
    document
      .getElementById('signupFormElement')
      .addEventListener('submit', e => {
        e.preventDefault();
        this.handleSignup();
      });

    // Navigation buttons
    document.getElementById('loginBtn').addEventListener('click', () => {
      this.showLoginForm();
    });

    document.getElementById('signupBtn').addEventListener('click', () => {
      this.showSignupForm();
    });

    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.logout();
    });
  }

  // Show login form
  showLoginForm() {
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
  }

  // Show signup form
  showSignupForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
  }

  // Handle user login
  async handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const response = await apiService.login({
        emailAddress: email,
        password,
      });

      if (response.success) {
        apiService.setToken(response.data.token);
        this.setCurrentUser(response.data.user);
        this.showDashboard();
        this.showNotification('Login successful!', 'success');

        // Clear form
        document.getElementById('loginFormElement').reset();
      }
    } catch (error) {
      this.showNotification(error.message || 'Login failed', 'error');
    }
  }

  // Handle user signup
  async handleSignup() {
    const fullName = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const accountType = document.getElementById('signupAccountType').value;
    const password = document.getElementById('signupPassword').value;

    try {
      const response = await apiService.signup({
        fullName,
        emailAddress: email,
        accountType,
        password,
      });

      if (response.success) {
        this.showNotification(
          'Account created successfully! Please login.',
          'success'
        );
        this.showLoginForm();

        // Clear form
        document.getElementById('signupFormElement').reset();
      }
    } catch (error) {
      this.showNotification(error.message || 'Signup failed', 'error');
    }
  }

  // Set current user and update UI
  setCurrentUser(user) {
    this.currentUser = user;
    this.isAuthenticated = true;

    // Update navigation
    document.getElementById('loginBtn').classList.add('hidden');
    document.getElementById('signupBtn').classList.add('hidden');
    document.getElementById('logoutBtn').classList.remove('hidden');

    // Update user info in dashboard
    document.getElementById('userName').textContent = user.fullName;
    document.getElementById('userAccountType').textContent = user.accountType;
  }

  // Show dashboard
  showDashboard() {
    document.getElementById('authForms').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');

    // Load user data
    this.loadUserData();
  }

  // Load user data for dashboard
  async loadUserData() {
    try {
      const balanceResponse = await apiService.getCurrentBalance();
      if (balanceResponse.success) {
        document.getElementById('currentBalance').textContent =
          balanceResponse.data.currentBalance.toFixed(2);
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  }

  // Logout user
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    apiService.clearToken();

    // Reset UI
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('authForms').classList.remove('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('signupForm').classList.add('hidden');

    // Update navigation
    document.getElementById('loginBtn').classList.remove('hidden');
    document.getElementById('signupBtn').classList.remove('hidden');
    document.getElementById('logoutBtn').classList.add('hidden');

    // Clear forms
    document.getElementById('loginFormElement').reset();
    document.getElementById('signupFormElement').reset();

    this.showNotification('Logged out successfully', 'success');
  }

  // Show notification
  showNotification(message, type = 'info') {
    const notifications = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notifications.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated;
  }
}

// Create global auth manager instance
const authManager = new AuthManager();
