from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
from ..qris_service import QRISService

router = APIRouter(prefix="/api/merchants", tags=["merchants"])

@router.post("/", response_model=schemas.MerchantResponse)
def create_merchant(merchant: schemas.MerchantCreate, db: Session = Depends(get_db)):
    """Create a new QRIS merchant."""
    # Check if merchant_id already exists
    db_merchant = crud.get_merchant_by_merchant_id(db, merchant.merchant_id)
    if db_merchant:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Merchant ID already exists"
        )
    
    return crud.create_merchant(db=db, merchant=merchant)

@router.get("/", response_model=schemas.MerchantListResponse)
def get_merchants(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all merchants with pagination."""
    merchants = crud.get_merchants(db, skip=skip, limit=limit)
    total = len(merchants)  # In a real app, you'd want a separate count query
    
    return {
        "merchants": merchants,
        "total": total
    }

@router.get("/{merchant_id}", response_model=schemas.MerchantResponse)
def get_merchant(merchant_id: int, db: Session = Depends(get_db)):
    """Get a specific merchant by ID."""
    db_merchant = crud.get_merchant(db, merchant_id=merchant_id)
    if db_merchant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant not found"
        )
    return db_merchant

@router.put("/{merchant_id}", response_model=schemas.MerchantResponse)
def update_merchant(
    merchant_id: int, 
    merchant_update: schemas.MerchantUpdate, 
    db: Session = Depends(get_db)
):
    """Update a merchant."""
    db_merchant = crud.update_merchant(db, merchant_id=merchant_id, merchant_update=merchant_update)
    if db_merchant is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant not found"
        )
    return db_merchant

@router.delete("/{merchant_id}")
def delete_merchant(merchant_id: int, db: Session = Depends(get_db)):
    """Delete a merchant."""
    success = crud.delete_merchant(db, merchant_id=merchant_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant not found"
        )
    return {"message": "Merchant deleted successfully"}

@router.post("/{merchant_id}/test-connection")
def test_merchant_connection(merchant_id: int, db: Session = Depends(get_db)):
    """Test the connection to QRIS API for a specific merchant."""
    # Get merchant and decrypt API key
    db_merchant = crud.get_merchant(db, merchant_id=merchant_id)
    if not db_merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Merchant not found"
        )
    
    api_key = crud.get_merchant_decrypted_api_key(db, merchant_id)
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid API key"
        )
    
    # Test connection using QRIS service
    qris_service = QRISService()
    
    try:
        # This would be async in a real implementation
        # For now, we'll simulate the test
        import asyncio
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            result = loop.run_until_complete(
                qris_service.test_connection(
                    db_merchant.merchant_id, 
                    api_key
                )
            )
        finally:
            loop.close()
        
        if result:
            return {"message": "Connection successful", "status": "success"}
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Connection failed"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Connection test failed: {str(e)}"
        )
