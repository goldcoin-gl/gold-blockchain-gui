import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import GoldIcon from './images/gold.svg';

export default function Keys(props: SvgIconProps) {
  return <SvgIcon component={GoldIcon} viewBox="0 0 175 175" {...props} />;
}

export function GoldBlack(props: SvgIconProps) {
  return <SvgIcon component={GoldIcon} viewBox="0 0 175 175" sx={{ width: '100px', height: '100px' }} {...props} />;
}
