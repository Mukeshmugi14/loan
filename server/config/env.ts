import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config();

const backendEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  CORS_ORIGIN: z.string().optional(),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required and cannot be empty'),
  
  // JWT
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required and cannot be empty'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required and cannot be empty'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required and cannot be empty'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required and cannot be empty'),

  // SMTP/Email
  EMAIL_HOST: z.string().min(1, 'EMAIL_HOST is required and cannot be empty'),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().email('EMAIL_USER must be a valid email address').min(1, 'EMAIL_USER is required'),
  EMAIL_PASSWORD: z.string().min(1, 'EMAIL_PASSWORD is required and cannot be empty'),
  EMAIL_FROM: z.string().optional(),

  // OTP Configuration
  OTP_LENGTH: z.coerce.number().int().positive().default(4),
  OTP_EXPIRY_MINUTES: z.coerce.number().int().positive().default(5),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().positive().default(3),
  OTP_RESEND_INTERVAL_SECONDS: z.coerce.number().int().positive().default(60),

  // Bcrypt
  BCRYPT_ROUNDS: z.coerce.number().int().positive().default(10),
});

export type BackendEnv = z.infer<typeof backendEnvSchema>;

let parsedEnv: BackendEnv;

try {
  parsedEnv = backendEnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    const missing = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    console.error('❌ Environment validation failed during initial compilation:');
    missing.forEach((msg) => console.error(`   - ${msg}`));
  }
  // Allow initialization, startup validation middleware will exit if needed.
  parsedEnv = process.env as unknown as BackendEnv;
}

export const env = parsedEnv;
export { backendEnvSchema };
