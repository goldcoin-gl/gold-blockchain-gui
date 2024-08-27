import {
  useStakeInfoQuery,
  useGetLoggedInFingerprintQuery,
} from '@gold-network/api-react';
import {
  Loading,
  Flex,
  LayoutDashboardSub,
  Card,
  CopyToClipboard,
  useCurrencyCode,
  mojoToGoldLocaleString,
  useLocale,
} from '@gold-network/core';
import { Trans } from '@lingui/macro';
import { TextField, Typography, InputAdornment, Grid } from "@mui/material";
import React from 'react';

import StakeFrom from "./StakeFrom";
import StakeSend from "./StakeSend";


export default function Stake() {
  const currencyCode = useCurrencyCode();
  const [locale] = useLocale();
  const { data: stakeInfo, isLoading: isLoadingStakingInfo } = useStakeInfoQuery({
    source: "",
  },{
    pollingInterval: 10_000,
  });

  if (isLoadingStakingInfo) {
    return null;
  }
  const balance = mojoToGoldLocaleString(stakeInfo?.balance, locale);
  const address = stakeInfo?.address || '';

  return (
    <LayoutDashboardSub>
      <Flex flexDirection="column" gap={3}>
        <Typography variant="h5">
          <Trans>Stake Info</Trans>
        </Typography>
        <Flex gap={2} flexDirection="column">
          <Card>
            {isLoadingStakingInfo ? (
              <Loading center />
            ) : (
            <Grid spacing={2} container>
              <Grid xs={12} md={4}  item>
                <TextField
                  label={<Trans>Stake Balance</Trans>}
                  value={balance}
                  variant="filled"
                  inputProps={{
                    'data-testid': 'WalletStakingAddress-balance',
                    readOnly: true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">{currencyCode}</InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={8} item>
              <TextField
                label={<Trans>Stake Address</Trans>}
                value={address}
                variant="filled"
                inputProps={{
                  'data-testid': 'WalletStakingAddress-address',
                  readOnly: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CopyToClipboard
                        value={address}
                        data-testid="WalletStakingAddress-address-copy"
                      />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
              </Grid>
            </Grid>
            )}
          </Card>
          <StakeSend walletId={1} stakeAddress={address}/>
          <StakeFrom walletId={1} stakeBalance={balance} />
        </Flex>
      </Flex>
    </LayoutDashboardSub>
  );
}
