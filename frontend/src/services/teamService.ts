import api from './api';
import { User } from '../types';

export const teamService = {
  getTeamMembers: async (): Promise<User[]> => {
    const response = await api.get('/team');
    return response.data;
  },
};
