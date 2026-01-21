#!/bin/bash

echo "🚀 Setting up Internal Emergency Management Dashboard..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. You'll need to install PostgreSQL 14+ or use a remote database."
    echo "   For now, we'll set up a SQLite database for testing."
    USE_SQLITE=true
else
    echo "✅ PostgreSQL found: $(psql --version)"
    USE_SQLITE=false
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install

echo ""
echo "🔧 Setting up Backend Environment..."
if [ ! -f .env ]; then
    cp .env.example .env

    # Generate a random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)

    if [ "$USE_SQLITE" = true ]; then
        # Use SQLite for easy testing
        sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"file:./dev.db\"|g" .env
        echo "📝 Using SQLite database for testing"
    fi

    sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=\"$JWT_SECRET\"|g" .env

    # Set development-friendly values
    sed -i.bak "s|NODE_ENV=.*|NODE_ENV=development|g" .env
    sed -i.bak "s|CORS_ORIGIN=.*|CORS_ORIGIN=http://localhost:3000|g" .env

    echo "✅ Created .env file with default values"
    echo ""
    echo "⚠️  IMPORTANT: You need to configure these services in backend/.env:"
    echo "   - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER"
    echo "   - SLACK_WEBHOOK_URL, SLACK_BOT_TOKEN, SLACK_DYNAMIC_TASKS_CHANNEL"
    echo "   - SMTP credentials for email"
    echo ""
    echo "   For now, the app will work but SMS/Email/Slack features will be disabled."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🗄️  Setting up Database..."
npx prisma generate
npx prisma migrate dev --name init

echo ""
echo "🌱 Seeding Database with Sample Data..."
npm run prisma:seed

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

echo ""
echo "🔧 Setting up Frontend Environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend .env file"
else
    echo "✅ Frontend .env file already exists"
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "To start the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
echo "    npm run dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend"
echo "    npm start"
echo ""
echo "The app will open at http://localhost:3000"
echo ""
echo "⚠️  Note: You'll need a JWT token to access the dashboard."
echo "   See QUICKSTART.md for instructions on generating a test token."
