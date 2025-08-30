import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
// For React Native development, use your computer's IP address instead of localhost
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000'  // Try this first
  // ? 'http://192.168.1.10:8000'  // If localhost doesn't work, try your IP
  : 'https://your-production-api.com'; // Change for production

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token
  async getAuthToken() {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Helper method to set auth token
  async setAuthToken(token) {
    try {
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const token = await this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const fullUrl = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(fullUrl, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}`);
      }
      
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.access_token) {
      await this.setAuthToken(response.access_token);
    }
    
    return response;
  }

  async logout() {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Merchant Management
  async getMerchants() {
    return await this.request('/api/merchants');
  }

  async createMerchant(merchantData) {
    return await this.request('/api/merchants', {
      method: 'POST',
      body: JSON.stringify(merchantData),
    });
  }

  async updateMerchant(id, merchantData) {
    return await this.request(`/api/merchants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(merchantData),
    });
  }

  async deleteMerchant(id) {
    return await this.request(`/api/merchants/${id}`, {
      method: 'DELETE',
    });
  }

  async testMerchantConnection(id) {
    return await this.request(`/api/merchants/${id}/test-connection`);
  }

  // QRIS Operations
  async createQRISInvoice(merchantId, amount, description = '') {
    return await this.request('/api/qris/create-invoice', {
      method: 'POST',
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: amount,
        description: description,
      }),
    });
  }

  async checkQRISStatus(invoiceId) {
    return await this.request(`/api/qris/check-status/${invoiceId}`);
  }

  async getQRISTransactions(merchantId, page = 1, limit = 20) {
    return await this.request(`/api/qris/transactions?merchant_id=${merchantId}&page=${page}&limit=${limit}`);
  }
}

// Export singleton instance
export default new ApiService();
