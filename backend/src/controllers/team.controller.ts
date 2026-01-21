import { Request, Response, NextFunction } from 'express';
import * as teamService from '../services/team.service';

export const getTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const teamMembers = await teamService.getTeamMembers();
    res.json(teamMembers);
  } catch (error) {
    next(error);
  }
};
