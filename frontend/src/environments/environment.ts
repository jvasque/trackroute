export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000',
  featureFlags: {
    routesListEnabled: true,
    routesCreateEnabled: true,
    trackingEnabled: true
  }
} as const;
