import {
  useGetSyncStatusQuery,
  useStakeFromMutation,
} from '@gold-network/api-react';
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
import { useForm } from "react-hook-form";
import isNumeric from "validator/es/lib/isNumeric";

import useWallet from '../../hooks/useWallet';
import CreateWalletSendTransactionResultDialog from "../WalletSendTransactionResultDialog";


type StakeFromProps = {
  walletId: number;
  stakeBalance: string;
};

type StakeFromData = {
  fee: string;
  amount: string;
  address: string;
};

export default function StakeFrom(props: StakeFromProps) {
  const { walletId, stakeBalance } = props;
  const [submissionCount, setSubmissionCount] = React.useState(0);
  const methods = useForm<StakeFromData>({
    defaultValues: {
      amount: stakeBalance,
      fee: '',
      address: '',
    },
  });
  const openDialog = useOpenDialog();
  const [stakeFrom, { isLoading: isStakeFromLoading }] = useStakeFromMutation();
  const { data: walletState, isLoading: isWalletSyncLoading } = useGetSyncStatusQuery(
    {},{
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


  async function handleSubmit(data: StakeFromData) {
    if (isStakeFromLoading) {
      return;
    }

    if (syncing) {
      throw new Error(t`Please finish syncing before making a transaction`);
    }
    const amount = data.amount.trim() || '0';
    if (!isNumeric(amount)) {
      throw new Error(t`Please enter a valid numeric amount`);
    }
    const fee = data.fee.trim() || '0';
    if (!isNumeric(fee)) {
      throw new Error(t`Please enter a valid numeric fee`);
    }
    const { address } = data;

    const response = await stakeFrom({
      walletId,
      amount: goldToMojo(amount),
      fee,
      address,
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
          <Trans>Withdraw</Trans>
          &nbsp;
          <TooltipIcon>
            <Trans>Amount 0 will withdraw all stake</Trans>
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
                  label={<Trans>Address</Trans>}
                  data-testid="stakeFrom-address"
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
                  data-testid="stakeFrom-amount"
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
                  data-testid="stakeFrom-fee"
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
            loading={isStakeFromLoading}
            data-testid="WalletSend-send"
          >
            <Trans>Withdraw</Trans>
          </ButtonLoading>
        </Flex>
      </Flex>
    </Form>
  );
}
