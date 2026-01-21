import React from 'react';
import { Box, Container } from '@mui/material';
import EmergencyDashboard from './pages/EmergencyDashboard';

const App: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        py: 3,
      }}
    >
      <Container maxWidth="xl">
        <EmergencyDashboard />
      </Container>
    </Box>
  );
};

export default App;
