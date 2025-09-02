// Main Application File
class FinanceTrackerApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkInitialState();
    console.log('Finance Tracker App initialized');
  }

  // Setup global event listeners
  setupEventListeners() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && authManager.isUserAuthenticated()) {
        // Refresh data when page becomes visible
        this.refreshAppData();
      }
    });

    // Handle window focus
    window.addEventListener('focus', () => {
      if (authManager.isUserAuthenticated()) {
        this.refreshAppData();
      }
    });

    // Handle beforeunload to save any unsaved data
    window.addEventListener('beforeunload', () => {
      // Save any pending changes if needed
      this.saveAppState();
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', e => {
      this.handleKeyboardShortcuts(e);
    });
  }

  // Check initial application state
  checkInitialState() {
    // Test API connection first
    this.testAPIConnection();
    
    // Check if user is authenticated
    if (authManager.isUserAuthenticated()) {
      // User is logged in, ensure dashboard is visible
      authManager.showDashboard();
    } else {
      // User is not logged in, show login form
      authManager.showLoginForm();
    }
  }

  // Test API connection
  async testAPIConnection() {
    try {
      const isConnected = await apiService.testConnection();
      if (!isConnected) {
        console.warn('⚠️ API connection test failed - some features may not work');
      }
    } catch (error) {
      console.error('❌ API connection test error:', error);
    }
  }

  // Refresh application data
  async refreshAppData() {
    if (authManager.isUserAuthenticated()) {
      try {
        await Promise.all([
          authManager.loadUserData(),
          dashboardManager.refreshDashboard(),
        ]);
      } catch (error) {
        console.error('Failed to refresh app data:', error);
      }
    }
  }

  // Save application state
  saveAppState() {
    // Save any pending changes to localStorage if needed
    const appState = {
      lastUpdated: new Date().toISOString(),
      filters: transactionManager.currentFilters,
      currentPage: transactionManager.currentPage,
    };

    localStorage.setItem('financeTrackerState', JSON.stringify(appState));
  }

  // Load application state
  loadAppState() {
    try {
      const savedState = localStorage.getItem('financeTrackerState');
      if (savedState) {
        const state = JSON.parse(savedState);

        // Restore transaction manager state
        if (state.filters) {
          transactionManager.currentFilters = state.filters;
        }
        if (state.currentPage) {
          transactionManager.currentPage = state.currentPage;
        }
      }
    } catch (error) {
      console.error('Failed to load app state:', error);
    }
  }

  // Handle keyboard shortcuts
  handleKeyboardShortcuts(e) {
    // Only handle shortcuts when not in input fields
    if (
      e.target.tagName === 'INPUT' ||
      e.target.tagName === 'TEXTAREA' ||
      e.target.tagName === 'SELECT'
    ) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case '1':
        if (authManager.isUserAuthenticated()) {
          e.preventDefault();
          transactionManager.showTransactionForm();
        }
        break;
      case '2':
        if (authManager.isUserAuthenticated()) {
          e.preventDefault();
          transactionManager.showTransactionsList();
        }
        break;
      case '3':
        if (authManager.isUserAuthenticated()) {
          e.preventDefault();
          transactionManager.showStatistics();
        }
        break;
      case '4':
        if (authManager.isUserAuthenticated()) {
          e.preventDefault();
          dashboardManager.showProfileEditForm();
        }
        break;
      case 'escape':
        e.preventDefault();
        this.hideAllForms();
        break;
      case 'h':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          if (authManager.isUserAuthenticated()) {
            dashboardManager.showOverview();
          }
        }
        break;
    }
  }

  // Hide all forms and show dashboard overview
  hideAllForms() {
    if (authManager.isUserAuthenticated()) {
      dashboardManager.showOverview();
    }
  }

  // Get application statistics
  async getAppStats() {
    if (!authManager.isUserAuthenticated()) {
      return null;
    }

    try {
      const summary = await dashboardManager.getDashboardSummary();
      return summary;
    } catch (error) {
      console.error('Failed to get app stats:', error);
      return null;
    }
  }

  // Export application data
  async exportData() {
    if (!authManager.isUserAuthenticated()) {
      return null;
    }

    try {
      const [transactions, profile, balance] = await Promise.all([
        apiService.getTransactions({ limit: 1000 }), // Get all transactions
        apiService.getUserProfile(),
        apiService.getCurrentBalance(),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        user: profile.data.user,
        balance: balance.data.currentBalance,
        transactions: transactions.data.transactions,
      };

      return exportData;
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  // Download data as JSON
  async downloadData() {
    const data = await this.exportData();
    if (!data) {
      authManager.showNotification('Failed to export data', 'error');
      return;
    }

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `finance-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    authManager.showNotification('Data exported successfully', 'success');
  }

  // Reset application state
  resetAppState() {
    // Clear all stored data
    localStorage.removeItem('financeTrackerState');

    // Reset transaction manager
    transactionManager.currentPage = 1;
    transactionManager.currentFilters = {};

    authManager.showNotification('Application state reset', 'info');
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.financeTrackerApp = new FinanceTrackerApp();

  // Load saved app state
  window.financeTrackerApp.loadAppState();

  // Add export button to dashboard if needed
  const quickActions = document.querySelector('.quick-actions');
  if (quickActions) {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'action-btn';
    exportBtn.textContent = 'Export Data';
    exportBtn.addEventListener('click', () => {
      window.financeTrackerApp.downloadData();
    });
    quickActions.appendChild(exportBtn);
  }
});

// Global error handler
window.addEventListener('error', event => {
  console.error('Global error:', event.error);
  if (window.authManager) {
    window.authManager.showNotification(
      'An unexpected error occurred',
      'error'
    );
  }
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', event => {
  console.error('Unhandled promise rejection:', event.reason);
  if (window.authManager) {
    window.authManager.showNotification(
      'An unexpected error occurred',
      'error'
    );
  }
});
