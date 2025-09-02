// API Service - Handles all backend communication
class ApiService {
  constructor() {
    // HARD FIX: Set exact URL for Render hosting
    this.baseURL = 'https://finance-tracker-fc5u.onrender.com/api';

    console.log('🌐 API Base URL:', this.baseURL);
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Update base URL (useful for environment changes)
  updateBaseURL(newBaseURL) {
    this.baseURL = newBaseURL;
    console.log('🔄 API Base URL updated to:', this.baseURL);
  }

  // Get headers for authenticated requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await fetch(
        'https://finance-tracker-fc5u.onrender.com/health'
      );
      if (response.ok) {
        console.log('✅ API connection successful');
        return true;
      } else {
        console.log('❌ API connection failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ API connection error:', error);
      return false;
    }
  }

  // Test signup data with debug endpoint
  async testSignupData(signupData) {
    try {
      const response = await fetch(
        'https://finance-tracker-fc5u.onrender.com/debug/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(signupData),
        }
      );

      const data = await response.json();
      console.log('🔍 Debug signup response:', data);
      return data;
    } catch (error) {
      console.error('❌ Debug signup error:', error);
      return null;
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log('🌐 Making API request to:', url);

      const config = {
        headers: this.getHeaders(),
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getCurrentBalance() {
    return this.request('/users/balance');
  }

  async updateBalance(balanceData) {
    return this.request('/users/balance', {
      method: 'PUT',
      body: JSON.stringify(balanceData),
    });
  }

  // Transaction endpoints
  async createTransaction(transactionData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async getTransactions(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (
        filters[key] !== null &&
        filters[key] !== undefined &&
        filters[key] !== ''
      ) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/transactions?${queryString}`
      : '/transactions';

    return this.request(endpoint);
  }

  async getTransactionById(transactionId) {
    return this.request(`/transactions/${transactionId}`);
  }

  async updateTransaction(transactionId, updateData) {
    return this.request(`/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteTransaction(transactionId) {
    return this.request(`/transactions/${transactionId}`, {
      method: 'DELETE',
    });
  }

  async getTransactionStats(filters = {}) {
    const queryParams = new URLSearchParams();

    Object.keys(filters).forEach(key => {
      if (
        filters[key] !== null &&
        filters[key] !== undefined &&
        filters[key] !== ''
      ) {
        queryParams.append(key, filters[key]);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `/transactions/stats?${queryString}`
      : '/transactions/stats';

    return this.request(endpoint);
  }
}

// Create global API service instance
const apiService = new ApiService();
