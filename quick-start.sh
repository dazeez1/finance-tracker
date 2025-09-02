#!/bin/bash

echo "🚀 Finance Tracker - Quick Start Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "🔧 Creating .env file from example..."
    if [ -f env.example ]; then
        cp env.example .env
        echo "⚠️  Please edit .env file with your configuration before starting the app."
    else
        echo "⚠️  Please create a .env file with your configuration."
    fi
else
    echo "✅ .env file already exists"
fi

# Check if MongoDB is running
echo "🗄️  Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    if mongosh --eval "db.runCommand('ping')" --quiet &> /dev/null; then
        echo "✅ MongoDB is running"
    else
        echo "⚠️  MongoDB is not running. Please start MongoDB service."
    fi
else
    echo "⚠️  MongoDB client not found. Please ensure MongoDB is installed and running."
fi

# Check frontend files
echo "🔍 Checking frontend files..."
npm run deploy:check

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Start MongoDB service"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "For more information, see README.md and DEPLOYMENT_GUIDE.md"
