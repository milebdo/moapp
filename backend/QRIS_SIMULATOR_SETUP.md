# QRIS Simulator Setup Guide

This guide will help you set up the QRIS simulator for development and testing purposes.

## 🎯 Overview

The QRIS simulator allows you to test QRIS payment integration without using real money or the production QRIS API. It runs locally on port 7000 and simulates the behavior of the official QRIS payment gateway.

## 📋 Prerequisites

- Node.js and npm installed
- Git installed
- Python 3.8+ (for the backend)

## 🚀 Setup Steps

### 1. Clone the QRIS Simulator

```bash
# Navigate to a directory where you want to install the simulator
cd ~/projects  # or any directory you prefer

# Clone the QRIS simulator repository
git clone https://github.com/wowotek/qris_simulator.git

# Navigate to the simulator directory
cd qris_simulator
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

### 3. Configure the Simulator

When you first run the simulator, it will ask you several questions:

```bash
npm start
```

**Answer the questions as follows:**

- **APIKEY**: `test_api_key_123` (or any test key you prefer)
- **mID**: `test_merchant_123` (or any test merchant ID you prefer)
- **PORT**: `7000` (default)
- **HOSTNAME**: `localhost` (default)

### 4. Alternative: Manual Configuration

Instead of answering questions, you can create a `user_config.json` file:

```json
{
  "apikey": "test_api_key_123",
  "mID": "test_merchant_123",
  "port": 7000,
  "hostname": "localhost"
}
```

### 5. Start the Simulator

```bash
npm start
```

You should see output like:
```
QRIS Simulator is running on http://localhost:7000
```

## 🔧 Backend Configuration

The backend is already configured to use the QRIS simulator. The configuration is in:

- **File**: `backend/.env`
- **Setting**: `QRIS_API_BASE_URL=http://localhost:7000/restapi/qris`

## 🧪 Testing the Integration

### 1. Test the Simulator Connection

```bash
# Navigate to the backend directory
cd backend

# Run the test script
python test_qris_simulator.py
```

### 2. Test from the React Native App

1. **Start the backend**:
   ```bash
   cd backend
   ./start.sh
   ```

2. **Start the React Native app**:
   ```bash
   # In another terminal
   npm start
   ```

3. **Test QRIS transactions**:
   - Go to the QRIS transaction screen
   - Create a test invoice
   - Scan the QR code
   - Complete the mock payment

## 📱 Using the Simulator

### Creating an Invoice

1. **API Endpoint**: `GET http://localhost:7000/restapi/qris/show_qris.php`
2. **Parameters**:
   - `do`: `create-invoice`
   - `apikey`: Your test API key
   - `mID`: Your test merchant ID
   - `cliTrxNumber`: Unique invoice number
   - `cliTrxAmount`: Amount in Rupiah
   - `cliTrxDescription`: Payment description

### Checking Payment Status

1. **API Endpoint**: `GET http://localhost:7000/restapi/qris/checkpaid_qris.php`
2. **Parameters**:
   - `do`: `checkStatus`
   - `apikey`: Your test API key
   - `mID`: Your test merchant ID
   - `invid`: Invoice ID from creation
   - `trxvalue`: Original amount
   - `trxdate`: Transaction date (YYYY-MM-DD)

### Mock Payment Process

1. **Create Invoice**: Use the API to create an invoice
2. **Scan QR Code**: The simulator will display a QR code in the console
3. **Complete Payment**: Follow the simulator's prompts to complete the payment
4. **Check Status**: Use the API to check if payment was successful

## 🔄 Switching Between Simulator and Production

### For Development (Simulator)
```bash
# In backend/.env
QRIS_API_BASE_URL=http://localhost:7000/restapi/qris
```

### For Production (Real QRIS API)
```bash
# In backend/.env
QRIS_API_BASE_URL=https://qris.interactive.co.id/restapi/qris
```

## 🐛 Troubleshooting

### Simulator Not Starting
- Check if port 7000 is available
- Make sure Node.js and npm are installed
- Check the console for error messages

### Connection Issues
- Verify the simulator is running on `http://localhost:7000`
- Check if the backend can reach the simulator
- Ensure firewall isn't blocking the connection

### API Errors
- Verify the API key and merchant ID match your simulator configuration
- Check the simulator console for error messages
- Ensure all required parameters are provided

## 📚 Additional Resources

- [QRIS Simulator Repository](https://github.com/wowotek/qris_simulator)
- [Official QRIS API Documentation](https://qris.id/api-doc/index.php)
- [Backend API Documentation](backend/README.md)

## 🎉 Success!

Once everything is set up, you can:
- ✅ Create QRIS invoices without real money
- ✅ Test payment flows safely
- ✅ Debug integration issues
- ✅ Develop and test your application

The simulator provides a safe environment for testing QRIS integration before going live with real payments.
