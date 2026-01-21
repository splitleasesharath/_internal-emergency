@echo off
echo 🚀 Setting up Internal Emergency Management Dashboard...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
echo.

echo 📦 Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo 🔧 Setting up Backend Environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file
    echo.
    echo ⚠️  IMPORTANT: Please edit backend\.env and configure:
    echo    - DATABASE_URL (PostgreSQL connection string)
    echo    - JWT_SECRET (a random secret key)
    echo    - TWILIO credentials (for SMS)
    echo    - SLACK credentials (for notifications)
    echo    - SMTP credentials (for email)
    echo.
    echo    For testing, you can use SQLite by setting:
    echo    DATABASE_URL="file:./dev.db"
    echo.
) else (
    echo ✅ .env file already exists
)

echo.
echo 🗄️  Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo 📊 Running Database Migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ⚠️  Migration failed. Make sure your database is running and DATABASE_URL is correct.
)

echo.
echo 🌱 Seeding Database with Sample Data...
call npm run prisma:seed
if %errorlevel% neq 0 (
    echo ⚠️  Seeding failed. You can seed later with: npm run prisma:seed
)

echo.
echo 📦 Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo 🔧 Setting up Frontend Environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created frontend .env file
) else (
    echo ✅ Frontend .env file already exists
)

cd ..

echo.
echo 🎉 Setup Complete!
echo.
echo To start the application, open TWO command prompts:
echo.
echo   Command Prompt 1 (Backend):
echo     cd backend
echo     npm run dev
echo.
echo   Command Prompt 2 (Frontend):
echo     cd frontend
echo     npm start
echo.
echo The app will open at http://localhost:3000
echo.
echo ⚠️  Note: You'll need a JWT token to access the dashboard.
echo    See QUICKSTART.md for instructions on generating a test token.
echo.
pause
