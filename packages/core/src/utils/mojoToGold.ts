import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import goldFormatter from './goldFormatter';

export default function mojoToGold(mojo: string | number | BigNumber): BigNumber {
  return goldFormatter(mojo, Unit.MOJO).to(Unit.GOLD).toBigNumber();
}
