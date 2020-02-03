export const Performances = {
  variable: '$indName: String!, $serviceId: ID!, $step: Step!, $timeBucket: String!',
  query: `performances: getMultipleMetrics(metric: {
    name: $indName,
    id: $serviceId
  }, step: $step, timeBucket: $timeBucket) {
      id,
      name,
      serviceId,
      entityId,
      timeBucket,
      match,
      percentage,
      total,
      max,
      min,
      count,
      avg,
      cpm,
      p50,
      p75,
      p90,
      p95,
      p99,
      attributes{
        name
        value
      }
    }`,
};
