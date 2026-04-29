-- CreateTable
CREATE TABLE "routes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "origin_city" TEXT NOT NULL,
    "destination_city" TEXT NOT NULL,
    "distance_km" INTEGER NOT NULL,
    "estimated_time_hours" REAL NOT NULL,
    "vehicle_type" TEXT NOT NULL,
    "carrier" TEXT NOT NULL,
    "cost_usd" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVA',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME
);

-- CreateIndex
CREATE INDEX "routes_origin_city_idx" ON "routes"("origin_city");

-- CreateIndex
CREATE INDEX "routes_destination_city_idx" ON "routes"("destination_city");

-- CreateIndex
CREATE INDEX "routes_status_idx" ON "routes"("status");

-- CreateIndex
CREATE INDEX "routes_vehicle_type_idx" ON "routes"("vehicle_type");

-- CreateIndex
CREATE INDEX "routes_carrier_idx" ON "routes"("carrier");
