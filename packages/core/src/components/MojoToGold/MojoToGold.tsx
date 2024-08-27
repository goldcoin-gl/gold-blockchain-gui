import BigNumber from 'bignumber.js';
import React from 'react';

import useCurrencyCode from '../../hooks/useCurrencyCode';
import mojoToGold from '../../utils/mojoToGoldLocaleString';
import FormatLargeNumber from '../FormatLargeNumber';

export type MojoToGoldProps = {
  value: number | BigNumber;
};

export default function MojoToGold(props: MojoToGoldProps) {
  const { value } = props;
  const currencyCode = useCurrencyCode();
  const updatedValue = mojoToGold(value);

  return (
    <>
      <FormatLargeNumber value={updatedValue} />
      &nbsp;{currencyCode ?? ''}
    </>
  );
}
