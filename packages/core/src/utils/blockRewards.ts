import BigNumber from 'bignumber.js';

const MOJO_PER_GOLD = new BigNumber('1000000000000');
const BLOCKS_PER_YEAR = 1_681_920;
const REWARD_HARDFORK_HEIGHT = 2 ** 32 - 1
const PREFARM = 1_000_000
const POOL_REWARD = '0.875'; // 7 / 8
const FARMER_REWARD = '0.125'; // 1 /8

export function calculatePoolReward(height: number): BigNumber {
    if (height >= REWARD_HARDFORK_HEIGHT) {
      return MOJO_PER_GOLD.times('0')
    }
    if (height === 0) {
      return MOJO_PER_GOLD.times(PREFARM).times(POOL_REWARD);
    }
    if (height < 3 * BLOCKS_PER_YEAR) {
      return MOJO_PER_GOLD.times('1').times(POOL_REWARD);
    }
    if (height < 6 * BLOCKS_PER_YEAR) {
      return MOJO_PER_GOLD.times('0.5').times(POOL_REWARD);
    }
    if (height < 9 * BLOCKS_PER_YEAR) {
      return MOJO_PER_GOLD.times('0.25').times(POOL_REWARD);
    }
    return MOJO_PER_GOLD.times('0.125').times(POOL_REWARD);
}

export function calculateBaseFarmerReward(height: number): BigNumber {
  const coefficient = height >= REWARD_HARDFORK_HEIGHT ? '1.0' : FARMER_REWARD
  if (height === 0) {
      return MOJO_PER_GOLD.times(PREFARM).times(coefficient);
  }
  if (height < 3 * BLOCKS_PER_YEAR) {
    return MOJO_PER_GOLD.times('2').times(coefficient);
  }
  if (height < 6 * BLOCKS_PER_YEAR) {
    return MOJO_PER_GOLD.times('1').times(coefficient);
  }
  if (height < 9 * BLOCKS_PER_YEAR) {
    return MOJO_PER_GOLD.times('0.5').times(coefficient);
  }
  if (height < 12 * BLOCKS_PER_YEAR) {
    return MOJO_PER_GOLD.times('0.25').times(coefficient);
  }

  return MOJO_PER_GOLD.times('0.125').times(coefficient);
}
