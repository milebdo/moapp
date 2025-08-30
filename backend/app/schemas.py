from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Merchant Schemas
class MerchantBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    merchant_id: str = Field(..., min_length=1, max_length=255)
    api_key: str = Field(..., min_length=1)

class MerchantCreate(MerchantBase):
    pass

class MerchantUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    merchant_id: Optional[str] = Field(None, min_length=1, max_length=255)
    api_key: Optional[str] = Field(None, min_length=1)
    is_active: Optional[bool] = None

class MerchantResponse(BaseModel):
    id: int
    name: str
    merchant_id: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class MerchantListResponse(BaseModel):
    merchants: List[MerchantResponse]
    total: int

# QRIS Transaction Schemas
class QRISTransactionBase(BaseModel):
    merchant_id: int
    amount: int = Field(..., gt=0)
    description: Optional[str] = Field(None, max_length=500)

class QRISTransactionCreate(QRISTransactionBase):
    pass

class QRISTransactionResponse(BaseModel):
    id: int
    merchant_id: int
    invoice_id: str
    amount: int
    description: Optional[str]
    status: str
    qris_status: Optional[str]
    payment_method: Optional[str]
    customer_name: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class QRISTransactionListResponse(BaseModel):
    transactions: List[QRISTransactionResponse]
    total: int
    page: int
    limit: int

# QRIS API Response Schemas
class QRISInvoiceResponse(BaseModel):
    invoice_id: str
    qr_code_url: str
    amount: int
    status: str

class QRISStatusResponse(BaseModel):
    qris_status: str
    qris_payment_customername: Optional[str] = None
    qris_payment_methodby: Optional[str] = None

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Error Response Schema
class ErrorResponse(BaseModel):
    detail: str
