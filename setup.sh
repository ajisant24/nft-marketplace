#!/bin/bash

echo "🚀 Setting up NFT Marketplace..."

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit .env file with your credentials"
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your wallet private key and RPC URL"
echo "2. Run 'npm run deploy:testnet' to deploy contracts"
echo "3. Run 'npm start' to start the app"