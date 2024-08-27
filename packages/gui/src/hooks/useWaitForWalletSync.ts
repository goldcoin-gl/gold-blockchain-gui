import { SyncingStatus } from '@gold-network/api';
import { useWalletState } from '@gold-network/wallets';
import { useCallback, useState, useRef, useEffect } from 'react';

export default function useWaitForWalletSync() {
  const { state } = useWalletState();
  const [, setAfterSync] = useState<(() => void)[]>([]);

  const isSynced = state === SyncingStatus.SYNCED;
  const syncedRef = useRef(isSynced);
  syncedRef.current = isSynced;

  useEffect(() => {
    if (isSynced) {
      setAfterSync((prev) => {
        prev.forEach((resolve) => resolve());
        return [];
      });
    }
  }, [isSynced]);

  const wait = useCallback(() => {
    if (syncedRef.current) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      setAfterSync((prev) => [...prev, resolve]);
    });
  }, []);

  return wait;
}
