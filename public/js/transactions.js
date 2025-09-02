// Transactions Module
class TransactionManager {
  constructor() {
    this.currentPage = 1;
    this.currentFilters = {};
    this.init();
  }

  init() {
    this.bindEvents();
  }

  // Bind transaction event listeners
  bindEvents() {
    // Quick action buttons
    document
      .getElementById('addTransactionBtn')
      .addEventListener('click', () => {
        this.showTransactionForm();
      });

    document
      .getElementById('viewTransactionsBtn')
      .addEventListener('click', () => {
        this.showTransactionsList();
      });

    document.getElementById('viewStatsBtn').addEventListener('click', () => {
      this.showStatistics();
    });

    // Transaction form
    document
      .getElementById('transactionFormElement')
      .addEventListener('submit', e => {
        e.preventDefault();
        this.handleCreateTransaction();
      });

    document
      .getElementById('cancelTransactionBtn')
      .addEventListener('click', () => {
        this.hideTransactionForm();
      });

    // Filters
    document.getElementById('applyFiltersBtn').addEventListener('click', () => {
      this.applyFilters();
    });

    // Pagination
    document.getElementById('prevPageBtn').addEventListener('click', () => {
      this.previousPage();
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
      this.nextPage();
    });
  }

  // Show transaction form
  showTransactionForm() {
    this.hideAllSections();
    document.getElementById('transactionForm').classList.remove('hidden');

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('transactionDate').value = today;
  }

  // Hide transaction form
  hideTransactionForm() {
    document.getElementById('transactionForm').classList.add('hidden');
    document.getElementById('transactionFormElement').reset();
  }

  // Show transactions list
  showTransactionsList() {
    this.hideAllSections();
    document.getElementById('transactionsList').classList.remove('hidden');
    this.loadTransactions();
  }

  // Show statistics
  showStatistics() {
    this.hideAllSections();
    document.getElementById('statistics').classList.remove('hidden');
    this.loadStatistics();
  }

  // Hide all sections
  hideAllSections() {
    document.getElementById('transactionForm').classList.add('hidden');
    document.getElementById('transactionsList').classList.add('hidden');
    document.getElementById('statistics').classList.add('hidden');
    document.getElementById('profileEditForm').classList.add('hidden');
  }

  // Handle transaction creation
  async handleCreateTransaction() {
    const transactionData = {
      transactionType: document.getElementById('transactionType').value,
      amount: parseFloat(document.getElementById('transactionAmount').value),
      description: document.getElementById('transactionDescription').value,
      category:
        document.getElementById('transactionCategory').value || undefined,
      transactionDate:
        document.getElementById('transactionDate').value || undefined,
    };

    try {
      const response = await apiService.createTransaction(transactionData);

      if (response.success) {
        authManager.showNotification(
          'Transaction created successfully!',
          'success'
        );
        this.hideTransactionForm();

        // Refresh balance
        authManager.loadUserData();

        // If transactions list is visible, refresh it
        if (
          !document
            .getElementById('transactionsList')
            .classList.contains('hidden')
        ) {
          this.loadTransactions();
        }
      }
    } catch (error) {
      authManager.showNotification(
        error.message || 'Failed to create transaction',
        'error'
      );
    }
  }

  // Load transactions with current filters and pagination
  async loadTransactions() {
    try {
      const filters = {
        ...this.currentFilters,
        page: this.currentPage,
        limit: 10,
      };

      const response = await apiService.getTransactions(filters);

      if (response.success) {
        this.displayTransactions(response.data.transactions);
        this.updatePagination(response.data.pagination);
      }
    } catch (error) {
      authManager.showNotification(
        error.message || 'Failed to load transactions',
        'error'
      );
    }
  }

  // Display transactions in the UI
  displayTransactions(transactions) {
    const container = document.getElementById('transactionsContainer');
    container.innerHTML = '';

    if (transactions.length === 0) {
      container.innerHTML = '<p>No transactions found.</p>';
      return;
    }

    transactions.forEach(transaction => {
      const transactionElement = this.createTransactionElement(transaction);
      container.appendChild(transactionElement);
    });
  }

  // Create transaction element
  createTransactionElement(transaction) {
    const div = document.createElement('div');
    div.className = `transaction-item ${transaction.transactionType}`;

    const date = new Date(transaction.transactionDate).toLocaleDateString();
    const amount =
      transaction.formattedAmount || `$${transaction.amount.toFixed(2)}`;

    div.innerHTML = `
            <div class="transaction-header">
                <span class="transaction-amount ${transaction.transactionType}">${amount}</span>
                <span>${date}</span>
            </div>
            <div class="transaction-details">
                <p><strong>${transaction.description}</strong></p>
                ${transaction.category ? `<p>Category: ${transaction.category}</p>` : ''}
                <p>Balance: $${transaction.balanceAfter.toFixed(2)}</p>
            </div>
            <div class="transaction-actions">
                <button class="edit-btn" onclick="transactionManager.editTransaction('${transaction.transactionId}')">Edit</button>
                <button class="delete-btn" onclick="transactionManager.deleteTransaction('${transaction.transactionId}')">Delete</button>
            </div>
        `;

    return div;
  }

