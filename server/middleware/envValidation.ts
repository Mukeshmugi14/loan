import { backendEnvSchema } from '../config/env';
import { z } from 'zod';

export const validateEnvStartup = (): void => {
  console.log('🔍 Running environment validation startup check...');

  let hasErrors = false;
  let hasWarnings = false;

  // 1. Zod Validation (Required values & formats)
  const result = backendEnvSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error('\n❌ CRITICAL: Missing or invalid environment variables:');
    result.error.issues.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    hasErrors = true;
  }

  const data = result.success ? result.data : (process.env as any);

  // If critical schema errors occurred, fail fast immediately
  if (hasErrors) {
    console.error('\n🛑 Server startup aborted due to configuration errors.\n');
    process.exit(1);
  }

  // 2. Extra Security Auditing & Warnings
  console.log('🛡️  Auditing security settings...');

  // MongoDB Connection String Checks
  const mongoUri: string = data.MONGODB_URI || '';
  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.warn('⚠️  WARNING: MONGODB_URI does not start with a valid protocol ("mongodb://" or "mongodb+srv://").');
    hasWarnings = true;
  }
  if (mongoUri.includes('secure_password_here') || mongoUri.includes('db_password')) {
    console.warn('⚠️  WARNING: MONGODB_URI appears to contain placeholder credentials.');
    hasWarnings = true;
  }

  // JWT Secret Checks
  const jwtSecret: string = data.JWT_SECRET || '';
  const jwtRefreshSecret: string = data.JWT_REFRESH_SECRET || '';

  if (jwtSecret.length < 32) {
    console.warn(`⚠️  WARNING: JWT_SECRET is weak (${jwtSecret.length} chars). It should be at least 32 characters/bytes for HS256.`);
    hasWarnings = true;
  }
  if (jwtRefreshSecret.length < 32) {
    console.warn(`⚠️  WARNING: JWT_REFRESH_SECRET is weak (${jwtRefreshSecret.length} chars). It should be at least 32 characters/bytes.`);
    hasWarnings = true;
  }
  if (
    jwtSecret.includes('secret') || 
    jwtSecret.includes('key') || 
    jwtSecret === 'your_super_secret_jwt_access_token_key_here'
  ) {
    console.warn('⚠️  WARNING: JWT_SECRET contains common/placeholder words or templates. Please set a secure random value.');
    hasWarnings = true;
  }

  // Gmail SMTP Configurations
  const emailHost: string = data.EMAIL_HOST || '';
  const emailPort: number = Number(data.EMAIL_PORT);
  const emailUser: string = data.EMAIL_USER || '';
  const emailPass: string = data.EMAIL_PASSWORD || '';

  if (emailHost.includes('gmail.com')) {
    if (emailPort !== 587 && emailPort !== 465) {
      console.warn(`⚠️  WARNING: Gmail SMTP host detected but port is set to ${emailPort}. Recommended ports are 587 (STARTTLS) or 465 (SSL/TLS).`);
      hasWarnings = true;
    }
    // Gmail app password validation: app passwords are 16 letters, usually written with spaces as 4 groups of 4.
    const cleanPass = emailPass.replace(/\s+/g, '');
    if (cleanPass.length !== 16 && emailPass !== 'your_gmail_app_password_here') {
      console.warn('⚠️  WARNING: EMAIL_PASSWORD does not look like a standard 16-character Gmail App Password.');
      hasWarnings = true;
    }
  }

  // Google OAuth Config Alignments
  const googleClientId: string = data.GOOGLE_CLIENT_ID || '';
  const googleClientSecret: string = data.GOOGLE_CLIENT_SECRET || '';
  const viteGoogleClientId: string = process.env.VITE_GOOGLE_CLIENT_ID || '';

  if (googleClientId && viteGoogleClientId && googleClientId !== viteGoogleClientId) {
    console.warn('⚠️  WARNING: Google OAuth client IDs mismatch between backend (GOOGLE_CLIENT_ID) and frontend (VITE_GOOGLE_CLIENT_ID).');
    hasWarnings = true;
  }

  if (googleClientSecret && googleClientSecret.startsWith('GOCSPX-') && googleClientSecret.length < 15) {
    console.warn('⚠️  WARNING: GOOGLE_CLIENT_SECRET seems invalid or truncated.');
    hasWarnings = true;
  }

  // CORS Origin Warnings
  const corsOrigin: string = data.CORS_ORIGIN || '';
  const nodeEnv: string = data.NODE_ENV || 'development';

  if (nodeEnv === 'production') {
    if (!corsOrigin || corsOrigin === '*' || corsOrigin.includes('localhost')) {
      console.warn(`⚠️  WARNING: CORS_ORIGIN is set to "${corsOrigin || 'empty'}" in production. This is insecure.`);
      hasWarnings = true;
    }
  }

  if (hasWarnings) {
    console.log('ℹ️  Startup check completed with configuration warnings. See above.');
  } else {
    console.log('✅ All environment validation checks passed successfully.');
  }
};
