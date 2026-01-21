import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  CircularProgress,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { EmergencyReport } from '../types';

interface EmergencyListProps {
  emergencies: EmergencyReport[];
  selectedEmergency: EmergencyReport | null;
  onSelectEmergency: (emergency: EmergencyReport) => void;
  isLoading: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'REPORTED':
      return 'error';
    case 'ASSIGNED':
      return 'warning';
    case 'IN_PROGRESS':
      return 'info';
    case 'RESOLVED':
      return 'success';
    case 'CLOSED':
      return 'default';
    default:
      return 'default';
  }
};

const EmergencyList: React.FC<EmergencyListProps> = ({
  emergencies,
  selectedEmergency,
  onSelectEmergency,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (emergencies.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          No emergencies reported
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ px: 1, fontWeight: 600 }}>
        All Emergencies ({emergencies.length})
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List sx={{ p: 0 }}>
        {emergencies.map((emergency) => (
          <React.Fragment key={emergency.id}>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedEmergency?.id === emergency.id}
                onClick={() => onSelectEmergency(emergency)}
                sx={{
                  borderLeft: 4,
                  borderColor:
                    selectedEmergency?.id === emergency.id
                      ? 'primary.main'
                      : 'transparent',
                  '&:hover': {
                    borderColor: 'primary.light',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={0.5}
                    >
                      <Typography variant="subtitle2" fontWeight={600}>
                        {emergency.reservation.agreementNumber}
                      </Typography>
                      <Chip
                        label={emergency.status}
                        size="small"
                        color={getStatusColor(emergency.status)}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.primary">
                        {emergency.emergencyType}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {emergency.reservation.listing.address}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                        {format(new Date(emergency.createdAt), 'MMM d, yyyy h:mm a')}
                      </Typography>
                      {emergency.assignedTo && (
                        <Typography
                          variant="caption"
                          display="block"
                          color="primary"
                          sx={{ mt: 0.5 }}
                        >
                          Assigned to: {emergency.assignedTo.fullName}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default EmergencyList;
