import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, timer } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { FrontendFeatureFlagsService } from '../../../../core/config/feature-flags.service';
import { RoutesApiService } from '../../data-access/routes-api.service';
import { ActiveRouteTrackingItem } from '../../models/route.model';

@Component({
  selector: 'app-monitoring-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monitoring-page.component.html',
  styleUrl: './monitoring-page.component.css'
})
export class MonitoringPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly routesApi = inject(RoutesApiService);
  private readonly featureFlags = inject(FrontendFeatureFlagsService);

  readonly trackingEnabled = this.featureFlags.isTrackingEnabled();
  readonly pollingMs = 30_000;

  readonly items = signal<ActiveRouteTrackingItem[]>([]);
  readonly initialLoading = signal(true);
  readonly refreshing = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastUpdatedAt = signal<string>('');

  ngOnInit(): void {
    if (!this.trackingEnabled) {
      this.initialLoading.set(false);
      return;
    }

    timer(0, this.pollingMs)
      .pipe(
        tap((index) => {
          if (index === 0) {
            this.initialLoading.set(true);
          } else {
            this.refreshing.set(true);
          }

          this.error.set(null);
        }),
        switchMap(() => {
          return this.routesApi.getActiveRoutesTracking().pipe(
            catchError(() => {
              this.error.set(
                this.items().length
                  ? 'No se pudo actualizar el monitoreo.'
                  : 'No fue posible cargar el monitoreo en tiempo real.'
              );

              return EMPTY;
            }),
            finalize(() => {
              this.initialLoading.set(false);
              this.refreshing.set(false);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response) => {
        this.items.set(response.data);
        this.lastUpdatedAt.set(new Date().toISOString());
      });
  }

  trackByRouteId(_index: number, item: ActiveRouteTrackingItem): number {
    return item.route.id;
  }
}
