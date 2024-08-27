import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import goldFormatter from './goldFormatter';

export default function goldToMojo(gold: string | number | BigNumber): BigNumber {
  return goldFormatter(gold, Unit.GOLD).to(Unit.MOJO).toBigNumber();
}
