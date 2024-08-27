import type { NFTInfo } from '@gold-network/api';
import { useHiddenList } from '@gold-network/core';
import { useCallback } from 'react';

export default function useHiddenNFTs() {
  const [isNFTHidden, setIsNFTHidden, hiddenNFTs, setIsNFTMultipleHidden] = useHiddenList<NFTInfo['$nftId']>('nfts');

  const handleSetIsHidden = useCallback(
    (nftId: string, isHidden: boolean) => {
      setIsNFTHidden(nftId, isHidden);
    },
    [setIsNFTHidden],
  );

  const handleIsNFTHidden = useCallback((nftId: string) => isNFTHidden(nftId), [isNFTHidden]);
  const setHiddenMultiple = useCallback(
    (nftIds: string[], hide: boolean) => {
      setIsNFTMultipleHidden(nftIds, hide);
    },
    [setIsNFTMultipleHidden],
  );

  return [handleIsNFTHidden, handleSetIsHidden, hiddenNFTs, setHiddenMultiple];
}
