import type { PoolState } from '@gold-network/api';

import removeOldPoints from './removeOldPoints';

export default function normalizePoolState(poolState: PoolState): PoolState {
  return {
    ...poolState,
    pointsAcknowledged24H: removeOldPoints(poolState.pointsAcknowledged24H),
    pointsFound24H: removeOldPoints(poolState.pointsFound24H),
  };
}
