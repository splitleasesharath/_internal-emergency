import { WebClient } from '@slack/web-api';

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

export const notifyEmergencyAssignment = async (emergency: any) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const emergencyUrl = `${frontendUrl}/_internal-emergency?emergency=${emergency.id}`;

    const message = `
*Emergency Assigned to ${emergency.assignedTo?.fullName}*

Please go to <${emergencyUrl}|this page> and handle the below emergency.

*Agreement #:* ${emergency.reservation?.agreementNumber}
*Reported By:* ${emergency.reportedBy?.fullName}
*Date Reported:* ${new Date(emergency.createdAt).toLocaleDateString()}
*Emergency Type:* ${emergency.emergencyType}
*Listing Address:* ${emergency.reservation?.listing?.address}

*Guidance / Instructions:*
${emergency.guidanceInstructions || 'No additional guidance provided'}
    `.trim();

    await client.chat.postMessage({
      channel: process.env.SLACK_DYNAMIC_TASKS_CHANNEL || '',
      text: message,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🚨 Emergency Assigned to ${emergency.assignedTo?.fullName}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Emergency',
              },
              url: emergencyUrl,
              style: 'primary',
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('Slack Notification Error:', error);
    throw new Error('Failed to send Slack notification');
  }
};

export const notifyEmergencyCreated = async (emergency: any) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const emergencyUrl = `${frontendUrl}/_internal-emergency?emergency=${emergency.id}`;

    const message = `
*New Emergency Reported*

*Agreement #:* ${emergency.reservation?.agreementNumber}
*Reported By:* ${emergency.reportedBy?.fullName}
*Emergency Type:* ${emergency.emergencyType}
*Listing Address:* ${emergency.reservation?.listing?.address}

*Description:*
${emergency.description}
    `.trim();

    await client.chat.postMessage({
      channel: process.env.SLACK_DYNAMIC_TASKS_CHANNEL || '',
      text: message,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 New Emergency Reported',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Emergency',
              },
              url: emergencyUrl,
              style: 'danger',
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('Slack Notification Error:', error);
  }
};
