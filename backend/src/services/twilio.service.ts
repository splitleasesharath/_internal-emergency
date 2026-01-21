import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to: string, body: string) => {
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });

    return message;
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    throw new Error('Failed to send SMS');
  }
};
