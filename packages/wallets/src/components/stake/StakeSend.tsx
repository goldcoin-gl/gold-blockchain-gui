import {
  useGetSyncStatusQuery,
  useSendTransactionMutation,
} from "@gold-network/api-react";
import {
  Amount,
  ButtonLoading,
  Form,
  Flex,
  Card,
  useOpenDialog,
  goldToMojo,
  getTransactionResult,
  TooltipIcon,
  EstimatedFee,
  FeeTxType,
  TextField,
} from '@gold-network/core';
import { Trans, t } from '@lingui/macro';
import { Grid, Typography } from "@mui/material";
import React from 'react';
import { useForm } from 'react-hook-form';
import isNumeric from 'validator/es/lib/isNumeric';

import useWallet from '../../hooks/useWallet';
import CreateWalletSendTransactionResultDialog from '../WalletSendTransactionResultDialog';


type StakeSendProps = {
  walletId: number;
  stakeAddress: string;
};

type StakeSendData = {
  address: string;
  amount: string;
  fee: string;
};

export default function StakeSend(props: StakeSendProps) {
  const { walletId, stakeAddress } = props;

  const [submissionCount, setSubmissionCount] = React.useState(0);
  const methods = useForm<StakeSendData>({
    defaultValues: {
      address: stakeAddress,
      amount: '',
      fee: '',
    },
  });
  const openDialog = useOpenDialog();
  const [stakeSend, { isLoading: isStakeSendLoading }] = useSendTransactionMutation();
  const { data: walletState, isLoading: isWalletSyncLoading } = useGetSyncStatusQuery(
  {}, {
    pollingInterval: 10_000,
  });
  const {
    formState: { isSubmitting },
  } = methods;

  const { wallet } = useWallet(walletId);

  if (!wallet || isWalletSyncLoading) {
    return null;
  }
  const syncing = !!walletState?.syncing;


  async function handleSubmit(data: StakeSendData) {
    if (isStakeSendLoading) {
      return;
    }

    if (syncing) {
      throw new Error(t`Please finish syncing before making a transaction`);
    }

    const amount = data.amount.trim();
    if (!isNumeric(amount)) {
      throw new Error(t`Please enter a valid numeric amount`);
    }
    const fee = data.fee.trim() || '0';
    if (!isNumeric(fee)) {
      throw new Error(t`Please enter a valid numeric fee`);
    }
    const  {address} = data;
    const response = await stakeSend({
      walletId,
      address,
      amount: goldToMojo(amount),
      fee: goldToMojo(fee),
      waitForConfirmation: true,
    }).unwrap();

    const result = getTransactionResult(response.transaction);
    const resultDialog = CreateWalletSendTransactionResultDialog({
      success: result.success,
      message: result.message,
    });

    if (resultDialog) {
      await openDialog(resultDialog);
    } else {
      throw new Error(result.message ?? 'Something went wrong');
    }

    methods.reset();
    setSubmissionCount((prev) => prev + 1);
  }

  return (
    <Form methods={methods} key={submissionCount} onSubmit={handleSubmit}>
      <Flex gap={2} flexDirection="column">
        <Typography variant="h6">
          <Trans>Stake</Trans>
          &nbsp;
          <TooltipIcon>
            <Trans>Stake will make farming GL easier.</Trans>
          </TooltipIcon>
        </Typography>
        <Card>
          <Grid spacing={2} container>
              <Grid xs={12} item>
                <TextField
                  variant="filled"
                  color="secondary"
                  name="address"
                  autoComplete="off"
                  disabled={isSubmitting}
                  label={<Trans>Stake Address</Trans>}
                  data-testid="stakeSend-address"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6} item>
                <Amount
                  id="filled-secondary"
                  variant="filled"
                  color="secondary"
                  name="amount"
                  disabled={isSubmitting}
                  label={<Trans>Amount</Trans>}
                  data-testid="stakeSend-amount"
                  fullWidth
                />
              </Grid>
              <Grid xs={12} md={6} item>
                <EstimatedFee
                  id="filled-secondary"
                  variant="filled"
                  name="fee"
                  color="secondary"
                  disabled={isSubmitting}
                  label={<Trans>Fee</Trans>}
                  data-testid="stakeSend-fee"
                  fullWidth
                  txType={FeeTxType.walletSendGL}
                />
              </Grid>
            </Grid>
        </Card>
        <Flex justifyContent="flex-end" gap={1}>
          <ButtonLoading
            variant="contained"
            color="primary"
            type="submit"
            loading={isStakeSendLoading}
            data-testid="WalletSend-send"
          >
            <Trans>Stake</Trans>
          </ButtonLoading>
        </Flex>
      </Flex>
    </Form>
  );
}
