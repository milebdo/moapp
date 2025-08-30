#!/usr/bin/env node
/**
 * QRIS End-to-End Test
 * Complete scenario test for QRIS payment flow:
 * 1. QRIS Simulator creates payment
 * 2. Backend API receives and processes data
 * 3. Frontend displays transaction notification
 */

const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class QRISEndToEndTest {
  constructor() {
    this.backendUrl = 'http://localhost:8000';
    this.simulatorUrl = 'http://localhost:7000';
    this.frontendUrl = 'http://localhost:19006'; // Expo development server
    this.testResults = [];
    this.testMerchantId = null;
    this.testInvoiceId = null;
  }

  logTest(testName, status, message = '') {
    const timestamp = new Date().toLocaleTimeString();
    const statusIcon = status ? '✅' : '❌';
    const logEntry = `[${timestamp}] ${statusIcon} ${testName}: ${message}`;
    console.log(logEntry);
    this.testResults.push({
      test: testName,
      status,
      message,
      timestamp
    });
    return status;
  }

  async startServices() {
    console.log('🚀 Starting Services...');
    
    // Check if services are already running
    const services = [
      { name: 'Backend', url: `${this.backendUrl}/health` },
      { name: 'QRIS Simulator', url: `${this.simulatorUrl}/not_official/mockupPayment` },
    ];

    for (const service of services) {
      try {
        await axios.get(service.url, { timeout: 5000 });
        console.log(`✅ ${service.name} is already running`);
      } catch (error) {
        console.log(`⚠️ ${service.name} is not running - please start it manually`);
        console.log(`   Backend: cd backend && python main.py`);
        console.log(`   Simulator: cd qris-simulator/QRIS-Simulator && node dist/index.js`);
        return false;
      }
    }
    
    return true;
  }

  async testBackendHealth() {
    try {
      const response = await axios.get(`${this.backendUrl}/health`, { timeout: 5000 });
      return this.logTest(
        'Backend Health Check',
        response.status === 200,
        `Status: ${response.status}`
      );
    } catch (error) {
      return this.logTest('Backend Health Check', false, error.message);
    }
  }

  async testCreateMerchant() {
    const merchantData = {
      name: 'E2E Test Merchant',
      merchant_id: 'E2E123',
      api_key: 'e2e_test_key_789',
      is_active: true
    };

    try {
      const response = await axios.post(`${this.backendUrl}/api/merchants`, merchantData, {
        timeout: 10000
      });
      
      if (response.status === 200) {
        this.testMerchantId = response.data.id;
        return this.logTest(
          'Create Test Merchant',
          true,
          `Merchant ID: ${this.testMerchantId}`
        );
      } else {
        return this.logTest(
          'Create Test Merchant',
          false,
          `Status: ${response.status}`
        );
      }
    } catch (error) {
      return this.logTest('Create Test Merchant', false, error.message);
    }
  }

  async testMerchantConnection() {
    try {
      const response = await axios.post(
        `${this.backendUrl}/api/merchants/${this.testMerchantId}/test-connection`,
        {},
        { timeout: 10000 }
      );
      
      return this.logTest(
        'Test Merchant Connection',
        response.status === 200,
        `Status: ${response.status}`
      );
    } catch (error) {
      return this.logTest('Test Merchant Connection', false, error.message);
    }
  }

  async testCreateQRISInvoice() {
    const invoiceData = {
      merchant_id: this.testMerchantId,
      amount: 100000,
      description: 'E2E Test Payment'
    };

    try {
      const response = await axios.post(
        `${this.backendUrl}/api/qris/create-invoice`,
        invoiceData,
        { timeout: 10000 }
      );
      
      if (response.status === 200) {
        this.testInvoiceId = response.data.invoice_id;
        return this.logTest(
          'Create QRIS Invoice',
          true,
          `Invoice ID: ${this.testInvoiceId}, Amount: ${response.data.amount}`
        );
      } else {
        return this.logTest(
          'Create QRIS Invoice',
          false,
          `Status: ${response.status}`
        );
      }
    } catch (error) {
      return this.logTest('Create QRIS Invoice', false, error.message);
    }
  }

  async testSimulatorPaymentFlow() {
    console.log('\n🎯 Testing QRIS Simulator Payment Flow...');
    
    const simulatorData = {
      mID: 'E2E123',
      apikey: 'e2e_test_key_789',
      amount: 100000,
      description: 'E2E Test Payment'
    };

    try {
      const response = await axios.get(
        `${this.simulatorUrl}/restapi/qris/show_qris.php`,
        { params: simulatorData, timeout: 10000 }
      );
      
      if (response.status === 200) {
        const result = response.data;
        if (result.status === 'success') {
          const invoiceId = result.data?.qris_invoiceid;
          return this.logTest(
            'Simulator Payment Creation',
            true,
            `Invoice ID: ${invoiceId}`
          );
        } else {
          return this.logTest(
            'Simulator Payment Creation',
            false,
            `Simulator error: ${result.data?.qris_status || 'Unknown error'}`
          );
        }
      } else {
        return this.logTest(
          'Simulator Payment Creation',
          false,
          `HTTP Status: ${response.status}`
        );
      }
    } catch (error) {
      return this.logTest('Simulator Payment Creation', false, error.message);
    }
  }

  async testCheckPaymentStatus() {
    if (!this.testInvoiceId) {
      return this.logTest('Check Payment Status', false, 'No invoice ID available');
    }

    try {
      const response = await axios.get(
        `${this.backendUrl}/api/qris/check-status/${this.testInvoiceId}`,
        { timeout: 10000 }
      );
      
      return this.logTest(
        'Check Payment Status',
        response.status === 200,
        `Status: ${response.status}, Response: ${JSON.stringify(response.data)}`
      );
    } catch (error) {
      return this.logTest('Check Payment Status', false, error.message);
    }
  }

  async testGetTransactions() {
    try {
      const response = await axios.get(
        `${this.backendUrl}/api/qris/transactions?merchant_id=${this.testMerchantId}&page=1&limit=10`,
        { timeout: 10000 }
      );
      
      if (response.status === 200) {
        const transactions = response.data;
        return this.logTest(
          'Get Transactions',
          true,
          `Found ${transactions.transactions?.length || 0} transactions`
        );
      } else {
        return this.logTest(
          'Get Transactions',
          false,
          `Status: ${response.status}`
        );
      }
    } catch (error) {
      return this.logTest('Get Transactions', false, error.message);
    }
  }

  async testFrontendAPIEndpoints() {
    console.log('\n📱 Testing Frontend API Integration...');
    
    const endpoints = [
      {
        method: 'GET',
        url: `${this.backendUrl}/api/merchants`,
        name: 'Get Merchants'
      },
      {
        method: 'GET',
        url: `${this.backendUrl}/api/qris/transactions?merchant_id=${this.testMerchantId}`,
        name: 'Get QRIS Transactions'
      }
    ];

    if (this.testInvoiceId) {
      endpoints.push({
        method: 'GET',
        url: `${this.backendUrl}/api/qris/check-status/${this.testInvoiceId}`,
        name: 'Check QRIS Status'
      });
    }

    for (const endpoint of endpoints) {
      try {
        const response = await axios.request({
          method: endpoint.method,
          url: endpoint.url,
          timeout: 10000
        });
        
        this.logTest(
          `Frontend API - ${endpoint.name}`,
          response.status === 200,
          `Status: ${response.status}`
        );
      } catch (error) {
        this.logTest(`Frontend API - ${endpoint.name}`, false, error.message);
      }
    }
  }

  async testFrontendComponents() {
    console.log('\n🎨 Testing Frontend Components...');
    
    // Test if the TransactionNotification component exists
    try {
      const fs = require('fs');
      const componentPath = './src/components/TransactionNotification.js';
      
      if (fs.existsSync(componentPath)) {
        this.logTest('TransactionNotification Component', true, 'Component file exists');
      } else {
        this.logTest('TransactionNotification Component', false, 'Component file not found');
      }
    } catch (error) {
      this.logTest('TransactionNotification Component', false, error.message);
    }

    // Test if ChatroomScreen has been updated
    try {
      const fs = require('fs');
      const screenPath = './src/screens/ChatroomScreen.js';
      
      if (fs.existsSync(screenPath)) {
        const content = fs.readFileSync(screenPath, 'utf8');
        const hasTransactionImport = content.includes('TransactionNotification');
        const hasTransactionState = content.includes('transactions');
        const hasTransactionRendering = content.includes('transactions.map');
        
        this.logTest(
          'ChatroomScreen Integration',
          hasTransactionImport && hasTransactionState && hasTransactionRendering,
          `Import: ${hasTransactionImport}, State: ${hasTransactionState}, Rendering: ${hasTransactionRendering}`
        );
      } else {
        this.logTest('ChatroomScreen Integration', false, 'Screen file not found');
      }
    } catch (error) {
      this.logTest('ChatroomScreen Integration', false, error.message);
    }
  }

  async runCompleteScenario() {
    console.log('🧪 QRIS End-to-End Scenario Test');
    console.log('=' .repeat(60));
    console.log('Testing complete flow: Simulator → Backend → Frontend');
    console.log('=' .repeat(60));

    // Start services
    if (!(await this.startServices())) {
      console.log('\n❌ Cannot proceed without required services');
      return false;
    }

    // Wait for services to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Run all tests
    const tests = [
      this.testBackendHealth.bind(this),
      this.testCreateMerchant.bind(this),
      this.testMerchantConnection.bind(this),
      this.testCreateQRISInvoice.bind(this),
      this.testSimulatorPaymentFlow.bind(this),
      this.testCheckPaymentStatus.bind(this),
      this.testGetTransactions.bind(this),
      this.testFrontendAPIEndpoints.bind(this),
      this.testFrontendComponents.bind(this),
    ];

    let allPassed = true;
    for (const test of tests) {
      if (!(await test())) {
        allPassed = false;
      }
    }

    // Print summary
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(60));

    const passed = this.testResults.filter(result => result.status).length;
    const total = this.testResults.length;

    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);

    if (allPassed) {
      console.log('\n🎉 All tests passed! QRIS payment flow is working correctly.');
      console.log('\n🚀 Next Steps:');
      console.log('1. Start the React Native app: npx expo start');
      console.log('2. Navigate to ChatroomScreen to see transaction notifications');
      console.log('3. Create a QRIS payment to test the complete flow');
    } else {
      console.log('\n⚠️ Some tests failed. Check the logs above for details.');
      console.log('\n🔧 Troubleshooting:');
      console.log('- Ensure backend is running: cd backend && python main.py');
      console.log('- Ensure QRIS simulator is running: cd qris-simulator/QRIS-Simulator && node dist/index.js');
      console.log('- Check API endpoints and database connection');
    }

    return allPassed;
  }
}

async function main() {
  const test = new QRISEndToEndTest();
  const success = await test.runCompleteScenario();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = QRISEndToEndTest;
