import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock Data
const mockTeamMembers = [
  {
    id: '1',
    fullName: 'John Smith',
    email: 'john@splitlease.com',
    phoneNumber: '+1234567891',
    role: 'STAFF'
  },
  {
    id: '2',
    fullName: 'Jane Doe',
    email: 'jane@splitlease.com',
    phoneNumber: '+1234567892',
    role: 'STAFF'
  },
  {
    id: '3',
    fullName: 'Admin User',
    email: 'admin@splitlease.com',
    phoneNumber: '+1234567890',
    role: 'ADMIN'
  }
];

const mockEmergencies = [
  {
    id: '1',
    reservation: {
      agreementNumber: 'AGR-2024-001',
      listing: {
        address: '123 Main Street, San Francisco, CA 94102',
        city: 'San Francisco',
        state: 'CA'
      },
      guest: {
        id: '4',
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        phoneNumber: '+1234567893'
      }
    },
    reportedBy: {
      id: '4',
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      phoneNumber: '+1234567893'
    },
    emergencyType: 'Plumbing Issue',
    description: 'Water leak in the bathroom. The sink is dripping continuously and water is pooling on the floor.',
    status: 'REPORTED',
    photo1Url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
    photo2Url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    guidanceInstructions: undefined,
    assignedTo: undefined,
    assignedAt: undefined,
    resolvedAt: undefined,
    isHidden: false,
    createdAt: new Date('2024-01-21T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-21T10:00:00Z').toISOString(),
    messages: [
      {
        id: 'm1',
        direction: 'OUTBOUND' as const,
        messageBody: 'We have received your emergency report and are working on it.',
        status: 'SENT' as const,
        createdAt: new Date('2024-01-21T10:05:00Z').toISOString()
      }
    ] as any[],
    emails: [
      {
        id: 'e1',
        recipientEmail: 'alice@example.com',
        ccEmails: [],
        bccEmails: [],
        subject: 'Emergency Report Received',
        status: 'SENT' as const,
        createdAt: new Date('2024-01-21T10:03:00Z').toISOString()
      }
    ] as any[]
  },
  {
    id: '2',
    reservation: {
      agreementNumber: 'AGR-2024-002',
      listing: {
        address: '456 Oak Avenue, Los Angeles, CA 90001',
        city: 'Los Angeles',
        state: 'CA'
      },
      guest: {
        id: '5',
        fullName: 'Bob Williams',
        email: 'bob@example.com',
        phoneNumber: '+1234567894'
      }
    },
    reportedBy: {
      id: '5',
      fullName: 'Bob Williams',
      email: 'bob@example.com',
      phoneNumber: '+1234567894'
    },
    emergencyType: 'Heating Not Working',
    description: 'The heating system is not working. It\'s very cold inside the unit.',
    status: 'ASSIGNED',
    assignedTo: mockTeamMembers[0],
    assignedAt: new Date('2024-01-21T11:00:00Z').toISOString(),
    guidanceInstructions: 'Check the thermostat settings first, then inspect the furnace',
    photo1Url: undefined,
    photo2Url: undefined,
    resolvedAt: undefined,
    isHidden: false,
    createdAt: new Date('2024-01-21T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-21T11:00:00Z').toISOString(),
    messages: [] as any[],
    emails: [] as any[]
  },
  {
    id: '3',
    reservation: {
      agreementNumber: 'AGR-2024-003',
      listing: {
        address: '789 Pine Street, Seattle, WA 98101',
        city: 'Seattle',
        state: 'WA'
      },
      guest: {
        id: '6',
        fullName: 'Carol Davis',
        email: 'carol@example.com',
        phoneNumber: '+1234567895'
      }
    },
    reportedBy: {
      id: '6',
      fullName: 'Carol Davis',
      email: 'carol@example.com',
      phoneNumber: '+1234567895'
    },
    emergencyType: 'Lock Issue',
    description: 'Cannot unlock the front door. The key is not turning.',
    status: 'IN_PROGRESS',
    assignedTo: mockTeamMembers[1],
    assignedAt: new Date('2024-01-20T14:00:00Z').toISOString(),
    guidanceInstructions: 'Locksmith is on the way',
    photo1Url: undefined,
    photo2Url: undefined,
    resolvedAt: undefined,
    isHidden: false,
    createdAt: new Date('2024-01-20T13:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-21T08:00:00Z').toISOString(),
    messages: [] as any[],
    emails: [] as any[]
  }
];

const mockPresetMessages = [
  {
    id: 'pm1',
    label: 'Emergency Received',
    content: 'We have received your emergency report and are working on it. A team member will contact you shortly.',
    category: 'acknowledgment'
  },
  {
    id: 'pm2',
    label: 'On The Way',
    content: 'Our team member is on the way to your location. ETA: 30 minutes.',
    category: 'status'
  },
  {
    id: 'pm3',
    label: 'Work Completed',
    content: 'The emergency has been resolved. Please let us know if you need any further assistance.',
    category: 'resolution'
  }
];

