import { Request, Response, NextFunction } from 'express';
import * as presetService from '../services/preset.service';

export const getPresetMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const messages = await presetService.getPresetMessages();
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getPresetEmails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const emails = await presetService.getPresetEmails();
    res.json(emails);
  } catch (error) {
    next(error);
  }
};
