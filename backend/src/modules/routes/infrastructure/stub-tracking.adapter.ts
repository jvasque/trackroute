import { Injectable } from '@nestjs/common';
import { RouteEntity } from '../domain/route.entity';
import { RouteStatus } from '../domain/route-status.enum';
import { RouteTrackingReading, TrackingAdapter } from '../domain/tracking-adapter';

@Injectable()
export class StubTrackingAdapter implements TrackingAdapter {
  async getTracking(route: RouteEntity): Promise<RouteTrackingReading> {
    const progressSeed = (route.id * 17 + route.distanceKm) % 55;
    const progressPercent = Math.min(95, 35 + progressSeed);
    const remainingPercent = Math.max(5, 100 - progressPercent);
    const etaMinutes = Math.max(15, Math.round(route.estimatedTimeHours * 60 * (remainingPercent / 100)));
    const coordinates = this.buildCoordinates(route.id);

    return {
      routeId: route.id,
      lastLocation: this.buildLocation(route, progressPercent),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      progressPercent,
      etaMinutes,
      sourceTimestamp: new Date()
    };
  }

  private buildLocation(route: RouteEntity, progressPercent: number): string {
    if (route.status !== RouteStatus.ACTIVA) {
      return `Ruta ${route.originCity} - ${route.destinationCity} sin seguimiento activo`;
    }

    if (progressPercent < 45) {
      return `Salida de ${route.originCity}`;
    }

    if (progressPercent < 80) {
      return `Corredor logístico hacia ${route.destinationCity}`;
    }

    return `Ingreso a ${route.destinationCity}`;
  }

  private buildCoordinates(routeId: number): { latitude: number; longitude: number } {
    const latitude = 4.5 + (routeId % 10) * 0.18;
    const longitude = -74.1 + (routeId % 10) * 0.21;

    return {
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6))
    };
  }
}
