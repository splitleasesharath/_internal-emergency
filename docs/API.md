# API Documentation

Base URL: `http://localhost:3001/api` (development)

All endpoints require authentication via JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## Emergency Endpoints

### Get All Emergencies

**GET** `/emergencies`

Query Parameters:
- `status` (optional): Filter by status (REPORTED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED)
- `assignedTo` (optional): Filter by assigned user ID (UUID)
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)

Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "reservation": {
        "agreementNumber": "AGR-2024-001",
        "listing": {
          "address": "123 Main St"
        },
        "guest": {
          "fullName": "John Doe",
          "email": "john@example.com",
          "phoneNumber": "+1234567890"
        }
      },
      "reportedBy": {
        "fullName": "Jane Smith"
      },
      "emergencyType": "Plumbing Issue",
      "description": "Water leak in bathroom",
      "status": "REPORTED",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 10,
  "limit": 50,
  "offset": 0
}
```

### Get Emergency by ID

**GET** `/emergencies/:id`

Response includes full emergency details with messages and emails.

### Get Emergencies by Agreement Number

**GET** `/emergencies/agreement/:agreementNumber`

Returns all emergencies for a specific reservation.

### Create Emergency

**POST** `/emergencies`

Request Body:
```json
{
  "reservationId": "uuid",
  "reportedById": "uuid",
  "emergencyType": "Plumbing Issue",
  "description": "Water leak in bathroom",
  "photo1Url": "https://example.com/photo1.jpg",
  "photo2Url": "https://example.com/photo2.jpg"
}
```

### Assign Emergency

**PUT** `/emergencies/:id/assign`

Request Body:
```json
{
  "assignedToId": "uuid",
  "guidanceInstructions": "Check the main valve first"
}
```

This triggers a Slack notification to the Dynamic Tasks channel.

### Update Emergency Status

**PUT** `/emergencies/:id/status`

Request Body:
```json
{
  "status": "IN_PROGRESS"
}
```

Valid statuses: REPORTED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED

### Update Emergency Visibility

**PUT** `/emergencies/:id/visibility`

Request Body:
```json
{
  "isHidden": true
}
```

### Update Emergency

**PUT** `/emergencies/:id`

Request Body (all fields optional):
```json
{
  "emergencyType": "Updated type",
  "description": "Updated description",
  "guidanceInstructions": "Updated guidance",
  "status": "IN_PROGRESS"
}
```

## Communication Endpoints

### Send SMS

**POST** `/communication/:emergencyId/sms`

Request Body:
```json
{
  "recipientPhone": "+1234567890",
  "messageBody": "Your emergency is being handled."
}
```

Response:
```json
{
  "id": "uuid",
  "direction": "OUTBOUND",
  "status": "SENT",
  "twilioSid": "SM...",
  "sentAt": "2024-01-15T10:00:00Z"
}
```

### Send Email

**POST** `/communication/:emergencyId/email`

Request Body:
```json
{
  "recipientEmail": "guest@example.com",
  "subject": "Emergency Update",
  "bodyHtml": "<p>Your emergency has been resolved.</p>",
  "bodyText": "Your emergency has been resolved.",
  "ccEmails": ["manager@splitlease.com"],
  "bccEmails": ["archive@splitlease.com"]
}
```

Response:
```json
{
  "id": "uuid",
  "status": "SENT",
  "sentAt": "2024-01-15T10:00:00Z"
}
```

### Get Message History

**GET** `/communication/:emergencyId/messages`

Returns all SMS messages for the emergency.

### Get Email History

**GET** `/communication/:emergencyId/emails`

Returns all emails sent for the emergency.

## Team Endpoints

### Get Team Members

**GET** `/team`

Returns all staff and admin users.

Response:
```json
[
  {
    "id": "uuid",
    "fullName": "John Smith",
    "email": "john@splitlease.com",
    "phoneNumber": "+1234567890",
    "role": "STAFF"
  }
]
```

## Preset Endpoints

### Get Preset Messages

**GET** `/presets/messages`

Returns all active preset SMS messages.

Response:
```json
[
  {
    "id": "uuid",
    "label": "Emergency Received",
    "content": "We have received your emergency report...",
    "category": "acknowledgment"
  }
]
```

### Get Preset Emails

**GET** `/presets/emails`

Returns all active preset email templates.

Response:
```json
[
  {
    "id": "uuid",
    "label": "Emergency Acknowledgment",
    "subject": "Emergency Report Received",
    "bodyHtml": "<p>Dear {{GUEST_NAME}}...</p>",
    "bodyText": "Dear {{GUEST_NAME}}...",
    "category": "acknowledgment"
  }
]
```

## Error Responses

All endpoints return standard error responses:

**400 Bad Request**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "emergencyType",
      "message": "Emergency type is required"
    }
  ]
}
```

**401 Unauthorized**
```json
{
  "error": "Authentication required"
}
```

**403 Forbidden**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found**
```json
{
  "error": "Emergency report not found"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- 100 requests per minute per IP address
- 1000 requests per hour per user

## Webhook Events

The API sends webhooks for the following events:

### Emergency Created
- Sends Slack notification to Dynamic Tasks channel
- Optionally sends SMS to guest if configured

### Emergency Assigned
- Sends Slack notification with assignment details
- Includes link to emergency page
- Contains guidance/instructions

## Authentication

### JWT Token Format

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "STAFF",
  "iat": 1705315200,
  "exp": 1705401600
}
```

Tokens expire after 24 hours.

## Testing

Use the provided `.env.example` file to set up your test environment:

```bash
# Test emergency creation
curl -X POST http://localhost:3001/api/emergencies \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "uuid",
    "reportedById": "uuid",
    "emergencyType": "Test Emergency",
    "description": "This is a test"
  }'
```

## SDK Usage (Frontend)

The frontend includes pre-built services:

```typescript
import { emergencyService } from './services/emergencyService';

// Get all emergencies
const emergencies = await emergencyService.getAll({ status: 'REPORTED' });

// Assign emergency
await emergencyService.assign('emergency-id', {
  assignedToId: 'user-id',
  guidanceInstructions: 'Check the valve'
});

// Send SMS
await communicationService.sendSMS('emergency-id', {
  recipientPhone: '+1234567890',
  messageBody: 'Update message'
});
```
