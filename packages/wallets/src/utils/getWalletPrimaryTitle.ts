import { WalletType } from '@gold-network/api';
import type { Wallet } from '@gold-network/api';

export default function getWalletPrimaryTitle(wallet: Wallet): string {
  switch (wallet.type) {
    case WalletType.STANDARD_WALLET:
      return 'Gold';
    default:
      return wallet.meta?.name ?? wallet.name;
  }
}
