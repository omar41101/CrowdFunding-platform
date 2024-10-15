import BN from 'bn.js';

// Example:
// Assuming campaign is fetched from the contract and has the properties as BN instances
const isCompleted = new BN(campaign.amountCollected).gte(new BN(campaign.target));
