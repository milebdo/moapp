from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    merchant_id = Column(String(255), unique=True, nullable=False, index=True)
    api_key_encrypted = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship
    transactions = relationship("QRISTransaction", back_populates="merchant")

class QRISTransaction(Base):
    __tablename__ = "qris_transactions"

    id = Column(Integer, primary_key=True, index=True)
    merchant_id = Column(Integer, ForeignKey("merchants.id"), nullable=False)
    invoice_id = Column(String(255), unique=True, nullable=False, index=True)
    amount = Column(Integer, nullable=False)
    description = Column(String(500))
    status = Column(String(50), default="pending")
    qris_status = Column(String(50))
    payment_method = Column(String(100))
    customer_name = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship
    merchant = relationship("Merchant", back_populates="transactions")
