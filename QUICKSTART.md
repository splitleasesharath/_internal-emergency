# Quick Start Guide

This guide will get you up and running with the Internal Emergency Management Dashboard in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

## Step 1: Clone the Repository

```bash
git clone https://github.com/splitleasesharath/_internal-emergency.git
cd _internal-emergency
```

## Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings (minimum required for local dev):
# DATABASE_URL="postgresql://user:password@localhost:5432/emergency_db"
# JWT_SECRET="your_secret_key"
# TWILIO_ACCOUNT_SID="your_twilio_sid"
# TWILIO_AUTH_TOKEN="your_twilio_token"
# TWILIO_PHONE_NUMBER="+1234567890"
```

## Step 3: Setup Database

```bash
# Create the database (from psql or your database tool)
createdb emergency_db

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed with sample data
npm run prisma:seed
```

You should see:
```
✅ Database seeded successfully!
📊 Created:
  - 5 users (1 admin, 2 staff, 1 guest, 1 host)
  - 1 listing
  - 1 reservation
  - 1 emergency report
  - 5 preset messages
  - 3 preset emails
```

## Step 4: Start Backend Server

```bash
npm run dev
```

Server should start on `http://localhost:3001`

Test it: `curl http://localhost:3001/health`

## Step 5: Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# The default settings should work for local development
# REACT_APP_API_URL=http://localhost:3001/api
```

## Step 6: Start Frontend

```bash
npm start
```

The app will open at `http://localhost:3000`

## Step 7: Get a Test JWT Token

For development, you can create a JWT token:

1. Use an online JWT generator (like jwt.io)
2. Payload:
```json
{
  "userId": "uuid-of-staff-user",
  "email": "staff1@splitlease.com",
  "role": "STAFF",
  "iat": 1705315200,
  "exp": 1799923200
}
```
3. Use your JWT_SECRET from .env
4. Add the token to `frontend/.env`:
```
REACT_APP_AUTH_TOKEN=your_jwt_token
```

Or add it to localStorage in browser console:
```javascript
localStorage.setItem('authToken', 'your_jwt_token')
```

## Step 8: Test the Application

1. Open `http://localhost:3000`
2. You should see the Emergencies Dashboard
3. Click on the sample emergency in the list
4. Try assigning it to a team member
5. Test sending an SMS or email

## Sample Data

The seed script creates:

**Admin User:**
- Email: admin@splitlease.com
- Role: ADMIN

**Staff Users:**
- Email: staff1@splitlease.com (John Smith)
- Email: staff2@splitlease.com (Jane Doe)
- Role: STAFF

**Guest:**
- Email: guest@example.com (Alice Johnson)
- Phone: +1234567893

**Sample Emergency:**
- Type: Plumbing Issue
- Agreement: AGR-2024-001
- Status: REPORTED

## Common Issues

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
# Format: postgresql://username:password@localhost:5432/database_name
```

### Port Already in Use
```bash
# Backend (port 3001)
lsof -ti:3001 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Prisma Client Not Generated
```bash
cd backend
npx prisma generate
```

### CORS Errors
Make sure `CORS_ORIGIN` in backend/.env matches your frontend URL:
```
CORS_ORIGIN=http://localhost:3000
```

## Next Steps

### Configure Twilio (for SMS)
1. Sign up at twilio.com
2. Get your Account SID and Auth Token
3. Get a phone number
4. Update .env with credentials

### Configure Slack (for notifications)
1. Create a Slack app
2. Add incoming webhook
3. Get the webhook URL
4. Update SLACK_WEBHOOK_URL in .env

### Configure Email (for emails)
1. Use Gmail (easiest for dev)
2. Enable 2FA
3. Create an App Password
4. Update SMTP settings in .env:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASS=your_app_password
```

## Development Tips

### View Database
```bash
cd backend
npx prisma studio
```

Opens a GUI at `http://localhost:5555`

### Reset Database
```bash
npx prisma migrate reset
npm run prisma:seed
```

### Check API Endpoints
```bash
# Get all emergencies
curl http://localhost:3001/api/emergencies \
  -H "Authorization: Bearer YOUR_TOKEN"

# Health check
curl http://localhost:3001/health
```

### Hot Reload
Both frontend and backend support hot reload:
- Backend: Edit any .ts file in `src/`
- Frontend: Edit any .tsx file in `src/`

## File Structure

```
/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation
│   │   └── index.ts         # Server entry
│   └── prisma/
│       ├── schema.prisma    # Database schema
│       └── seed.ts          # Sample data
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   └── types/           # TypeScript types
    └── public/
```

## Support

- GitHub Issues: https://github.com/splitleasesharath/_internal-emergency/issues
- Documentation: See /docs folder
- API Docs: docs/API.md
- Deployment: docs/DEPLOYMENT.md

## What's Next?

- Customize the UI theme in `frontend/src/theme.ts`
- Add more preset messages/emails in database
- Configure production environment
- Deploy to your hosting platform
- Set up monitoring and logging

Happy coding! 🚀
