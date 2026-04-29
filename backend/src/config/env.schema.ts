import { z } from 'zod';

const booleanFromEnv = z
  .union([z.boolean(), z.enum(['true', 'false'])])
  .transform((value) => (typeof value === 'boolean' ? value : value === 'true'));

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  CORS_ORIGIN: z.string().min(1).default('http://localhost:4200'),

  FEATURE_ROUTES_READ: booleanFromEnv.default(true),
  FEATURE_ROUTES_CREATE: booleanFromEnv.default(true),
  FEATURE_ROUTES_SEED: booleanFromEnv.default(true)
});

export type Env = z.infer<typeof envSchema>;
