import { z } from 'zod';
import { RouteStatus } from '../domain/route-status.enum';

const requiredText = z.string().trim().min(1).max(120);

export const createRouteSchema = z.object({
  originCity: requiredText,
  destinationCity: requiredText,
  distanceKm: z.coerce.number().int().positive().max(50000),
  estimatedTimeHours: z.coerce.number().positive().max(1000),
  vehicleType: requiredText,
  carrier: requiredText,
  costUsd: z.coerce.number().nonnegative().max(10000000),
  status: z.nativeEnum(RouteStatus).default(RouteStatus.ACTIVA)
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>;