import { Connection, ServiceConnectionName } from '@gold-network/api';
import { useGetWalletConnectionsQuery } from '@gold-network/api-react';
import { Card, FormatBytes, IconButton, Loading, Table, useOpenDialog } from '@gold-network/core';
import { Trans } from '@lingui/macro';
import { Delete as DeleteIcon } from '@mui/icons-material';
import {Button, Tooltip} from '@mui/material';
import React from 'react';
import styled from "styled-components";

import WalletAddConnection from "./WalletAddConnection";
import WalletCloseConnection from "./WalletCloseConnection";


const StyledIconButton = styled(IconButton)`
  padding: 0.2rem;
`;

const cols = [
  {
    minWidth: '200px',
    field(row: Connection) {
      return (
        <Tooltip title={row.nodeId}>
          <span>{row.nodeId}</span>
        </Tooltip>
      );
    },
    title: <Trans>Node ID</Trans>,
  },
  {
    field: 'peerHost',
    title: <Trans>IP address</Trans>,
  },
  {
    field(row: Connection) {
      return `${row.peerPort}/${row.peerServerPort}`;
    },
    title: <Trans>Port</Trans>,
  },
  {
    field(row: Connection) {
      return (
        <>
          <FormatBytes value={row.bytesWritten} unit="MiB" removeUnit fixedDecimals />
          /
          <FormatBytes value={row.bytesRead} unit="MiB" removeUnit fixedDecimals />
        </>
      );
    },
    title: <Trans>MiB Up/Down</Trans>,
  },
  {
    field(row: Connection) {
      // @ts-ignore
      return ServiceConnectionName[row.type];
    },
    title: <Trans>Connection type</Trans>,
  },
  {
    title: <Trans>Actions</Trans>,
    field(row: Connection) {
      return (
        <WalletCloseConnection nodeId={row.nodeId}>
          {({ onClose }) => (
            <StyledIconButton onClick={onClose}>
              <DeleteIcon color="info" />
            </StyledIconButton>
          )}
        </WalletCloseConnection>
      );
    },
  },
];

export type WalletConnectionsProps = {
  walletId: number;
};

export default function WalletConnections(props: WalletConnectionsProps) {
  const openDialog = useOpenDialog();
  const { walletId } = props;
  const { data: connections, isLoading } = useGetWalletConnectionsQuery(
    {
      walletId,
    },
    {
      pollingInterval: 10_000,
    },
  );

  function handleAddPeer() {
    openDialog(<WalletAddConnection />);
  }

  return (
    <Card title={<Trans>Wallet Connections</Trans>}
      action={
        <Button onClick={handleAddPeer} variant="outlined">
          <Trans>Connect to other peers</Trans>
        </Button>
      }>
      {isLoading ? (
        <Loading center />
      ) : !connections?.length ? (
        <Trans>List of connections is empty</Trans>
      ) : (
        <Table cols={cols} rows={connections} />
      )}
    </Card>
  );
}
