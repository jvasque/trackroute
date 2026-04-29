import { z } from 'zod';

export const routeIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export type RouteIdParam = z.infer<typeof routeIdParamSchema>;
