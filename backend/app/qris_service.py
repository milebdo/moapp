import requests
import os
from typing import Dict, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class QRISService:
    def __init__(self):
        self.base_url = os.getenv("QRIS_API_BASE_URL", "https://qris.interactive.co.id/restapi/qris")
        self.timeout = 30

    async def create_invoice(self, merchant_id: str, api_key: str, amount: int, description: str = "") -> Dict:
        """
        Create a QRIS invoice using the QRIS API.
        
        Args:
            merchant_id: The merchant ID from QRIS provider
            api_key: The API key from QRIS provider
            amount: Transaction amount in Rupiah
            description: Optional transaction description
            
        Returns:
            Dict containing invoice_id and qr_code_url
        """
        try:
            # Use GET method for simulator, POST for production
            url = f"{self.base_url}/show_qris.php"
            
            params = {
                "do": "create-invoice",
                "apikey": api_key,
                "mID": merchant_id,
                "cliTrxNumber": f"INV{datetime.now().strftime('%Y%m%d%H%M%S')}",
                "cliTrxAmount": str(amount),
                "cliTrxDescription": description or "Payment via QRIS"
            }
            
            logger.info(f"Creating QRIS invoice for amount: {amount}")
            
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") == "success":
                return {
                    "invoice_id": data["data"]["qris_invoiceid"],
                    "qr_code_url": data["data"]["qris_qrcode"],
                    "amount": amount,
                    "status": "created"
                }
            else:
                error_msg = data.get("message", "Unknown error from QRIS API")
                logger.error(f"QRIS API error: {error_msg}")
                raise Exception(f"QRIS API Error: {error_msg}")
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error creating QRIS invoice: {str(e)}")
            raise Exception(f"Network error: {str(e)}")
        except Exception as e:
            logger.error(f"Error creating QRIS invoice: {str(e)}")
            raise Exception(f"Failed to create QRIS invoice: {str(e)}")

    async def check_payment_status(self, merchant_id: str, api_key: str, invoice_id: str, amount: int) -> Dict:
        """
        Check the payment status of a QRIS invoice.
        
        Args:
            merchant_id: The merchant ID from QRIS provider
            api_key: The API key from QRIS provider
            invoice_id: The invoice ID to check
            amount: The original transaction amount
            
        Returns:
            Dict containing payment status and details
        """
        try:
            url = f"{self.base_url}/checkpaid_qris.php"
            
            params = {
                "do": "checkStatus",
                "apikey": api_key,
                "mID": merchant_id,
                "invid": invoice_id,
                "trxvalue": str(amount),
                "trxdate": datetime.now().strftime("%Y-%m-%d")
            }
            
            logger.info(f"Checking QRIS payment status for invoice: {invoice_id}")
            
            response = requests.get(url, params=params, timeout=self.timeout)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get("status") == "success":
                qris_data = data.get("data", {})
                return {
                    "qris_status": qris_data.get("qris_status", "unknown"),
                    "qris_payment_customername": qris_data.get("qris_payment_customername"),
                    "qris_payment_methodby": qris_data.get("qris_payment_methodby")
                }
            else:
                # For failed status, return unpaid status
                return {
                    "qris_status": "unpaid",
                    "qris_payment_customername": None,
                    "qris_payment_methodby": None
                }
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error checking QRIS status: {str(e)}")
            raise Exception(f"Network error: {str(e)}")
        except Exception as e:
            logger.error(f"Error checking QRIS status: {str(e)}")
            raise Exception(f"Failed to check QRIS status: {str(e)}")

    async def test_connection(self, merchant_id: str, api_key: str) -> bool:
        """
        Test the connection to QRIS API with provided credentials.
        
        Args:
            merchant_id: The merchant ID from QRIS provider
            api_key: The API key from QRIS provider
            
        Returns:
            bool: True if connection is successful, False otherwise
        """
        try:
            # Try to create a test invoice with minimal amount
            test_amount = 1000  # 1000 Rupiah test amount
            test_description = "Connection Test"
            
            result = await self.create_invoice(merchant_id, api_key, test_amount, test_description)
            
            # If we get here, the connection is successful
            logger.info("QRIS connection test successful")
            return True
            
        except Exception as e:
            logger.error(f"QRIS connection test failed: {str(e)}")
            return False
