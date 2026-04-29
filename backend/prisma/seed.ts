import { PrismaClient, RouteStatus } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

const prisma = new PrismaClient();

const csvRouteSchema = z.object({
  id: z.coerce.number().int().positive(),
  origin_city: z.string().trim().min(1),
  destination_city: z.string().trim().min(1),
  distance_km: z.coerce.number().int().positive(),
  estimated_time_hours: z.coerce.number().positive(),
  vehicle_type: z.string().trim().min(1),
  carrier: z.string().trim().min(1),
  cost_usd: z.coerce.number().nonnegative(),
  status: z.nativeEnum(RouteStatus),
  created_at: z.string().datetime()
});

async function main(): Promise<void> {
  const seedEnabled = process.env.FEATURE_ROUTES_SEED !== 'false';

  if (!seedEnabled) {
    console.log('[seed] FEATURE_ROUTES_SEED=false. Seed skipped.');
    return;
  }

  const csvPath = join(process.cwd(), 'data', 'routes_dataset.csv');
  const file = readFileSync(csvPath, 'utf8');

  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as Record<string, string>[];

  let imported = 0;
  const errors: Array<{ row: number; error: string }> = [];

  for (const [index, record] of records.entries()) {
    const rowNumber = index + 2;
    const parsed = csvRouteSchema.safeParse(record);

    if (!parsed.success) {
      errors.push({
        row: rowNumber,
        error: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')
      });
      continue;
    }

    const route = parsed.data;

    await prisma.route.upsert({
      where: { id: route.id },
      update: {
        originCity: route.origin_city,
        destinationCity: route.destination_city,
        distanceKm: route.distance_km,
        estimatedTimeHours: route.estimated_time_hours,
        vehicleType: route.vehicle_type,
        carrier: route.carrier,
        costUsd: route.cost_usd,
        status: route.status,
        createdAt: new Date(route.created_at),
        deletedAt: null
      },
      create: {
        id: route.id,
        originCity: route.origin_city,
        destinationCity: route.destination_city,
        distanceKm: route.distance_km,
        estimatedTimeHours: route.estimated_time_hours,
        vehicleType: route.vehicle_type,
        carrier: route.carrier,
        costUsd: route.cost_usd,
        status: route.status,
        createdAt: new Date(route.created_at)
      }
    });

    imported += 1;
  }

  console.log(`[seed] Imported: ${imported}. Failed: ${errors.length}.`);

  if (errors.length > 0) {
    console.table(errors);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error('[seed] Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
