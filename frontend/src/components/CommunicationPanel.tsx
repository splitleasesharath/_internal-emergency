import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  ButtonGroup,
} from '@mui/material';
import {
  Send as SendIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useMutation, useQuery } from '@tanstack/react-query';
import { EmergencyReport } from '../types';
import { communicationService } from '../services/communicationService';

interface CommunicationPanelProps {
  emergency: EmergencyReport;
  onRefresh: () => void;
  onAlert: (message: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const CommunicationPanel: React.FC<CommunicationPanelProps> = ({
  emergency,
  onRefresh,
  onAlert,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [smsMessage, setSmsMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [ccEmails, setCcEmails] = useState('');
  const [bccEmails, setBccEmails] = useState('');

  // Fetch preset messages and emails
  const { data: presetMessages = [] } = useQuery({
    queryKey: ['preset-messages'],
    queryFn: communicationService.getPresetMessages,
  });

  const { data: presetEmails = [] } = useQuery({
    queryKey: ['preset-emails'],
    queryFn: communicationService.getPresetEmails,
  });

  // Fetch message history
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages', emergency.id],
    queryFn: () => communicationService.getMessageHistory(emergency.id),
  });

  // Fetch email history
  const { data: emails = [], refetch: refetchEmails } = useQuery({
    queryKey: ['emails', emergency.id],
    queryFn: () => communicationService.getEmailHistory(emergency.id),
  });

  const smsMutation = useMutation({
    mutationFn: () =>
      communicationService.sendSMS(emergency.id, {
        recipientPhone: emergency.reservation.guest.phoneNumber || '',
        messageBody: smsMessage,
      }),
    onSuccess: () => {
      onAlert('SMS sent successfully!');
      setSmsMessage('');
      refetchMessages();
      onRefresh();
    },
    onError: () => {
      onAlert('Failed to send SMS. Please try again.');
    },
  });

  const emailMutation = useMutation({
    mutationFn: () =>
      communicationService.sendEmail(emergency.id, {
        recipientEmail: emergency.reservation.guest.email,
        subject: emailSubject,
        bodyHtml: `<p>${emailBody.replace(/\n/g, '<br>')}</p>`,
        bodyText: emailBody,
        ccEmails: ccEmails
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e),
        bccEmails: bccEmails
          .split(',')
          .map((e) => e.trim())
          .filter((e) => e),
      }),
    onSuccess: () => {
      onAlert('Email sent successfully!');
      setEmailSubject('');
      setEmailBody('');
      setCcEmails('');
      setBccEmails('');
      refetchEmails();
      onRefresh();
    },
    onError: () => {
      onAlert('Failed to send email. Please try again.');
    },
  });

  const handleSendSMS = () => {
    if (!smsMessage.trim()) {
      onAlert('Please enter a message');
      return;
    }
    smsMutation.mutate();
  };

  const handleSendEmail = () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      onAlert('Please enter subject and message');
      return;
    }
    emailMutation.mutate();
  };

  const handlePresetMessage = (content: string) => {
    setSmsMessage(content);
  };

  const handlePresetEmail = (preset: any) => {
    setEmailSubject(preset.subject);
    setEmailBody(preset.bodyText);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Communication
      </Typography>

      <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<SmsIcon />} label="Text Customer" />
          <Tab icon={<EmailIcon />} label="Email Customer" />
        </Tabs>

        {/* SMS Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                To: {emergency.reservation.guest.phoneNumber}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Type your message..."
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSendSMS}
                disabled={smsMutation.isPending}
              >
                Send SMS
              </Button>
            </Grid>

            {/* Preset Messages */}
            {presetMessages.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Preset Messages (Click to use)
                </Typography>
                <ButtonGroup orientation="vertical" fullWidth>
                  {presetMessages.slice(0, 5).map((preset) => (
                    <Button
                      key={preset.id}
                      onClick={() => handlePresetMessage(preset.content)}
                      sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Grid>
            )}

            {/* Message Thread */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Message Thread
              </Typography>
              {messages.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No messages yet
                </Typography>
              ) : (
                <List>
                  {messages.map((message) => (
                    <ListItem key={message.id} sx={{ px: 0 }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 2,
                          width: '100%',
                          bgcolor:
                            message.direction === 'OUTBOUND'
                              ? 'primary.light'
                              : 'grey.100',
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Chip
                            label={message.direction}
                            size="small"
                            color={
                              message.direction === 'OUTBOUND'
                                ? 'primary'
                                : 'default'
                            }
                          />
                          <Chip label={message.status} size="small" />
                        </Box>
                        <Typography variant="body2">{message.messageBody}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(message.createdAt), 'PPpp')}
                        </Typography>
                      </Paper>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* Email Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                To: {emergency.reservation.guest.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Message"
                placeholder="Type your email message..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="CC Email (comma separated)"
                value={ccEmails}
                onChange={(e) => setCcEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="BCC Email (comma separated)"
                value={bccEmails}
                onChange={(e) => setBccEmails(e.target.value)}
                placeholder="email1@example.com, email2@example.com"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSendEmail}
                disabled={emailMutation.isPending}
              >
                Send Email
              </Button>
            </Grid>

            {/* Preset Emails */}
            {presetEmails.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Preset Emails (Click to use)
                </Typography>
                <ButtonGroup orientation="vertical" fullWidth>
                  {presetEmails.slice(0, 5).map((preset) => (
                    <Button
                      key={preset.id}
                      onClick={() => handlePresetEmail(preset)}
                      sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </ButtonGroup>
              </Grid>
            )}

            {/* Email History */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Email History
              </Typography>
              {emails.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No emails sent yet
                </Typography>
              ) : (
                <List>
                  {emails.map((email) => (
                    <ListItem key={email.id} sx={{ px: 0 }}>
                      <Paper elevation={1} sx={{ p: 2, width: '100%' }}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={1}
                        >
                          <Typography variant="subtitle2">
                            {email.subject}
                          </Typography>
                          <Chip label={email.status} size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          To: {email.recipientEmail}
                        </Typography>
                        {email.ccEmails.length > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            CC: {email.ccEmails.join(', ')}
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          {format(new Date(email.createdAt), 'PPpp')}
                        </Typography>
                      </Paper>
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default CommunicationPanel;
