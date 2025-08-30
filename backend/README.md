# MonaApp QRIS Backend

FastAPI backend for MonaApp QRIS payment integration with PostgreSQL database.

## Features

- **Merchant Management**: CRUD operations for QRIS merchants
- **QRIS Integration**: Create invoices and check payment status
- **Secure Storage**: Encrypted API key storage
- **Transaction Tracking**: Complete transaction history
- **RESTful API**: Clean, documented API endpoints
- **Docker Support**: Easy deployment with Docker Compose

## Tech Stack

- **FastAPI**: Modern, fast web framework
- **PostgreSQL**: Reliable database
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation and serialization
- **Docker**: Containerization
- **Alembic**: Database migrations

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)

### Using Docker (Recommended)

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Start the services**:
   ```bash
   docker-compose up -d
   ```

3. **Access the API**:
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

### Local Development

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start PostgreSQL** (using Docker):
   ```bash
   docker run -d \
     --name monaapp_postgres \
     -e POSTGRES_DB=monaapp \
     -e POSTGRES_USER=monaapp_user \
     -e POSTGRES_PASSWORD=monaapp_password \
     -p 5432:5432 \
     postgres:15
   ```

4. **Run the application**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## API Endpoints

### Merchants

- `POST /api/merchants/` - Create new merchant
- `GET /api/merchants/` - List all merchants
- `GET /api/merchants/{id}` - Get specific merchant
- `PUT /api/merchants/{id}` - Update merchant
- `DELETE /api/merchants/{id}` - Delete merchant
- `POST /api/merchants/{id}/test-connection` - Test QRIS connection

### QRIS Operations

- `POST /api/qris/create-invoice` - Create QRIS invoice
- `GET /api/qris/check-status/{invoice_id}` - Check payment status
- `GET /api/qris/transactions` - Get transaction history
- `GET /api/qris/transactions/{id}` - Get specific transaction

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://monaapp_user:monaapp_password@localhost:5432/monaapp` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-change-in-production` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiry | `30` |
| `QRIS_API_BASE_URL` | QRIS provider API URL | `https://qris.interactive.co.id/restapi/qris` |

## Database Schema

### Merchants Table
```sql
CREATE TABLE merchants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    merchant_id VARCHAR(255) UNIQUE NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### QRIS Transactions Table
```sql
CREATE TABLE qris_transactions (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER REFERENCES merchants(id),
    invoice_id VARCHAR(255) UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    description VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending',
    qris_status VARCHAR(50),
    payment_method VARCHAR(100),
    customer_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

- **API Key Encryption**: All API keys are encrypted at rest using Fernet
- **Input Validation**: Pydantic models ensure data integrity
- **Error Handling**: Comprehensive error handling without exposing sensitive data
- **CORS Configuration**: Proper CORS setup for frontend integration

## Development

### Running Tests
```bash
# Add tests when implemented
pytest
```

### Database Migrations
```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head
```

### Code Formatting
```bash
# Install black
pip install black

# Format code
black .
```

## Production Deployment

1. **Update environment variables** for production
2. **Use proper secrets management**
3. **Set up SSL/TLS certificates**
4. **Configure proper logging**
5. **Set up monitoring and health checks**

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in environment variables
   - Verify network connectivity

2. **QRIS API Errors**:
   - Verify merchant credentials
   - Check QRIS API endpoint availability
   - Review API rate limits

3. **CORS Issues**:
   - Update ALLOWED_ORIGINS in environment
   - Check frontend URL configuration

## License

This project is licensed under the MIT License.
