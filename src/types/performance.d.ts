export interface Value {
  value: number;
}

export interface PerformanceType {
  id: string;
  name: string;
  serviceId: string;
  entityId: string;
  timeBucket: string;
  match: number;
  percentage: number;
  total: number;
  max: number;
  min: number;
  count: number;
  avg: number;
  cpm: number;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
  attributes: any[];
}
