#!/usr/bin/env node
/**
 * QRIS Payment Flow Demo
 * Demonstrates the complete QRIS payment flow from simulator to frontend
 */

const axios = require('axios');

class QRISFlowDemo {
  constructor() {
    this.backendUrl = 'http://localhost:8000';
    this.simulatorUrl = 'http://localhost:7000';
    this.demoResults = [];
  }

  logDemo(step, status, message = '') {
    const timestamp = new Date().toLocaleTimeString();
    const statusIcon = status ? '✅' : '❌';
    const logEntry = `[${timestamp}] ${statusIcon} ${step}: ${message}`;
    console.log(logEntry);
    this.demoResults.push({ step, status, message, timestamp });
    return status;
  }

  async checkServices() {
    console.log('🔍 Checking Services...');
    
    // Check Backend
    try {
      const backendResponse = await axios.get(`${this.backendUrl}/health`, { timeout: 5000 });
      this.logDemo('Backend Service', backendResponse.status === 200, 'Running on port 8000');
    } catch (error) {
      this.logDemo('Backend Service', false, 'Not running - start with: cd backend && python main.py');
    }

    // Check QRIS Simulator
    try {
      const simulatorResponse = await axios.get(`${this.simulatorUrl}/not_official/mockupPayment`, { timeout: 5000 });
      this.logDemo('QRIS Simulator', simulatorResponse.status === 200, 'Running on port 7000');
    } catch (error) {
      this.logDemo('QRIS Simulator', false, 'Not running - start with: cd qris-simulator/QRIS-Simulator && node dist/index.js');
    }
  }

  async testBackendAPIs() {
    console.log('\n🔌 Testing Backend APIs...');
    
    // Test Get Merchants
    try {
      const response = await axios.get(`${this.backendUrl}/api/merchants`, { timeout: 5000 });
      this.logDemo('Get Merchants API', response.status === 200, `Found ${response.data.length || 0} merchants`);
    } catch (error) {
      this.logDemo('Get Merchants API', false, error.message);
    }

    // Test Get QRIS Transactions
    try {
      const response = await axios.get(`${this.backendUrl}/api/qris/transactions?merchant_id=1&page=1&limit=5`, { timeout: 5000 });
      this.logDemo('Get QRIS Transactions API', response.status === 200, `Found ${response.data.transactions?.length || 0} transactions`);
    } catch (error) {
      this.logDemo('Get QRIS Transactions API', false, error.message);
    }
  }

  async testSimulatorAPIs() {
    console.log('\n🎮 Testing QRIS Simulator APIs...');
    
    // Test Simulator Mockup Payment Page
    try {
      const response = await axios.get(`${this.simulatorUrl}/not_official/mockupPayment`, { timeout: 5000 });
      this.logDemo('Simulator Mockup Page', response.status === 200, 'Payment interface accessible');
    } catch (error) {
      this.logDemo('Simulator Mockup Page', false, error.message);
    }

          // Test Simulator QRIS API (with test credentials)
      try {
        const qrisParams = {
          do: 'create-invoice',
          mID: '123456',
          apikey: 'test_api_key_123',
          cliTrxNumber: 'DEMO123',
          cliTrxAmount: 50000,
          cliTrxDescription: 'Demo Test Payment'
        };
        
        const response = await axios.get(`${this.simulatorUrl}/restapi/qris/show_qris.php`, { 
          params: qrisParams, 
          timeout: 10000 
        });
      
      if (response.status === 200) {
        const result = response.data;
        if (result.status === 'success') {
          this.logDemo('Simulator QRIS API', true, `Invoice created: ${result.data?.qris_invoiceid || 'N/A'}`);
        } else {
          this.logDemo('Simulator QRIS API', false, `API Error: ${result.data?.qris_status || 'Unknown error'}`);
        }
      } else {
        this.logDemo('Simulator QRIS API', false, `HTTP ${response.status}`);
      }
    } catch (error) {
      this.logDemo('Simulator QRIS API', false, error.message);
    }
  }

  async testFrontendComponents() {
    console.log('\n🎨 Testing Frontend Components...');
    
    const fs = require('fs');
    
    // Check TransactionNotification component
    const componentExists = fs.existsSync('src/components/TransactionNotification.js');
    this.logDemo('TransactionNotification Component', componentExists, componentExists ? 'Component file exists' : 'Component file missing');

    // Check ChatroomScreen integration
    const screenExists = fs.existsSync('src/screens/ChatroomScreen.js');
    if (screenExists) {
      const content = fs.readFileSync('src/screens/ChatroomScreen.js', 'utf8');
      const hasIntegration = content.includes('TransactionNotification') && content.includes('transactions');
      this.logDemo('ChatroomScreen Integration', hasIntegration, hasIntegration ? 'Transaction notifications integrated' : 'Integration incomplete');
    } else {
      this.logDemo('ChatroomScreen Integration', false, 'ChatroomScreen file missing');
    }

    // Check API service
    const apiExists = fs.existsSync('src/services/api.js');
    if (apiExists) {
      const content = fs.readFileSync('src/services/api.js', 'utf8');
      const hasQrisMethods = content.includes('createQRISInvoice') && content.includes('getQRISTransactions');
      this.logDemo('API Service Integration', hasQrisMethods, hasQrisMethods ? 'QRIS methods available' : 'QRIS methods missing');
    } else {
      this.logDemo('API Service Integration', false, 'API service file missing');
    }
  }

  async runDemo() {
    console.log('🎯 QRIS Payment Flow Demo');
    console.log('=' .repeat(50));
    console.log('Demonstrating: Simulator → Backend → Frontend');
    console.log('=' .repeat(50));

    await this.checkServices();
    await this.testBackendAPIs();
    await this.testSimulatorAPIs();
    await this.testFrontendComponents();

    // Print summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 DEMO SUMMARY');
    console.log('=' .repeat(50));

    const passed = this.demoResults.filter(result => result.status).length;
    const total = this.demoResults.length;

    console.log(`✅ Working: ${passed}/${total}`);
    console.log(`❌ Issues: ${total - passed}/${total}`);

    if (passed === total) {
      console.log('\n🎉 All components are working!');
      console.log('\n🚀 Next Steps:');
      console.log('1. Start the React Native app: npx expo start --web');
      console.log('2. Navigate to ChatroomScreen');
      console.log('3. Create a QRIS payment through the simulator');
      console.log('4. Watch the transaction notification appear!');
    } else {
      console.log('\n⚠️ Some components need attention.');
      console.log('\n🔧 To fix issues:');
      console.log('- Backend: cd backend && python main.py');
      console.log('- Simulator: cd qris-simulator/QRIS-Simulator && node dist/index.js');
      console.log('- Frontend: npx expo start --web');
    }

    return passed === total;
  }
}

async function main() {
  const demo = new QRISFlowDemo();
  const success = await demo.runDemo();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Demo execution failed:', error);
    process.exit(1);
  });
}

module.exports = QRISFlowDemo;
