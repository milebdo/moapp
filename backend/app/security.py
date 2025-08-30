from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
import os
import base64

# Security configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# API Key encryption
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "your-encryption-key-change-in-production")
# Ensure the key is 32 bytes for Fernet
if len(ENCRYPTION_KEY) < 32:
    ENCRYPTION_KEY = ENCRYPTION_KEY.ljust(32, '0')
elif len(ENCRYPTION_KEY) > 32:
    ENCRYPTION_KEY = ENCRYPTION_KEY[:32]

# Convert to base64 for Fernet
fernet_key = base64.urlsafe_b64encode(ENCRYPTION_KEY.encode())
cipher_suite = Fernet(fernet_key)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def encrypt_api_key(api_key: str) -> str:
    """Encrypt an API key for storage."""
    return cipher_suite.encrypt(api_key.encode()).decode()

def decrypt_api_key(encrypted_api_key: str) -> str:
    """Decrypt an API key for use."""
    return cipher_suite.decrypt(encrypted_api_key.encode()).decode()
