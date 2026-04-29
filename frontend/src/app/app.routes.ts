import { Routes } from '@angular/router';
import { RoutesPageComponent } from './features/routes/pages/routes-page/routes-page.component';

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
    path: '**',
    redirectTo: 'routes'
  }
];
