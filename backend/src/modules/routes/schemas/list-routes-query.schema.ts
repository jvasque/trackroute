import { z } from 'zod';
import { RouteStatus } from '../domain/route-status.enum';

const optionalText = z.string().trim().min(1).max(120).optional();

export const listRoutesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  originCity: optionalText,
  destinationCity: optionalText,
  vehicleType: optionalText,
  carrier: optionalText,
  status: z.nativeEnum(RouteStatus).optional()
});

export type ListRoutesQuery = z.infer<typeof listRoutesQuerySchema>;
