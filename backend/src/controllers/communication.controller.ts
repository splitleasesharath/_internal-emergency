import { Request, Response, NextFunction } from 'express';
import * as communicationService from '../services/communication.service';

export const sendSMS = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { emergencyId } = req.params;
    const { recipientPhone, messageBody } = req.body;

    const message = await communicationService.sendSMS(
      emergencyId,
      recipientPhone,
      messageBody
    );

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const sendEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { emergencyId } = req.params;
    const { recipientEmail, subject, bodyHtml, bodyText, ccEmails, bccEmails } = req.body;

    const email = await communicationService.sendEmail(emergencyId, {
      recipientEmail,
      subject,
      bodyHtml,
      bodyText,
      ccEmails: ccEmails || [],
      bccEmails: bccEmails || [],
    });

    res.json(email);
  } catch (error) {
    next(error);
  }
};

export const getMessageHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { emergencyId } = req.params;
    const messages = await communicationService.getMessageHistory(emergencyId);

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getEmailHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { emergencyId } = req.params;
    const emails = await communicationService.getEmailHistory(emergencyId);

    res.json(emails);
  } catch (error) {
    next(error);
  }
};
