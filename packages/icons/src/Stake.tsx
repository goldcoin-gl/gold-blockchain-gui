import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import StakeIcon from './images/Stake.svg';

export default function Stake(props: SvgIconProps) {
  return <SvgIcon component={StakeIcon} viewBox="0 0 34 34" {...props} />;
}
