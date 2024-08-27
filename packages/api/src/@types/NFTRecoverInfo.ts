import type BigNumber from 'bignumber.js';

type NFTRecoverInfo = {
  totalAmount: number | BigNumber;
  balanceAmount: number | BigNumber;
  recordAmount: number | BigNumber;
  contractAddress: string;
};

export default NFTRecoverInfo;
