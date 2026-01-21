import React, { useState } from 'react';
import { Box, Typography, Grid, Paper, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { emergencyService } from '../services/emergencyService';
import { EmergencyReport } from '../types';
import EmergencyDetails from '../components/EmergencyDetails';
import EmergencyList from '../components/EmergencyList';
import CommunicationPanel from '../components/CommunicationPanel';

const EmergencyDashboard: React.FC = () => {
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyReport | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');

  const { data: emergenciesData, isLoading, error, refetch } = useQuery({
    queryKey: ['emergencies'],
    queryFn: () => emergencyService.getAll(),
  });

  const handleSelectEmergency = (emergency: EmergencyReport) => {
    setSelectedEmergency(emergency);
  };

  const handleRefresh = () => {
    refetch();
    if (selectedEmergency) {
      emergencyService.getById(selectedEmergency.id).then(setSelectedEmergency);
    }
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(''), 5000);
  };

  if (error) {
    return (
      <Alert severity="error">
        Failed to load emergencies. Please try again later.
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Emergencies Dashboard
      </Typography>

      {alertMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setAlertMessage('')}>
          {alertMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Content - Emergency Details */}
        <Grid item xs={12} lg={7}>
          <Paper elevation={2} sx={{ p: 3, minHeight: 600 }}>
            {selectedEmergency ? (
              <>
                <EmergencyDetails
                  emergency={selectedEmergency}
                  onUpdate={handleRefresh}
                  onAlert={showAlert}
                />
                <CommunicationPanel
                  emergency={selectedEmergency}
                  onRefresh={handleRefresh}
                  onAlert={showAlert}
                />
              </>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 400,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  Select an emergency from the list to view details
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar - Emergency List */}
        <Grid item xs={12} lg={5}>
          <Paper elevation={2} sx={{ p: 2, maxHeight: '85vh', overflow: 'auto' }}>
            <EmergencyList
              emergencies={emergenciesData?.data || []}
              selectedEmergency={selectedEmergency}
              onSelectEmergency={handleSelectEmergency}
              isLoading={isLoading}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmergencyDashboard;
