import { Request, Response, NextFunction } from 'express';
import * as emergencyService from '../services/emergency.service';
import * as slackService from '../services/slack.service';

export const getAllEmergencies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, assignedTo, limit = '50', offset = '0' } = req.query;

    const emergencies = await emergencyService.getAllEmergencies({
      status: status as string,
      assignedTo: assignedTo as string,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    });

    res.json(emergencies);
  } catch (error) {
    next(error);
  }
};

export const getEmergencyById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const emergency = await emergencyService.getEmergencyById(id);

    if (!emergency) {
      res.status(404).json({ error: 'Emergency report not found' });
      return;
    }

    res.json(emergency);
  } catch (error) {
    next(error);
  }
};

export const createEmergency = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const emergencyData = req.body;
    const emergency = await emergencyService.createEmergency(emergencyData);

    res.status(201).json(emergency);
  } catch (error) {
    next(error);
  }
};

export const updateEmergency = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const emergency = await emergencyService.updateEmergency(id, updateData);

    res.json(emergency);
  } catch (error) {
    next(error);
  }
};

export const assignEmergency = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { assignedToId, guidanceInstructions } = req.body;

    const emergency = await emergencyService.assignEmergency(
      id,
      assignedToId,
      guidanceInstructions
    );

    // Send Slack notification
    await slackService.notifyEmergencyAssignment(emergency);

    res.json(emergency);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const emergency = await emergencyService.updateStatus(id, status);

    res.json(emergency);
  } catch (error) {
    next(error);
  }
};

export const updateVisibility = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { isHidden } = req.body;

    const emergency = await emergencyService.updateVisibility(id, isHidden);

    res.json(emergency);
  } catch (error) {
    next(error);
  }
};

export const getEmergencyByAgreement = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { agreementNumber } = req.params;
    const emergencies = await emergencyService.getEmergencyByAgreementNumber(agreementNumber);

    res.json(emergencies);
  } catch (error) {
    next(error);
  }
};
