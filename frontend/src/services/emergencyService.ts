import api from './api';
import {
  EmergenciesResponse,
  EmergencyReport,
  AssignEmergencyRequest,
  UpdateStatusRequest,
} from '../types';

export const emergencyService = {
  getAll: async (params?: {
    status?: string;
    assignedTo?: string;
    limit?: number;
    offset?: number;
  }): Promise<EmergenciesResponse> => {
    const response = await api.get('/emergencies', { params });
    return response.data;
  },

  getById: async (id: string): Promise<EmergencyReport> => {
    const response = await api.get(`/emergencies/${id}`);
    return response.data;
  },

  getByAgreement: async (agreementNumber: string): Promise<EmergencyReport[]> => {
    const response = await api.get(`/emergencies/agreement/${agreementNumber}`);
    return response.data;
  },

  assign: async (
    id: string,
    data: AssignEmergencyRequest
  ): Promise<EmergencyReport> => {
    const response = await api.put(`/emergencies/${id}/assign`, data);
    return response.data;
  },

  updateStatus: async (
    id: string,
    data: UpdateStatusRequest
  ): Promise<EmergencyReport> => {
    const response = await api.put(`/emergencies/${id}/status`, data);
    return response.data;
  },

  updateVisibility: async (
    id: string,
    isHidden: boolean
  ): Promise<EmergencyReport> => {
    const response = await api.put(`/emergencies/${id}/visibility`, { isHidden });
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<EmergencyReport>
  ): Promise<EmergencyReport> => {
    const response = await api.put(`/emergencies/${id}`, data);
    return response.data;
  },
};
