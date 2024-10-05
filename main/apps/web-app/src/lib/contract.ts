import { ethers } from 'ethers'
import GOVERNANCE_ADDRESS from '@/lib/abi/CommunityUnion.json';

export const GOVERNANCE_ADDRESS = '0x07Bf0C7c2168647642f1E9fb4076cdEF0aDb4D6D';
export const COMMUNITY_UNION_ADDRESS = '0x87D7E59a37261c3438a70F769B7b2DB5A79Fb927';

// OwnerWallet = 0xBB79D409D53E7E0bE4E412465dEBee16A7E208f2;

export function getGoveranceContract(provider: ethers.providers.Web3Provider) {
    return new ethers.Contract(GOVERNANCE_ADDRESS, COMMUNITY_UNION.abi, provider.getSigner());
}

export function getCommunityUnionContract(provider: ethers.providers.Web3Provider) {
    return new ethers.Contract(COMMUNITY_UNION_ADDRESS, COMMUNITY_UNION.abi, provider.getSigner());
}