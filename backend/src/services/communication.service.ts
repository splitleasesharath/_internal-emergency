import { PrismaClient } from '@prisma/client';
import * as twilioService from './twilio.service';
import * as emailService from './email.service';

const prisma = new PrismaClient();

interface EmailData {
  recipientEmail: string;
  subject: string;
  bodyHtml: string;
  bodyText: string;
  ccEmails: string[];
  bccEmails: string[];
}

export const sendSMS = async (
  emergencyReportId: string,
  recipientPhone: string,
  messageBody: string
) => {
  try {
    // Send via Twilio
    const twilioResponse = await twilioService.sendSMS(recipientPhone, messageBody);

    // Log message in database
    const message = await prisma.message.create({
      data: {
        emergencyReportId,
        direction: 'OUTBOUND',
        recipientPhone,
        senderPhone: process.env.TWILIO_PHONE_NUMBER || '',
        messageBody,
        twilioSid: twilioResponse.sid,
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    return message;
  } catch (error: any) {
    // Log failed message
    const message = await prisma.message.create({
      data: {
        emergencyReportId,
        direction: 'OUTBOUND',
        recipientPhone,
        senderPhone: process.env.TWILIO_PHONE_NUMBER || '',
        messageBody,
        status: 'FAILED',
        errorMessage: error.message,
      },
    });

    throw error;
  }
};

export const sendEmail = async (emergencyReportId: string, emailData: EmailData) => {
  try {
    // Send via email service
    await emailService.sendEmail({
      to: emailData.recipientEmail,
      subject: emailData.subject,
      html: emailData.bodyHtml,
      text: emailData.bodyText,
      cc: emailData.ccEmails,
      bcc: emailData.bccEmails,
    });

    // Log email in database
    const email = await prisma.emailLog.create({
      data: {
        emergencyReportId,
        recipientEmail: emailData.recipientEmail,
        ccEmails: emailData.ccEmails,
        bccEmails: emailData.bccEmails,
        subject: emailData.subject,
        bodyHtml: emailData.bodyHtml,
        bodyText: emailData.bodyText,
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    return email;
  } catch (error: any) {
    // Log failed email
    const email = await prisma.emailLog.create({
      data: {
        emergencyReportId,
        recipientEmail: emailData.recipientEmail,
        ccEmails: emailData.ccEmails,
        bccEmails: emailData.bccEmails,
        subject: emailData.subject,
        bodyHtml: emailData.bodyHtml,
        bodyText: emailData.bodyText,
        status: 'FAILED',
        errorMessage: error.message,
      },
    });

    throw error;
  }
};

export const getMessageHistory = async (emergencyReportId: string) => {
  return prisma.message.findMany({
    where: { emergencyReportId },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getEmailHistory = async (emergencyReportId: string) => {
  return prisma.emailLog.findMany({
    where: { emergencyReportId },
    orderBy: {
      createdAt: 'desc',
    },
  });
};
