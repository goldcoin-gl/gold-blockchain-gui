import type { Wallet } from '@gold-network/api';
import { WalletType } from '@gold-network/api';
import { mojoToCATLocaleString, mojoToGoldLocaleString, useLocale } from '@gold-network/core';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

export default function useWalletHumanValue(
  wallet: Wallet,
  value?: string | number | BigNumber,
  unit?: string,
): string {
  const [locale] = useLocale();

  return useMemo(() => {
    if (wallet && value !== undefined) {
      const localisedValue = [WalletType.CAT, WalletType.CRCAT].includes(wallet.type)
        ? mojoToCATLocaleString(value, locale)
        : mojoToGoldLocaleString(value, locale);

      return `${localisedValue} ${unit}`;
    }

    return '';
  }, [wallet, value, unit, locale]);
}
