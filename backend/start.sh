#!/bin/bash

# MonaApp QRIS Backend Startup Script

echo "🚀 Starting MonaApp QRIS Backend..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "📋 Service URLs:"
    echo "   API: http://localhost:8000"
    echo "   Documentation: http://localhost:8000/docs"
    echo "   Health Check: http://localhost:8000/health"
    echo ""
    echo "📊 Container Status:"
    docker-compose ps
else
    echo "❌ Services failed to start. Check logs with:"
    echo "   docker-compose logs"
    exit 1
fi
