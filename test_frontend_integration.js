#!/usr/bin/env node
/**
 * Frontend Integration Test
 * Tests the frontend components and integration for QRIS transaction notifications
 */

const fs = require('fs');
const path = require('path');

class FrontendIntegrationTest {
  constructor() {
    this.testResults = [];
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

  testFileExists(filePath, testName) {
    try {
      const exists = fs.existsSync(filePath);
      return this.logTest(
        testName,
        exists,
        exists ? 'File exists' : `File not found: ${filePath}`
      );
    } catch (error) {
      return this.logTest(testName, false, error.message);
    }
  }

  testFileContent(filePath, testName, requiredContent) {
    try {
      if (!fs.existsSync(filePath)) {
        return this.logTest(testName, false, 'File not found');
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const hasContent = requiredContent.every(item => content.includes(item));
      
      return this.logTest(
        testName,
        hasContent,
        hasContent ? 'All required content found' : `Missing: ${requiredContent.filter(item => !content.includes(item)).join(', ')}`
      );
    } catch (error) {
      return this.logTest(testName, false, error.message);
    }
  }

  testComponentStructure() {
    console.log('\n🎨 Testing Frontend Component Structure...');
    
    // Test TransactionNotification component
    this.testFileExists(
      'src/components/TransactionNotification.js',
      'TransactionNotification Component File'
    );

    this.testFileContent(
      'src/components/TransactionNotification.js',
      'TransactionNotification Component Content',
      [
        'import React',
        'TransactionNotification',
        'getStatusColor',
        'formatAmount',
        'export default'
      ]
    );
  }

  testChatroomScreenIntegration() {
    console.log('\n📱 Testing ChatroomScreen Integration...');
    
    this.testFileContent(
      'src/screens/ChatroomScreen.js',
      'ChatroomScreen Transaction Import',
      ['import TransactionNotification', 'import apiService']
    );

    this.testFileContent(
      'src/screens/ChatroomScreen.js',
      'ChatroomScreen Transaction State',
      ['transactions', 'setTransactions', 'useState']
    );

    this.testFileContent(
      'src/screens/ChatroomScreen.js',
      'ChatroomScreen Transaction Loading',
      ['loadTransactions', 'useEffect', 'getQRISTransactions']
    );

    this.testFileContent(
      'src/screens/ChatroomScreen.js',
      'ChatroomScreen Transaction Rendering',
      ['transactions.map', 'TransactionNotification', 'transactionsContainer']
    );
  }

  testApiServiceIntegration() {
    console.log('\n🔌 Testing API Service Integration...');
    
    this.testFileContent(
      'src/services/api.js',
      'API Service QRIS Methods',
      ['createQRISInvoice', 'checkQRISStatus', 'getQRISTransactions']
    );
  }

  testPackageDependencies() {
    console.log('\n📦 Testing Package Dependencies...');
    
    this.testFileExists('package.json', 'Package.json File');
    
    if (fs.existsSync('package.json')) {
      try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const hasExpo = packageJson.dependencies && packageJson.dependencies['expo'];
        const hasReactNative = packageJson.dependencies && packageJson.dependencies['react-native'];
        
        this.logTest(
          'React Native Dependencies',
          hasExpo && hasReactNative,
          hasExpo && hasReactNative ? 'Expo and React Native found' : 'Missing React Native dependencies'
        );
      } catch (error) {
        this.logTest('Package.json Parsing', false, error.message);
      }
    }
  }

  testProjectStructure() {
    console.log('\n📁 Testing Project Structure...');
    
    const requiredDirs = [
      'src',
      'src/components',
      'src/screens',
      'src/services',
      'backend',
      'backend/app',
      'backend/app/routers'
    ];

    requiredDirs.forEach(dir => {
      this.testFileExists(dir, `Directory: ${dir}`);
    });
  }

  runIntegrationTest() {
    console.log('🧪 Frontend Integration Test');
    console.log('=' .repeat(50));
    console.log('Testing QRIS transaction notification integration');
    console.log('=' .repeat(50));

    this.testProjectStructure();
    this.testComponentStructure();
    this.testChatroomScreenIntegration();
    this.testApiServiceIntegration();
    this.testPackageDependencies();

    // Print summary
    console.log('\n' + '=' .repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('=' .repeat(50));

    const passed = this.testResults.filter(result => result.status).length;
    const total = this.testResults.length;

    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${total - passed}/${total}`);

    if (passed === total) {
      console.log('\n🎉 All frontend integration tests passed!');
      console.log('\n🚀 Ready to test the complete flow:');
      console.log('1. Start the backend: cd backend && python main.py');
      console.log('2. Start the QRIS simulator: cd qris-simulator/QRIS-Simulator && node dist/index.js');
      console.log('3. Start the React Native app: npx expo start');
      console.log('4. Navigate to ChatroomScreen to see transaction notifications');
    } else {
      console.log('\n⚠️ Some integration tests failed.');
      console.log('Check the logs above and ensure all components are properly implemented.');
    }

    return passed === total;
  }
}

async function main() {
  const test = new FrontendIntegrationTest();
  const success = test.runIntegrationTest();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = FrontendIntegrationTest;
