import React from 'react';
import { ethers } from 'ethers';

const CampaignCard = ({ campaign }) => {
  return (
    <div className="campaign-card bg-white p-4 rounded shadow-md">
      <h2 className="text-lg font-semibold">{campaign.title}</h2>
      <p>{campaign.description}</p>
      <p>Goal: {ethers.utils.formatEther(campaign.target)} ETH</p>
      <p>Collected: {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>
      <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
    </div>
  );
};

export default CampaignCard;
