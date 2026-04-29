export const environment = {
  production: true,
  apiBaseUrl: '/api',
  featureFlags: {
    routesListEnabled: true,
    routesCreateEnabled: true,
    trackingEnabled: true
  }
} as const;
