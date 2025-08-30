from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from . import models, schemas
from .security import encrypt_api_key, decrypt_api_key

# Merchant CRUD operations
def create_merchant(db: Session, merchant: schemas.MerchantCreate) -> models.Merchant:
    """Create a new merchant."""
    # Encrypt the API key before storing
    encrypted_api_key = encrypt_api_key(merchant.api_key)
    
    db_merchant = models.Merchant(
        name=merchant.name,
        merchant_id=merchant.merchant_id,
        api_key_encrypted=encrypted_api_key,
        is_active=True
    )
    db.add(db_merchant)
    db.commit()
    db.refresh(db_merchant)
    return db_merchant

def get_merchant(db: Session, merchant_id: int) -> Optional[models.Merchant]:
    """Get a merchant by ID."""
    return db.query(models.Merchant).filter(models.Merchant.id == merchant_id).first()

def get_merchant_by_merchant_id(db: Session, merchant_id: str) -> Optional[models.Merchant]:
    """Get a merchant by merchant_id."""
    return db.query(models.Merchant).filter(models.Merchant.merchant_id == merchant_id).first()

def get_merchants(db: Session, skip: int = 0, limit: int = 100) -> List[models.Merchant]:
    """Get all merchants with pagination."""
    return db.query(models.Merchant).offset(skip).limit(limit).all()

def update_merchant(db: Session, merchant_id: int, merchant_update: schemas.MerchantUpdate) -> Optional[models.Merchant]:
    """Update a merchant."""
    db_merchant = get_merchant(db, merchant_id)
    if not db_merchant:
        return None
    
    update_data = merchant_update.dict(exclude_unset=True)
    
    # Encrypt API key if it's being updated
    if "api_key" in update_data:
        update_data["api_key_encrypted"] = encrypt_api_key(update_data.pop("api_key"))
    
    for field, value in update_data.items():
        setattr(db_merchant, field, value)
    
    db.commit()
    db.refresh(db_merchant)
    return db_merchant

def delete_merchant(db: Session, merchant_id: int) -> bool:
    """Delete a merchant."""
    db_merchant = get_merchant(db, merchant_id)
    if not db_merchant:
        return False
    
    db.delete(db_merchant)
    db.commit()
    return True

def get_merchant_decrypted_api_key(db: Session, merchant_id: int) -> Optional[str]:
    """Get the decrypted API key for a merchant."""
    db_merchant = get_merchant(db, merchant_id)
    if not db_merchant:
        return None
    
    return decrypt_api_key(db_merchant.api_key_encrypted)

# QRIS Transaction CRUD operations
def create_qris_transaction(db: Session, transaction: schemas.QRISTransactionCreate, invoice_id: str) -> models.QRISTransaction:
    """Create a new QRIS transaction."""
    db_transaction = models.QRISTransaction(
        merchant_id=transaction.merchant_id,
        invoice_id=invoice_id,
        amount=transaction.amount,
        description=transaction.description,
        status="pending"
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_qris_transaction(db: Session, transaction_id: int) -> Optional[models.QRISTransaction]:
    """Get a QRIS transaction by ID."""
    return db.query(models.QRISTransaction).filter(models.QRISTransaction.id == transaction_id).first()

def get_qris_transaction_by_invoice_id(db: Session, invoice_id: str) -> Optional[models.QRISTransaction]:
    """Get a QRIS transaction by invoice ID."""
    return db.query(models.QRISTransaction).filter(models.QRISTransaction.invoice_id == invoice_id).first()

def get_qris_transactions_by_merchant(
    db: Session, 
    merchant_id: int, 
    skip: int = 0, 
    limit: int = 20
) -> List[models.QRISTransaction]:
    """Get QRIS transactions for a specific merchant with pagination."""
    return db.query(models.QRISTransaction)\
        .filter(models.QRISTransaction.merchant_id == merchant_id)\
        .order_by(desc(models.QRISTransaction.created_at))\
        .offset(skip)\
        .limit(limit)\
        .all()

def update_qris_transaction_status(
    db: Session, 
    transaction_id: int, 
    qris_status: str,
    payment_method: Optional[str] = None,
    customer_name: Optional[str] = None
) -> Optional[models.QRISTransaction]:
    """Update QRIS transaction status."""
    db_transaction = get_qris_transaction(db, transaction_id)
    if not db_transaction:
        return None
    
    db_transaction.qris_status = qris_status
    db_transaction.status = "paid" if qris_status == "paid" else "pending"
    
    if payment_method:
        db_transaction.payment_method = payment_method
    if customer_name:
        db_transaction.customer_name = customer_name
    
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions_count_by_merchant(db: Session, merchant_id: int) -> int:
    """Get total count of transactions for a merchant."""
    return db.query(models.QRISTransaction)\
        .filter(models.QRISTransaction.merchant_id == merchant_id)\
        .count()
