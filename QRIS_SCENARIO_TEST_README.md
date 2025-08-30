# QRIS Payment Scenario Test

This document explains how to run the complete QRIS payment flow scenario test, which validates the entire payment process from QRIS simulator to frontend notification.

## 🎯 Test Scenario Overview

The scenario test validates the complete QRIS payment flow:

1. **QRIS Simulator** → Creates payment invoice
2. **Backend API** → Receives and processes payment data
3. **Frontend** → Displays transaction notification in chatroom

## 📁 Test Files

- `backend/test_qris_scenario.py` - Backend integration test
- `test_qris_end_to_end.js` - Complete end-to-end test
- `src/components/TransactionNotification.js` - Frontend notification component
- `src/screens/ChatroomScreen.js` - Updated with transaction notifications

## 🚀 Prerequisites

Before running the tests, ensure you have:

1. **Backend Server Running**
   ```bash
   cd backend
   python main.py
   ```

2. **QRIS Simulator Running**
   ```bash
   cd qris-simulator/QRIS-Simulator
   node dist/index.js
   ```

3. **Dependencies Installed**
   ```bash
   # Backend dependencies
   cd backend
   pip install -r requirements.txt

   # Frontend dependencies
   npm install
   ```

## 🧪 Running the Tests

### Option 1: Backend Integration Test (Python)

```bash
cd backend
python test_qris_scenario.py
```

This test focuses on:
- ✅ Backend API health check
- ✅ Merchant creation and connection
- ✅ QRIS invoice creation
- ✅ Payment status checking
- ✅ Transaction retrieval
- ✅ Simulator integration

### Option 2: Complete End-to-End Test (Node.js)

```bash
# Install axios if not already installed
npm install axios

# Run the complete test
node test_qris_end_to_end.js
```

This test includes everything from Option 1 plus:
- ✅ Frontend API endpoint validation
- ✅ Component file existence checks
- ✅ ChatroomScreen integration verification

## 📱 Frontend Integration

### TransactionNotification Component

The `TransactionNotification` component displays QRIS payment notifications with:

- **Status Indicators**: Success (green), Pending (orange), Failed (red)
- **Payment Details**: Amount, description, invoice ID, date
- **Customer Information**: Payment method, customer name
- **Actions**: Refresh status for pending payments, dismiss notifications

### ChatroomScreen Updates

The ChatroomScreen has been enhanced with:

- **Real-time Transaction Loading**: Fetches transactions every 30 seconds
- **Transaction Notifications**: Displays payment notifications as chat bubbles
- **Interactive Features**: Tap to view details, dismiss notifications
- **Status Updates**: Refresh payment status for pending transactions

## 🔧 Test Configuration

### Backend Test Configuration

The backend test uses these default values:
- **Test Merchant ID**: `SCENARIO123`
- **Test API Key**: `scenario_test_key_456`
- **Test Amount**: `75000` IDR
- **Backend URL**: `http://localhost:8000`

### Simulator Test Configuration

The simulator test uses:
- **Simulator URL**: `http://localhost:3001`
- **Merchant ID**: `E2E123`
- **API Key**: `e2e_test_key_789`
- **Test Amount**: `100000` IDR

## 📊 Expected Test Results

### Successful Test Run

```
🧪 QRIS Payment Scenario Test
==================================================
Testing complete flow: Simulator → Backend → Frontend
==================================================

🚀 Starting Backend Server...
✅ Backend server is already running
🎮 Starting QRIS Simulator...
✅ QRIS simulator is already running

[14:30:15] ✅ Backend Health Check: Status: 200
[14:30:16] ✅ Create Test Merchant: Merchant ID: 1
[14:30:17] ✅ Test Merchant Connection: Status: 200
[14:30:18] ✅ Create QRIS Invoice: Invoice ID: INV123, Amount: 75000
[14:30:19] ✅ Check Payment Status: Status: 200
[14:30:20] ✅ Get Transactions: Found 1 transactions
[14:30:21] ✅ Simulator Payment Creation: Invoice ID: INV456
[14:30:22] ✅ Frontend API - Get Merchants: Status: 200
[14:30:23] ✅ Frontend API - Get QRIS Transactions: Status: 200
[14:30:24] ✅ TransactionNotification Component: Component file exists
[14:30:25] ✅ ChatroomScreen Integration: Import: true, State: true, Rendering: true

==================================================
📊 TEST SUMMARY
==================================================
✅ Passed: 11/11
❌ Failed: 0/11

🎉 All tests passed! QRIS payment flow is working correctly.

🚀 Ready for frontend integration!
Next steps:
1. Update ChatroomScreen.js to display transaction notifications
2. Create TransactionNotification component
3. Test the complete user experience
```

### Failed Test Run

If tests fail, you'll see detailed error messages and troubleshooting steps:

```
⚠️ Some tests failed. Check the logs above for details.

🔧 Troubleshooting:
- Ensure backend is running: cd backend && python main.py
- Ensure QRIS simulator is running: cd qris-simulator/QRIS-Simulator && node dist/index.js
- Check API endpoints and database connection
```

## 🎨 Frontend Testing

After running the backend tests, test the frontend:

1. **Start React Native App**
   ```bash
   npx expo start
   ```

2. **Navigate to ChatroomScreen**
   - Open the app on your device/simulator
   - Navigate to the ChatroomScreen
   - You should see transaction notifications if any exist

3. **Test Transaction Notifications**
   - Create a QRIS payment through the simulator
   - Check if the notification appears in the chatroom
   - Test the interactive features (tap, dismiss, refresh)

## 🔍 Troubleshooting

### Common Issues

1. **Backend Not Running**
   ```
   ❌ Cannot connect to backend: ECONNREFUSED
   ```
   **Solution**: Start the backend server with `cd backend && python main.py`

2. **Simulator Not Running**
   ```
   ❌ Cannot connect to simulator: ECONNREFUSED
   ```
   **Solution**: Start the simulator with `cd qris-simulator/QRIS-Simulator && node dist/index.js`

3. **Database Connection Issues**
   ```
   ❌ Failed to create merchant: database error
   ```
   **Solution**: Check database configuration in `backend/app/database.py`

4. **Frontend Component Issues**
   ```
   ❌ TransactionNotification Component: Component file not found
   ```
   **Solution**: Ensure the component file exists at `src/components/TransactionNotification.js`

### Debug Mode

To run tests with more detailed logging:

```bash
# Python test with debug
cd backend
python -u test_qris_scenario.py

# Node.js test with debug
DEBUG=* node test_qris_end_to_end.js
```

## 📈 Performance Considerations

- **Polling Interval**: Frontend polls for new transactions every 30 seconds
- **API Timeouts**: Tests use 10-second timeouts for API calls
- **Database Queries**: Transactions are limited to 10 per page
- **Memory Usage**: Test data is cleaned up after each test run

## 🔄 Continuous Integration

To integrate these tests into CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Run QRIS Scenario Tests
  run: |
    cd backend
    python test_qris_scenario.py
    cd ..
    node test_qris_end_to_end.js
```

## 📝 Test Data Cleanup

The tests create temporary data that should be cleaned up:

```bash
# Clean up test merchants (optional)
curl -X DELETE http://localhost:8000/api/merchants/{merchant_id}
```

## 🎯 Next Steps

After successful test runs:

1. **Deploy to Production**: Ensure all services are properly configured
2. **Monitor Performance**: Set up monitoring for API response times
3. **User Testing**: Conduct real user testing with the complete flow
4. **Documentation**: Update user documentation with new features

---

For questions or issues, please refer to the main project documentation or create an issue in the repository.
