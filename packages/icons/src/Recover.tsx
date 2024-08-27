import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import RecoverIcon from './images/Recover.svg';

export default function Recover(props: SvgIconProps) {
  return <SvgIcon component={RecoverIcon} viewBox="0 0 34 34" {...props} />;
}
