export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: 'GUEST' | 'HOST' | 'STAFF' | 'ADMIN';
}

export interface Listing {
  id: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Reservation {
  id: string;
  agreementNumber: string;
  listing: Listing;
  guest: User;
  checkInDate: string;
  checkOutDate: string;
  status: string;
}

export interface Message {
  id: string;
  emergencyReportId: string;
  direction: 'OUTBOUND' | 'INBOUND';
  recipientPhone: string;
  senderPhone: string;
  messageBody: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  emergencyReportId: string;
  recipientEmail: string;
  ccEmails: string[];
  bccEmails: string[];
  subject: string;
  bodyHtml: string;
  bodyText: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: string;
  createdAt: string;
}

export interface EmergencyReport {
  id: string;
  reservation: Reservation;
  reportedBy: User;
  emergencyType: string;
  description: string;
  photo1Url?: string;
  photo2Url?: string;
  status: 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  guidanceInstructions?: string;
  assignedTo?: User;
  assignedAt?: string;
  resolvedAt?: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  emails?: EmailLog[];
}

export interface PresetMessage {
  id: string;
  label: string;
  content: string;
  category: string;
}

export interface PresetEmail {
  id: string;
  label: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  category: string;
}

export interface EmergenciesResponse {
  data: EmergencyReport[];
  total: number;
  limit: number;
  offset: number;
}

export interface SendSMSRequest {
  recipientPhone: string;
  messageBody: string;
}

export interface SendEmailRequest {
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  ccEmails?: string[];
  bccEmails?: string[];
}

export interface AssignEmergencyRequest {
  assignedToId: string;
  guidanceInstructions?: string;
}

export interface UpdateStatusRequest {
  status: 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
}
