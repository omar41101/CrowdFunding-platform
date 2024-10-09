import BN from 'bn.js';

// Example:
const isCompleted = new BN(campaign.amountCollected).gte(new BN(campaign.target));