  // Update pagination controls
  updatePagination(pagination) {
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    pageInfo.textContent = `Page ${pagination.currentPage} of ${pagination.totalPages}`;
    prevBtn.disabled = !pagination.hasPrevPage;
    nextBtn.disabled = !pagination.hasNextPage;
  }

  // Apply filters
  applyFilters() {
    this.currentFilters = {
      transactionType: document.getElementById('filterType').value || undefined,
      category: document.getElementById('filterCategory').value || undefined,
      startDate: document.getElementById('filterStartDate').value || undefined,
      endDate: document.getElementById('filterEndDate').value || undefined,
    };

    this.currentPage = 1;
    this.loadTransactions();
  }

  // Previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  // Next page
  nextPage() {
    this.currentPage++;
    this.loadTransactions();
  }

  // Load statistics
  async loadStatistics() {
    try {
      const response = await apiService.getTransactionStats(
        this.currentFilters
      );

      if (response.success) {
        this.displayStatistics(response.data.statistics);
      }
    } catch (error) {
      authManager.showNotification(
        error.message || 'Failed to load statistics',
        'error'
      );
    }
  }

  // Display statistics
  displayStatistics(stats) {
    const container = document.getElementById('statsContainer');

    container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalTransactions}</div>
                    <div class="stat-label">Total Transactions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.creditTransactions.count}</div>
                    <div class="stat-label">Income Transactions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.debitTransactions.count}</div>
                    <div class="stat-label">Expense Transactions</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$${stats.netAmount.toFixed(2)}</div>
                    <div class="stat-label">Net Amount</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$${stats.creditTransactions.totalAmount.toFixed(2)}</div>
                    <div class="stat-label">Total Income</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">$${stats.debitTransactions.totalAmount.toFixed(2)}</div>
                    <div class="stat-label">Total Expenses</div>
                </div>
            </div>
        `;
  }

  // Edit transaction
  async editTransaction(transactionId) {
    try {
      const response = await apiService.getTransactionById(transactionId);

      if (response.success) {
        const transaction = response.data.transaction;

        // Populate form for editing
        document.getElementById('transactionType').value =
          transaction.transactionType;
        document.getElementById('transactionAmount').value = transaction.amount;
        document.getElementById('transactionDescription').value =
          transaction.description;
        document.getElementById('transactionCategory').value =
          transaction.category || '';
        document.getElementById('transactionDate').value =
          transaction.transactionDate.split('T')[0];

        // Change form to edit mode
        const form = document.getElementById('transactionFormElement');
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Transaction';

        // Store transaction ID for update
        form.dataset.editId = transactionId;

        // Change form action
        form.onsubmit = e => {
          e.preventDefault();
          this.handleUpdateTransaction(transactionId);
        };

        this.showTransactionForm();
      }
    } catch (error) {
      authManager.showNotification(
        error.message || 'Failed to load transaction',
        'error'
      );
    }
  }

  // Handle transaction update
  async handleUpdateTransaction(transactionId) {
    const updateData = {
      description: document.getElementById('transactionDescription').value,
      category:
        document.getElementById('transactionCategory').value || undefined,
      transactionDate:
        document.getElementById('transactionDate').value || undefined,
    };

    try {
      const response = await apiService.updateTransaction(
        transactionId,
        updateData
      );

      if (response.success) {
        authManager.showNotification(
          'Transaction updated successfully!',
          'success'
        );
        this.hideTransactionForm();
        this.loadTransactions();
      }
    } catch (error) {
      authManager.showNotification(
        error.message || 'Failed to update transaction',
        'error'
      );
    }
  }

  // Delete transaction
  async deleteTransaction(transactionId) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      const response = await apiService.deleteTransaction(transactionId);

      if (response.success) {
        authManager.showNotification(
          'Transaction deleted successfully!',
          'success'
        );
        this.loadTransactions();

        // Refresh balance
        authManager.loadUserData();
      }
    } catch (error) {
      authManager.showNotification(
        error.message || 'Failed to delete transaction',
        'error'
      );
    }
  }
}

// Create global transaction manager instance
const transactionManager = new TransactionManager();