const mockPresetEmails = [
  {
    id: 'pe1',
    label: 'Emergency Acknowledgment',
    subject: 'Emergency Report Received',
    bodyHtml: '<p>Dear Guest,</p><p>We have received your emergency report and are working on it.</p>',
    bodyText: 'Dear Guest,\n\nWe have received your emergency report and are working on it.',
    category: 'acknowledgment'
  },
  {
    id: 'pe2',
    label: 'Emergency Resolved',
    subject: 'Emergency Resolved',
    bodyHtml: '<p>Dear Guest,</p><p>Your emergency has been resolved.</p>',
    bodyText: 'Dear Guest,\n\nYour emergency has been resolved.',
    category: 'resolution'
  }
];

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'MOCK' });
});

// API Routes
app.get('/api/emergencies', (_req, res) => {
  res.json({
    data: mockEmergencies,
    total: mockEmergencies.length,
    limit: 50,
    offset: 0
  });
});

app.get('/api/emergencies/:id', (req, res) => {
  const emergency = mockEmergencies.find(e => e.id === req.params.id);
  if (!emergency) {
    res.status(404).json({ error: 'Emergency not found' });
    return;
  }
  res.json(emergency);
});

app.put('/api/emergencies/:id/assign', (req, res) => {
  const emergency = mockEmergencies.find(e => e.id === req.params.id);
  if (!emergency) {
    res.status(404).json({ error: 'Emergency not found' });
    return;
  }
  const teamMember = mockTeamMembers.find(t => t.id === req.body.assignedToId);
  emergency.assignedTo = teamMember as any;
  emergency.guidanceInstructions = req.body.guidanceInstructions || undefined;
  emergency.status = 'ASSIGNED';
  emergency.assignedAt = new Date().toISOString();
  res.json(emergency);
});

app.put('/api/emergencies/:id/status', (req, res) => {
  const emergency = mockEmergencies.find(e => e.id === req.params.id);
  if (!emergency) {
    res.status(404).json({ error: 'Emergency not found' });
    return;
  }
  emergency.status = req.body.status;
  if (req.body.status === 'RESOLVED') {
    (emergency as any).resolvedAt = new Date().toISOString();
  }
  res.json(emergency);
});

app.put('/api/emergencies/:id/visibility', (req, res) => {
  const emergency = mockEmergencies.find(e => e.id === req.params.id);
  if (!emergency) {
    res.status(404).json({ error: 'Emergency not found' });
    return;
  }
  emergency.isHidden = req.body.isHidden;
  res.json(emergency);
});

app.post('/api/communication/:emergencyId/sms', (req, res) => {
  const message = {
    id: `m${Date.now()}`,
    emergencyReportId: req.params.emergencyId,
    direction: 'OUTBOUND',
    recipientPhone: req.body.recipientPhone,
    senderPhone: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
    messageBody: req.body.messageBody,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  const emergency = mockEmergencies.find(e => e.id === req.params.emergencyId);
  if (emergency && emergency.messages) {
    emergency.messages.push(message);
  }

  res.json(message);
});

app.post('/api/communication/:emergencyId/email', (req, res) => {
  const email = {
    id: `e${Date.now()}`,
    emergencyReportId: req.params.emergencyId,
    recipientEmail: req.body.recipientEmail,
    ccEmails: req.body.ccEmails || [],
    bccEmails: req.body.bccEmails || [],
    subject: req.body.subject,
    bodyHtml: req.body.bodyHtml,
    bodyText: req.body.bodyText,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  const emergency = mockEmergencies.find(e => e.id === req.params.emergencyId);
  if (emergency && emergency.emails) {
    emergency.emails.push(email);
  }

  res.json(email);
});

app.get('/api/communication/:emergencyId/messages', (_req, res) => {
  const emergency = mockEmergencies.find(e => e.id === _req.params.emergencyId);
  res.json(emergency?.messages || []);
});

app.get('/api/communication/:emergencyId/emails', (_req, res) => {
  const emergency = mockEmergencies.find(e => e.id === _req.params.emergencyId);
  res.json(emergency?.emails || []);
});

app.get('/api/team', (_req, res) => {
  res.json(mockTeamMembers);
});

app.get('/api/presets/messages', (_req, res) => {
  res.json(mockPresetMessages);
});

app.get('/api/presets/emails', (_req, res) => {
  res.json(mockPresetEmails);
});

// Error handling
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Mock Server running on port', PORT);
  console.log('📊 Environment: MOCK MODE (No Database Required)');
  console.log('🌐 Frontend URL:', process.env.FRONTEND_URL || 'http://localhost:3000');
  console.log('');
  console.log('📝 This is a mock server with sample data for preview purposes.');
  console.log('   SMS/Email/Slack integrations are simulated.');
  console.log('');
});

export default app;
