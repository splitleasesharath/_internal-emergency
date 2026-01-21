# Internal Emergency Management Dashboard

A comprehensive emergency management dashboard for Split Lease staff to handle guest-reported emergencies during their stays.

## Features

- **Emergency Report Management**: View, filter, and manage emergency reports
- **Guest & Host Information**: Display detailed information about guests, hosts, and properties
- **Team Assignment**: Assign emergencies to team members with Slack notifications
- **Multi-Channel Communication**: Send SMS and emails to guests with preset templates
- **Message History**: Track all communication threads
- **Status Updates**: Update emergency status and add guidance/instructions
- **Photo Management**: View photos uploaded by guests

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Material-UI (MUI) for components
- React Query for data fetching
- React Hook Form for form management
- Axios for API calls

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- Prisma ORM
- Twilio for SMS
- Nodemailer for email
- Slack Web API

## Project Structure

```
/
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── public/
├── backend/           # Node.js Express API
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   └── prisma/
│       └── schema.prisma  # Database schema
└── docs/              # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Twilio account
- Slack workspace and webhook
- SMTP server for emails

### Installation

1. Clone the repository:
```bash
git clone https://github.com/splitleasesharath/_internal-emergency.git
cd _internal-emergency
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:

Create `backend/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/emergency_db"
PORT=3001
JWT_SECRET=your_jwt_secret

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Slack
SLACK_WEBHOOK_URL=your_slack_webhook
SLACK_DYNAMIC_TASKS_CHANNEL=your_channel_id

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
```

Create `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

4. Set up the database:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. Start the development servers:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## API Endpoints

### Emergency Reports
- `GET /api/emergencies` - Get all emergency reports
- `GET /api/emergencies/:id` - Get specific emergency report
- `POST /api/emergencies` - Create new emergency report
- `PUT /api/emergencies/:id` - Update emergency report
- `PUT /api/emergencies/:id/assign` - Assign emergency to team member
- `PUT /api/emergencies/:id/status` - Update emergency status

### Communication
- `POST /api/emergencies/:id/sms` - Send SMS to guest
- `POST /api/emergencies/:id/email` - Send email to guest
- `GET /api/emergencies/:id/messages` - Get message history
- `GET /api/emergencies/:id/emails` - Get email history

### Team
- `GET /api/team-members` - Get list of team members

## Deployment

### Backend
- Deploy to Heroku, AWS, or DigitalOcean
- Ensure PostgreSQL database is provisioned
- Set all environment variables

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or CloudFlare Pages

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Proprietary - Split Lease Team
