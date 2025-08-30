#!/usr/bin/env python3
"""
Find QRIS Simulator Credentials
This script helps you find the correct API key and merchant ID for your QRIS simulator.
"""

import requests
import json

def test_credentials(apikey, mID):
    """Test a specific API key and merchant ID combination"""
    url = "http://localhost:7000/restapi/qris/show_qris.php"
    params = {
        "do": "create-invoice",
        "apikey": apikey,
        "mID": mID,
        "cliTrxNumber": "TEST123",
        "cliTrxAmount": "1000",
        "cliTrxDescription": "Test"
    }
    
    try:
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "success":
                return True, data
            else:
                return False, data.get("data", {}).get("qris_status", "unknown")
        else:
            return False, f"HTTP {response.status_code}"
    except Exception as e:
        return False, str(e)

def main():
    """Main function to test various credential combinations"""
    
    print("🔍 QRIS Simulator Credential Finder")
    print("=" * 40)
    
    # Common credential combinations to test
    test_combinations = [
        ("test_api_key_123", "test_merchant_123"),
        ("apikey", "merchant"),
        ("123", "123"),
        ("test", "test"),
        ("demo", "demo"),
        ("qris", "qris"),
        ("simulator", "simulator"),
        ("dev", "dev"),
        ("api", "merchant"),
        ("key", "id"),
    ]
    
    print("Testing common credential combinations...")
    print()
    
    for apikey, mID in test_combinations:
        print(f"Testing: apikey='{apikey}', mID='{mID}'", end=" ")
        
        success, result = test_credentials(apikey, mID)
        
        if success:
            print("✅ SUCCESS!")
            print(f"🎉 Found working credentials:")
            print(f"   API Key: {apikey}")
            print(f"   Merchant ID: {mID}")
            print(f"   Response: {json.dumps(result, indent=2)}")
            return apikey, mID
        else:
            print(f"❌ Failed: {result}")
    
    print("\n❌ No common credentials worked.")
    print("\n💡 You need to find the correct credentials from your simulator configuration.")
    print("\n📋 How to find the credentials:")
    print("1. Check the simulator console output when it started")
    print("2. Look for a user_config.json file in the simulator directory")
    print("3. Restart the simulator and note the configuration")
    print("4. Check the simulator's documentation or setup instructions")
    
    return None, None

if __name__ == "__main__":
    main()
