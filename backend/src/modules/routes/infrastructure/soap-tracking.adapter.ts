import { Injectable } from '@nestjs/common';
import { EnvService } from '../../../config/env.service';
import { RouteEntity } from '../domain/route.entity';
import { RouteTrackingReading, TrackingAdapter } from '../domain/tracking-adapter';

@Injectable()
export class SoapTrackingAdapter implements TrackingAdapter {
  constructor(private readonly envService: EnvService) {}

  async getTracking(route: RouteEntity): Promise<RouteTrackingReading> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.envService.soapTrackingTimeoutMs);

    try {
      const response = await fetch(this.envService.soapTrackingUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml; charset=utf-8'
        },
        body: this.buildRequestXml(route.id),
        signal: controller.signal
      });

      const xml = await response.text();

      return {
        routeId: route.id,
        lastLocation: this.extractString(xml, 'lastLocation') ?? `Seguimiento SOAP ruta ${route.id}`,
        latitude: this.extractNumber(xml, 'latitude'),
        longitude: this.extractNumber(xml, 'longitude'),
        progressPercent: this.extractNumber(xml, 'progressPercent') ?? 0,
        etaMinutes: this.extractNumber(xml, 'etaMinutes') ?? 0,
        sourceTimestamp: new Date(this.extractString(xml, 'timestamp') ?? new Date().toISOString())
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private buildRequestXml(routeId: number): string {
    return `<TrackRouteRequest><routeId>${routeId}</routeId></TrackRouteRequest>`;
  }

  private extractString(xml: string, tagName: string): string | null {
    const result = xml.match(new RegExp(`<${tagName}>(.*?)</${tagName}>`));
    return result?.[1] ?? null;
  }

  private extractNumber(xml: string, tagName: string): number | null {
    const value = this.extractString(xml, tagName);
    return value === null ? null : Number(value);
  }
}
