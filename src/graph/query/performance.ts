import { Performances } from '../fragments/performance';

export const queryPerformances = `query queryPerformances(${Performances.variable}) {${Performances.query}}`;
