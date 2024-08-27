import { WalletService } from '@gold-network/api';

import useSubscribeToEvent from './useSubscribeToEvent';

export default function useNFTCoinDIDSet(callback: (coin: any) => void) {
  return useSubscribeToEvent('onNFTCoinDIDSet', WalletService, callback);
}
