import { inject } from '@angular/core';
import { CanMatchFn, Router, Routes } from '@angular/router';
import { FrontendFeatureFlagsService } from './core/config/feature-flags.service';
import { MonitoringPageComponent } from './features/routes/pages/monitoring-page/monitoring-page.component';
import { RoutesPageComponent } from './features/routes/pages/routes-page/routes-page.component';

const trackingEnabledGuard: CanMatchFn = () => {
  const featureFlags = inject(FrontendFeatureFlagsService);
  const router = inject(Router);

  return featureFlags.isTrackingEnabled() ? true : router.createUrlTree(['/routes']);
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'routes'
  },
  {
    path: 'routes',
    component: RoutesPageComponent
  },
  {
    path: 'monitoring',
    canMatch: [trackingEnabledGuard],
    component: MonitoringPageComponent
  },
  {
    path: '**',
    redirectTo: 'routes'
  }
];
