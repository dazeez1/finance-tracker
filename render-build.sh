#!/bin/bash

echo "🚀 Starting Render build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Ensure public directory exists
echo "📁 Ensuring public directory structure..."
mkdir -p public/js

# Copy frontend files if they don't exist
if [ ! -f "public/index.html" ]; then
    echo "⚠️  Frontend files not found, creating placeholder..."
    echo "<!DOCTYPE html><html><body><h1>Finance Tracker</h1><p>Frontend files not found. Please check the build process.</p></body></html>" > public/index.html
fi

# Verify public directory contents
echo "🔍 Checking public directory contents..."
ls -la public/ || echo "❌ Public directory not accessible"

# Run build check
echo "✅ Build process completed!"
npm run deploy:check

echo "🎉 Render build script completed successfully!"
