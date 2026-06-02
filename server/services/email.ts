import nodemailer from 'nodemailer';
import { env } from '../config/env';

export const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: env.EMAIL_PORT === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ [SMTP] Connection failed:', error.message);
    console.error('   Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD in your .env');
  } else {
    console.log('✅ [SMTP] Server is ready to send emails');
  }
});

export const sendOTP = async (to: string, otp: string): Promise<boolean> => {
  if (!env.EMAIL_HOST || !env.EMAIL_USER || !env.EMAIL_PASSWORD) {
    console.error('❌ [SMTP] Missing EMAIL_HOST / EMAIL_USER / EMAIL_PASSWORD in .env');
    return false;
  }

  const mailOptions = {
    from: env.EMAIL_FROM || `"MSMERAISE Auth" <${env.EMAIL_USER}>`,
    to,
    subject: 'Your MSMERAISE Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #333; text-align: center;">Welcome to MSMERAISE</h2>
        <p style="color: #555; font-size: 16px;">Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; padding: 10px 20px; background: #F3F4F6; border-radius: 8px;">${otp}</span>
        </div>
        <p style="color: #555; font-size: 14px;">This code will expire in 5 minutes. Do not share it with anyone.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [SMTP] Email sent to ${to}: ${info.messageId}`);
    return true;
  } catch (error: any) {
    console.error('❌ [SMTP] Failed to send email:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   → Cannot connect to SMTP server. Check EMAIL_HOST and EMAIL_PORT.');
    } else if (error.responseCode === 535 || error.responseCode === 534) {
      console.error('   → Authentication failed. Use a Gmail App Password.');
      console.error('     https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   → Connection timed out. Check port', env.EMAIL_PORT);
    }
    return false;
  }
};