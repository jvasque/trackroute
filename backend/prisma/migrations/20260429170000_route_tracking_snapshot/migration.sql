-- CreateTable
CREATE TABLE "route_tracking_snapshots" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "route_id" INTEGER NOT NULL,
    "last_location" TEXT NOT NULL,
    "latitude" REAL,
    "longitude" REAL,
    "progress_percent" INTEGER NOT NULL,
    "eta_minutes" INTEGER NOT NULL,
    "source_timestamp" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "route_tracking_snapshots_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "routes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "route_tracking_snapshots_route_id_created_at_idx" ON "route_tracking_snapshots"("route_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "route_tracking_snapshots_created_at_idx" ON "route_tracking_snapshots"("created_at");
