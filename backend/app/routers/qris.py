from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..qris_service import QRISService

router = APIRouter(prefix="/api/qris", tags=["qris"])

@router.post("/create-invoice", response_model=schemas.QRISInvoiceResponse)
def create_qris_invoice(
    transaction: schemas.QRISTransactionCreate,
    db: Session = Depends(get_db)
):
    """Create a QRIS invoice for payment."""
    # Get merchant and decrypt API key
    db_merchant = crud.get_merchant(db, merchant_id=transaction.merchant_id)
    if not db_merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant not found"
        )
    
    if not db_merchant.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Merchant is not active"
        )
    
    api_key = crud.get_merchant_decrypted_api_key(db, transaction.merchant_id)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key"
        )
    
    # Create QRIS invoice using QRIS service
    qris_service = QRISService()
    
    try:
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            qris_result = loop.run_until_complete(
                qris_service.create_invoice(
                    db_merchant.merchant_id,
                    api_key,
                    transaction.amount,
                    transaction.description or ""
                )
            )
        finally:
            loop.close()
        
        # Create transaction record in database
        db_transaction = crud.create_qris_transaction(
            db=db,
            transaction=transaction,
            invoice_id=qris_result["invoice_id"]
        )
        
        return {
            "invoice_id": qris_result["invoice_id"],
            "qr_code_url": qris_result["qr_code_url"],
            "amount": transaction.amount,
            "status": "created"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create QRIS invoice: {str(e)}"
        )

@router.get("/check-status/{invoice_id}", response_model=schemas.QRISStatusResponse)
def check_qris_status(invoice_id: str, db: Session = Depends(get_db)):
    """Check the payment status of a QRIS invoice."""
    # Get transaction from database
    db_transaction = crud.get_qris_transaction_by_invoice_id(db, invoice_id)
    if not db_transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Get merchant and decrypt API key
    db_merchant = crud.get_merchant(db, merchant_id=db_transaction.merchant_id)
    if not db_merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant not found"
        )
    
    api_key = crud.get_merchant_decrypted_api_key(db, db_transaction.merchant_id)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key"
        )
    
    # Check status using QRIS service
    qris_service = QRISService()
    
    try:
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            qris_result = loop.run_until_complete(
                qris_service.check_payment_status(
                    db_merchant.merchant_id,
                    api_key,
                    invoice_id,
                    db_transaction.amount
                )
            )
        finally:
            loop.close()
        
        # Update transaction status in database
        crud.update_qris_transaction_status(
            db=db,
            transaction_id=db_transaction.id,
            qris_status=qris_result["qris_status"],
            payment_method=qris_result.get("qris_payment_methodby"),
            customer_name=qris_result.get("qris_payment_customername")
        )
        
        return qris_result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to check QRIS status: {str(e)}"
        )

@router.get("/transactions", response_model=schemas.QRISTransactionListResponse)
def get_qris_transactions(
    merchant_id: int,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """Get QRIS transactions for a specific merchant with pagination."""
    skip = (page - 1) * limit
    
    transactions = crud.get_qris_transactions_by_merchant(
        db, 
        merchant_id=merchant_id, 
        skip=skip, 
        limit=limit
    )
    
    total = crud.get_transactions_count_by_merchant(db, merchant_id)
    
    return {
        "transactions": transactions,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.get("/transactions/{transaction_id}", response_model=schemas.QRISTransactionResponse)
def get_qris_transaction(transaction_id: int, db: Session = Depends(get_db)):
    """Get a specific QRIS transaction by ID."""
    db_transaction = crud.get_qris_transaction(db, transaction_id=transaction_id)
    if db_transaction is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    return db_transaction
