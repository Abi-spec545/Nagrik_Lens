export interface ModuleStatus {
  name: string;
  status: 'ready' | 'initialized' | 'pending' | string;
  description: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | string;
  app_name: string;
  version: string;
  environment: string;
  timestamp: string;
  database: string;
  modules: {
    schemegraph: ModuleStatus;
    claimcraft: ModuleStatus;
    civicroute: ModuleStatus;
    policymirror: ModuleStatus;
    [key: string]: ModuleStatus;
  };
}
