import BigNumber from 'bignumber.js';

import Unit from '../constants/Unit';

import goldFormatter from './goldFormatter';

export default function mojoToGoldLocaleString(mojo: string | number | BigNumber, locale?: string) {
  return goldFormatter(mojo, Unit.MOJO).to(Unit.GOLD).toLocaleString(locale);
}
