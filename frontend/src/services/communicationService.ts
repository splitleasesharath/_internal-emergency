import api from './api';
import {
  Message,
  EmailLog,
  SendSMSRequest,
  SendEmailRequest,
  PresetMessage,
  PresetEmail,
} from '../types';

export const communicationService = {
  sendSMS: async (emergencyId: string, data: SendSMSRequest): Promise<Message> => {
    const response = await api.post(`/communication/${emergencyId}/sms`, data);
    return response.data;
  },

  sendEmail: async (
    emergencyId: string,
    data: SendEmailRequest
  ): Promise<EmailLog> => {
    const response = await api.post(`/communication/${emergencyId}/email`, data);
    return response.data;
  },

  getMessageHistory: async (emergencyId: string): Promise<Message[]> => {
    const response = await api.get(`/communication/${emergencyId}/messages`);
    return response.data;
  },

  getEmailHistory: async (emergencyId: string): Promise<EmailLog[]> => {
    const response = await api.get(`/communication/${emergencyId}/emails`);
    return response.data;
  },

  getPresetMessages: async (): Promise<PresetMessage[]> => {
    const response = await api.get('/presets/messages');
    return response.data;
  },

  getPresetEmails: async (): Promise<PresetEmail[]> => {
    const response = await api.get('/presets/emails');
    return response.data;
  },
};
