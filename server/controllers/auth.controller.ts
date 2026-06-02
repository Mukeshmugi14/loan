import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import mongoose from 'mongoose';
import User from '../models/User';
import OtpVerification from '../models/OtpVerification';
import Session from '../models/Session';
import { sendOTP, transporter } from '../services/email';
import { AuthRequest } from '../middleware/auth';
import { env } from '../config/env';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const generateTokens = (userId: string) => {
  const start = performance.now();
  const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN as any });
  const duration = (performance.now() - start).toFixed(2);
  console.log(`[JWT_CREATION] Tokens generated for user ${userId} in ${duration}ms`);
  return { accessToken, refreshToken };
};

const generateOTP = () => {
  const length = env.OTP_LENGTH;
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const sendOtpController = async (req: Request, res: Response): Promise<void> => {
  const { email, type } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (type === 'signup' && existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }
    if (type === 'forgot' && !existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const recentOtp = await OtpVerification.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
    const resendIntervalMs = env.OTP_RESEND_INTERVAL_SECONDS * 1000;
    if (recentOtp && Date.now() - recentOtp.createdAt.getTime() < resendIntervalMs) {
      res.status(429).json({ error: `Please wait ${env.OTP_RESEND_INTERVAL_SECONDS} seconds before requesting another OTP` });
      return;
    }

    const otpStart = performance.now();
    const otp = generateOTP();
    console.log(`[OTP_GENERATION] OTP generated in ${(performance.now() - otpStart).toFixed(2)}ms`);
    if (env.NODE_ENV === 'development') {
      console.log(`[DEV_ONLY] Generated OTP for ${normalizedEmail}: ${otp}`);
    }
    
    const storeStart = performance.now();
    const otpHash = await bcrypt.hash(otp, env.BCRYPT_ROUNDS);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60000);

    await OtpVerification.deleteMany({ email: normalizedEmail });
    await OtpVerification.create({ email: normalizedEmail, otpHash, expiresAt });
    console.log(`[OTP_STORAGE] OTP stored successfully in DB in ${(performance.now() - storeStart).toFixed(2)}ms`);

    const emailStart = performance.now();
    console.log(`[EMAIL_SENDING] Initiating SMTP delivery for ${normalizedEmail}...`);
    const emailSent = await sendOTP(normalizedEmail, otp);
    console.log(`[EMAIL_SENDING] SMTP delivery finished in ${(performance.now() - emailStart).toFixed(2)}ms`);
    
    if (!emailSent) {
      res.status(500).json({ error: 'Failed to send OTP email' });
      return;
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyOtpController = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ error: 'Email and OTP are required' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedOtp = String(otp).replace(/\D/g, '');

  try {
    const otpRecord = await OtpVerification.findOne({ email: normalizedEmail });
    if (!otpRecord) {
      res.status(400).json({ error: 'No OTP found for this email' });
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      await OtpVerification.deleteOne({ _id: otpRecord._id });
      res.status(400).json({ error: 'OTP has expired' });
      return;
    }

    if (otpRecord.attempts >= env.OTP_MAX_ATTEMPTS) {
      await OtpVerification.deleteOne({ _id: otpRecord._id });
      res.status(400).json({ error: 'Maximum attempts reached. Request a new OTP.' });
      return;
    }

    console.log(`[OTP_VERIFY] Input OTP: "${normalizedOtp}" (Original: ${typeof otp}), Email: "${normalizedEmail}"`);
    const isMatch = await bcrypt.compare(normalizedOtp, otpRecord.otpHash);
    console.log(`[OTP_VERIFY] Match result: ${isMatch}`);
    if (!isMatch) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      res.status(400).json({ error: 'Invalid OTP' });
      return;
    }

    otpRecord.verified = true;
    await otpRecord.save();

    res.json({ message: 'OTP verified successfully', verifiedToken: jwt.sign({ email: normalizedEmail }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any }) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const signupController = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, phone, password, verifiedToken } = req.body;
  
  if (!verifiedToken) {
    res.status(400).json({ error: 'Must verify OTP first (missing verifiedToken)' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const decoded = jwt.verify(verifiedToken, env.JWT_SECRET) as { email: string };
    if (decoded.email.toLowerCase().trim() !== normalizedEmail) {
      res.status(400).json({ error: 'Email mismatch in verification token' });
      return;
    }

    const otpRecord = await OtpVerification.findOne({ email: normalizedEmail, verified: true });
    if (!otpRecord) {
      res.status(400).json({ error: 'Please verify your OTP first, or OTP has expired.' });
      return;
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const startCreation = performance.now();
    const passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
    
    const user = await User.create({
      fullName,
      email: normalizedEmail,
      phone,
      passwordHash,
      authProvider: 'email',
      isEmailVerified: true
    });
    console.log(`[USER_CREATION] New user ${user._id} created in DB in ${(performance.now() - startCreation).toFixed(2)}ms`);

    await OtpVerification.deleteMany({ email: normalizedEmail });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    await Session.create({ userId: user._id, refreshTokenHash: await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS), ipAddress: req.ip });

    res.status(201).json({ accessToken, refreshToken, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const loginStart = performance.now();

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    const storedPassword = user?.passwordHash || user?.password;
    if (!user || !storedPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, storedPassword);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    console.log(`[LOGIN] User verification latency: ${(performance.now() - loginStart).toFixed(2)}ms`);

    // Auto-migrate legacy user schema to passwordHash
    if (user.password) {
      user.passwordHash = user.password;
      if (!user.fullName) {
        const prefix = normalizedEmail.split('@')[0];
        user.fullName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }
      user.set('password', undefined);
      await user.save();
      console.log(`[LOGIN] Migrated old password schema to passwordHash for user: ${user.email}`);
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    await Session.create({ userId: user._id, refreshTokenHash: await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS), ipAddress: req.ip });

    res.json({ accessToken, refreshToken, user: { id: user._id, fullName: user.fullName || normalizedEmail.split('@')[0], email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const googleAuthController = async (req: Request, res: Response): Promise<void> => {
  const { credential } = req.body;
  const authStart = performance.now();

  if (!credential) {
    res.status(400).json({ error: 'Google credential required' });
    return;
  }

  try {
    console.log(`[GOOGLE_LOGIN] Validating token with Google...`);
    const verifyStart = performance.now();
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
    console.log(`[GOOGLE_LOGIN] Token verification took ${(performance.now() - verifyStart).toFixed(2)}ms`);
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google token' });
      return;
    }

    const { email, name, picture } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      const creationStart = performance.now();
      user = await User.create({
        fullName: name || 'Google User',
        email,
        authProvider: 'google',
        isEmailVerified: true,
      });
      console.log(`[USER_CREATION] Google OAuth New user ${user._id} created in ${(performance.now() - creationStart).toFixed(2)}ms`);
    } else {
      console.log(`[GOOGLE_LOGIN] Existing user ${user._id} authenticated via Google OAuth`);
      if (user.authProvider !== 'google') {
        user.authProvider = 'google';
        await user.save();
      }
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    await Session.create({ userId: user._id, refreshTokenHash: await bcrypt.hash(refreshToken, env.BCRYPT_ROUNDS), ipAddress: req.ip });

    console.log(`[GOOGLE_LOGIN] Total OAuth process took ${(performance.now() - authStart).toFixed(2)}ms`);
    res.json({ accessToken, refreshToken, user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role, picture } });
  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
};

export const resetPasswordController = async (req: Request, res: Response): Promise<void> => {
  const { email, newPassword, verifiedToken } = req.body;

  try {
    if (!verifiedToken) {
      res.status(400).json({ error: 'Must verify OTP first (missing verifiedToken)' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const decoded = jwt.verify(verifiedToken, env.JWT_SECRET) as { email: string };
    if (decoded.email.toLowerCase().trim() !== normalizedEmail) {
      res.status(400).json({ error: 'Email mismatch in verification token' });
      return;
    }

    const otpRecord = await OtpVerification.findOne({ email: normalizedEmail, verified: true });
    if (!otpRecord) {
      res.status(400).json({ error: 'Please verify your OTP first, or OTP has expired.' });
      return;
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, env.BCRYPT_ROUNDS);
    if (!user.fullName) {
      const prefix = normalizedEmail.split('@')[0];
      user.fullName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    }
    user.set('password', undefined);
    await user.save();
    
    await OtpVerification.deleteMany({ email: normalizedEmail });
    await Session.deleteMany({ userId: user._id });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logoutController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (req.userId && refreshToken) {
       const sessions = await Session.find({ userId: req.userId });
       for (const session of sessions) {
         const match = await bcrypt.compare(refreshToken, session.refreshTokenHash);
         if (match) {
           await Session.deleteOne({ _id: session._id });
           break;
         }
       }
    }
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getMeController = async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

// GET /api/auth/health
export const healthController = async (req: Request, res: Response): Promise<void> => {
  const healthStatus: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'unknown',
      smtp: 'unknown',
      google_oauth: 'unknown'
    }
  };

  try {
    // Check MongoDB
    healthStatus.services.mongodb = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    if (mongoose.connection.readyState !== 1) healthStatus.status = 'degraded';

    // Check Google OAuth config
    const googleClientId = env.GOOGLE_CLIENT_ID;
    healthStatus.services.google_oauth = (googleClientId && googleClientId.length > 0) ? 'configured' : 'missing_config';
    if (!googleClientId) healthStatus.status = 'degraded';

    // Check SMTP connection asynchronously
    try {
      const verified = await transporter.verify();
      healthStatus.services.smtp = verified ? 'connected' : 'disconnected';
    } catch (smtpErr) {
      console.error('[HEALTH_CHECK] SMTP Verification failed:', smtpErr);
      healthStatus.services.smtp = 'error';
      healthStatus.status = 'degraded';
    }

    res.status(healthStatus.status === 'ok' ? 200 : 503).json(healthStatus);
  } catch (err) {
    console.error('[HEALTH_CHECK] Unexpected Error:', err);
    res.status(500).json({ error: 'Health check failed', details: err });
  }
};
