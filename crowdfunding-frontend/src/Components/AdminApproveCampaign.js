import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const AdminApproveCampaign = ({ contract, account }) => {
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false); // State to track approval process

  const fetchAdminCampaigns = async () => {
    if (contract) {
      try {
        const campaigns = await contract.getAdminCampaigns(); // Call the new function
        setAdminCampaigns(campaigns);
      } catch (error) {
        console.error("Error fetching admin campaigns:", error);
        alert("Failed to fetch admin campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const approveCampaign = async (campaignId) => {
    try {
      setApproving(true); // Start approval process
      const tx = await contract.approveCampaign(campaignId);
      await tx.wait();
      alert("Campaign approved successfully!");
      fetchAdminCampaigns(); // Refresh the list after approval
    } catch (error) {
      console.error("Error approving campaign:", error);
      alert("Failed to approve campaign. Please try again.");
    } finally {
      setApproving(false); // End approval process
    }
  };

  useEffect(() => {
    if (contract) {
      // Fetch admin campaigns initially
      fetchAdminCampaigns();
    }
  }, [contract]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Pending Campaigns</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : adminCampaigns.length > 0 ? (
        adminCampaigns.map((campaign, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <h3 className="text-lg font-semibold">{campaign.title}</h3>
            <p>{campaign.description}</p>
            <p>Target: {ethers.utils.formatEther(campaign.target)} ETH</p>
            <p>Amount Collected: {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>
            <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
            <p>Owner: {campaign.owner}</p>
            <button
              onClick={() => approveCampaign(index)}
              disabled={approving}
              className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 ${approving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {approving ? 'Approving...' : 'Approve'}
            </button>
          </div>
        ))
      ) : (
        <p>No pending campaigns available</p>
      )}
    </div>
  );
};

export default AdminApproveCampaign;
