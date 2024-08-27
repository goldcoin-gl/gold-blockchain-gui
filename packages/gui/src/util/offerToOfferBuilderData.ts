import { OfferSummaryRecord, type OfferSummaryCATInfo } from '@gold-network/api';
import { mojoToCAT, mojoToGold } from '@gold-network/core';
import BigNumber from 'bignumber.js';

import type OfferBuilderData from '../@types/OfferBuilderData';
import type OfferSummary from '../@types/OfferSummary';

import { launcherIdToNFTId } from './nfts';

export default function offerToOfferBuilderData(
  offerSummary: OfferSummary | OfferSummaryRecord,
  setDefaultOfferedFee?: boolean,
  defaultFee?: string, // in mojos
): OfferBuilderData {
  const { fees, offered, requested, infos } = offerSummary;

  const defaultFeeGL = defaultFee ? mojoToGold(defaultFee).toFixed() : '';

  const offeredXch: OfferBuilderData['offered']['gl'] = [];
  const offeredTokens: OfferBuilderData['offered']['tokens'] = [];
  const offeredNfts: OfferBuilderData['offered']['nfts'] = [];
  const offeredFee: OfferBuilderData['offered']['fee'] = setDefaultOfferedFee ? [{ amount: defaultFeeGL }] : [];
  const requestedXch: OfferBuilderData['requested']['gl'] = [];
  const requestedTokens: OfferBuilderData['requested']['tokens'] = [];
  const requestedNfts: OfferBuilderData['requested']['nfts'] = [];

  // processing requested first because it's what you/we will give

  Object.keys(requested).forEach((id) => {
    const amount = new BigNumber(requested[id]);
    const info = infos[id];

    if (info?.type === 'CAT') {
      const crCat = extractCrCatData(info);
      offeredTokens.push({
        amount: mojoToCAT(amount).toFixed(),
        assetId: id,
        crCat,
      });
    } else if (info?.type === 'singleton') {
      offeredNfts.push({
        nftId: launcherIdToNFTId(info.launcherId),
      });
    } else if (id === 'gl') {
      offeredXch.push({
        amount: mojoToGold(amount).toFixed(),
      });
    }
  });

  Object.keys(offered).forEach((id) => {
    const amount = new BigNumber(offered[id]);
    const info = infos[id];

    if (info?.type === 'CAT') {
      const crCat = extractCrCatData(info);
      requestedTokens.push({
        amount: mojoToCAT(amount).toFixed(),
        assetId: id,
        crCat,
      });
    } else if (info?.type === 'singleton') {
      requestedNfts.push({
        nftId: launcherIdToNFTId(info.launcherId),
      });
    } else if (id === 'gl') {
      requestedXch.push({
        amount: mojoToGold(amount).toFixed(),
      });
    }
  });

  return {
    offered: {
      gl: offeredXch,
      tokens: offeredTokens,
      nfts: offeredNfts,
      fee: offeredFee,
    },
    requested: {
      gl: requestedXch,
      tokens: requestedTokens,
      nfts: requestedNfts,
      fee: [
        {
          amount: mojoToGold(fees).toFixed(),
        },
      ],
    },
  };
}

function extractCrCatData(info: OfferSummaryCATInfo) {
  if (!info.also) return undefined;
  if (info.also.type !== 'credential restricted') return undefined;
  const { flags, authorizedProviders } = info.also;
  return {
    flags,
    authorizedProviders,
  };
}
