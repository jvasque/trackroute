import { z } from 'zod';
import { RouteStatus } from '../domain/route-status.enum';

const optionalText = z.string().trim().min(1).max(120).optional();

export const updateRouteSchema = z
  .object({
    originCity: optionalText,
    destinationCity: optionalText,
    distanceKm: z.coerce.number().int().positive().max(50000).optional(),
    estimatedTimeHours: z.coerce.number().positive().max(1000).optional(),
    vehicleType: optionalText,
    carrier: optionalText,
    costUsd: z.coerce.number().nonnegative().max(10000000).optional(),
    status: z.nativeEnum(RouteStatus).optional()
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one field is required'
  });

export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
