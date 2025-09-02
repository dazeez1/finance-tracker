// Dashboard Module
class DashboardManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  // Bind dashboard event listeners
  bindEvents() {
    document.getElementById('editProfileBtn').addEventListener('click', () => {
      this.showProfileEditForm();
    });

    document
      .getElementById('profileEditFormElement')
      .addEventListener('submit', e => {
        e.preventDefault();
        this.handleProfileUpdate();
      });

    document
      .getElementById('cancelProfileEditBtn')
      .addEventListener('click', () => {
        this.hideProfileEditForm();
      });
  }

  // Show profile edit form
  showProfileEditForm() {
    transactionManager.hideAllSections();
    document.getElementById('profileEditForm').classList.remove('hidden');

    // Populate form with current user data
    const currentUser = authManager.getCurrentUser();
    if (currentUser) {
      document.getElementById('editName').value = currentUser.fullName;
      document.getElementById('editAccountType').value =
        currentUser.accountType;
    }
  }

  // Hide profile edit form
  hideProfileEditForm() {
    document.getElementById('profileEditForm').classList.add('hidden');
    document.getElementById('profileEditFormElement').reset();
  }

  // Handle profile update
  async handleProfileUpdate() {
    const profileData = {
      fullName: document.getElementById('editName').value,
      accountType: document.getElementById('editAccountType').value,
    };

    try {
      const response = await apiService.updateUserProfile(profileData);

      if (response.success) {
        // Update current user data
        const updatedUser = response.data.user;
        authManager.setCurrentUser(updatedUser);

        authManager.showNotification(
          'Profile updated successfully!',
          'success'
        );
        this.hideProfileEditForm();
      }
    } catch (error) {
      authManager.showNotification(
        error.message || 'Failed to update profile',
        'error'
      );
    }
  }

  // Refresh dashboard data
  async refreshDashboard() {
    try {
      // Refresh user profile and balance
      const [profileResponse, balanceResponse] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getCurrentBalance(),
      ]);

      if (profileResponse.success) {
        const user = profileResponse.data.user;
        document.getElementById('userName').textContent = user.fullName;
        document.getElementById('userAccountType').textContent =
          user.accountType;
      }

      if (balanceResponse.success) {
        document.getElementById('currentBalance').textContent =
          balanceResponse.data.currentBalance.toFixed(2);
      }
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
    }
  }

  // Show dashboard overview
  showOverview() {
    transactionManager.hideAllSections();
    // Dashboard overview is already visible by default
  }

  // Get dashboard summary
  async getDashboardSummary() {
    try {
      const [balanceResponse, statsResponse] = await Promise.all([
        apiService.getCurrentBalance(),
        apiService.getTransactionStats(),
      ]);

      return {
        balance: balanceResponse.success
          ? balanceResponse.data.currentBalance
          : 0,
        stats: statsResponse.success ? statsResponse.data.statistics : null,
      };
    } catch (error) {
      console.error('Failed to get dashboard summary:', error);
      return { balance: 0, stats: null };
    }
  }
}

// Create global dashboard manager instance
const dashboardManager = new DashboardManager();
