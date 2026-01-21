import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardMedia,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useQuery, useMutation } from '@tanstack/react-query';
import { EmergencyReport, UpdateStatusRequest } from '../types';
import { emergencyService } from '../services/emergencyService';
import { teamService } from '../services/teamService';

interface EmergencyDetailsProps {
  emergency: EmergencyReport;
  onUpdate: () => void;
  onAlert: (message: string) => void;
}

const EmergencyDetails: React.FC<EmergencyDetailsProps> = ({
  emergency,
  onUpdate,
  onAlert,
}) => {
  const [assignedTo, setAssignedTo] = useState('');
  const [guidanceInstructions, setGuidanceInstructions] = useState(
    emergency.guidanceInstructions || ''
  );
  const [newStatus, setNewStatus] = useState(emergency.status);

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['team-members'],
    queryFn: teamService.getTeamMembers,
  });

  const assignMutation = useMutation({
    mutationFn: (data: { assignedToId: string; guidanceInstructions?: string }) =>
      emergencyService.assign(emergency.id, data),
    onSuccess: () => {
      onAlert('Emergency assigned successfully. Team has been notified via Slack.');
      onUpdate();
    },
    onError: () => {
      onAlert('Failed to assign emergency. Please try again.');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (data: UpdateStatusRequest) =>
      emergencyService.updateStatus(emergency.id, data),
    onSuccess: () => {
      onAlert('Status updated successfully.');
      onUpdate();
    },
  });

  const handleAssign = () => {
    if (!assignedTo) {
      onAlert('Please select a team member to assign.');
      return;
    }

    assignMutation.mutate({
      assignedToId: assignedTo,
      guidanceInstructions: guidanceInstructions || undefined,
    });
  };

  const handleUpdateStatus = () => {
    if (newStatus !== emergency.status) {
      statusMutation.mutate({ status: newStatus });
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>
          Emergency Report
        </Typography>
        <Chip label={emergency.status} color="primary" />
      </Box>

      <Grid container spacing={3}>
        {/* Agreement Information */}
        <Grid item xs={12}>
          <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Agreement Number
            </Typography>
            <Typography variant="h6" fontWeight={600}>
              {emergency.reservation.agreementNumber}
            </Typography>
          </Box>
        </Grid>

        {/* Guest Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Guest Information
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">
              <strong>Name:</strong> {emergency.reservation.guest.fullName}
            </Typography>
            <Typography variant="body2">
              <PhoneIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
              {emergency.reservation.guest.phoneNumber}
            </Typography>
            <Typography variant="body2">
              <EmailIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
              {emergency.reservation.guest.email}
            </Typography>
          </Box>
        </Grid>

        {/* Host Information */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <PersonIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Host Information
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body2">
              <strong>Name:</strong> {emergency.reportedBy.fullName}
            </Typography>
            <Typography variant="body2">
              <PhoneIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
              {emergency.reportedBy.phoneNumber}
            </Typography>
            <Typography variant="body2">
              <EmailIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
              {emergency.reportedBy.email}
            </Typography>
          </Box>
        </Grid>

        {/* Listing Address */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <HomeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            Listing Address
          </Typography>
          <Typography variant="body2" sx={{ pl: 2 }}>
            {emergency.reservation.listing.address}
          </Typography>
        </Grid>

        {/* Emergency Details */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Type of Emergency
          </Typography>
          <Typography variant="body1" color="error" sx={{ pl: 2 }}>
            {emergency.emergencyType}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Description
          </Typography>
          <Typography variant="body2" sx={{ pl: 2, whiteSpace: 'pre-wrap' }}>
            {emergency.description}
          </Typography>
        </Grid>

        {/* Photos */}
        {(emergency.photo1Url || emergency.photo2Url) && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Photos Uploaded by Customer
            </Typography>
            <Grid container spacing={2} sx={{ pl: 2 }}>
              {emergency.photo1Url && (
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={emergency.photo1Url}
                      alt="Photo 1"
                      sx={{ maxHeight: 300, objectFit: 'contain' }}
                    />
                  </Card>
                </Grid>
              )}
              {emergency.photo2Url && (
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={emergency.photo2Url}
                      alt="Photo 2"
                      sx={{ maxHeight: 300, objectFit: 'contain' }}
                    />
                  </Card>
                </Grid>
              )}
            </Grid>
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* Assignment Section */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Assign Emergency
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Assign to Team Member</InputLabel>
                <Select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  label="Assign to Team Member"
                >
                  <MenuItem value="">
                    <em>Select team member</em>
                  </MenuItem>
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.fullName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Guidance / Instructions"
                value={guidanceInstructions}
                onChange={(e) => setGuidanceInstructions(e.target.value)}
                placeholder="Enter guidance or instructions for the assigned team member"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleAssign}
                disabled={assignMutation.isPending}
              >
                Assign & Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Status Update Section */}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Update Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(
                      e.target.value as
                        | 'REPORTED'
                        | 'ASSIGNED'
                        | 'IN_PROGRESS'
                        | 'RESOLVED'
                        | 'CLOSED'
                    )
                  }
                  label="Status"
                >
                  <MenuItem value="REPORTED">Reported</MenuItem>
                  <MenuItem value="ASSIGNED">Assigned</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="RESOLVED">Resolved</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleUpdateStatus}
                disabled={
                  statusMutation.isPending || newStatus === emergency.status
                }
              >
                Update Status
              </Button>
            </Grid>
          </Grid>
        </Grid>

        {/* Metadata */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary">
            Reported on: {format(new Date(emergency.createdAt), 'PPpp')}
          </Typography>
          {emergency.updatedAt && (
            <Typography variant="caption" color="text.secondary" display="block">
              Last updated: {format(new Date(emergency.updatedAt), 'PPpp')}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmergencyDetails;
