import { HealthCheckResponse } from '../types/api';

// Use environment variable if provided, otherwise default to relative path for Vite proxy
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchHealth(): Promise<HealthCheckResponse> {
  const endpoint = `${BASE_URL}/api/v1/health`;
  const response = await fetch(endpoint, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Health check failed with status: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
