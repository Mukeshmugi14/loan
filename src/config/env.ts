import { z } from 'zod';

const frontendEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url('VITE_API_BASE_URL must be a valid URL').min(1, 'VITE_API_BASE_URL is required'),
  VITE_GOOGLE_CLIENT_ID: z.string().min(1, 'VITE_GOOGLE_CLIENT_ID is required'),
});

let parsedEnv: z.infer<typeof frontendEnvSchema>;

try {
  const metaEnv = (import.meta as any).env || {};
  parsedEnv = frontendEnvSchema.parse({
    VITE_API_BASE_URL: metaEnv.VITE_API_BASE_URL,
    VITE_GOOGLE_CLIENT_ID: metaEnv.VITE_GOOGLE_CLIENT_ID,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    const missing = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`);
    const errorMessage = `❌ Frontend Environment validation failed:\n${missing.join('\n')}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  throw error;
}

export const env = parsedEnv;
