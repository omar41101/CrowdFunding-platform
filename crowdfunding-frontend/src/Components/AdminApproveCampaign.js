import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const AdminApproveCampaign = ({ contract, account }) => {
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [loadingActive, setLoadingActive] = useState(true);
  const [approving, setApproving] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchAdminCampaigns = async () => {
    if (contract) {
      try {
        setLoadingAdmin(true);
        const campaigns = await contract.getAdminCampaigns();
        setAdminCampaigns(campaigns);
      } catch (error) {
        console.error("Error fetching admin campaigns:", error);
        alert("Failed to fetch admin campaigns. Please try again later.");
      } finally {
        setLoadingAdmin(false);
      }
    }
  };

  const fetchActiveCampaigns = async () => {
    if (contract) {
      try {
        setLoadingActive(true);
        const campaigns = await contract.getActiveCampaigns();
        setActiveCampaigns(campaigns);
      } catch (error) {
        console.error("Error fetching active campaigns:", error);
        alert("Failed to fetch active campaigns.");
      } finally {
        setLoadingActive(false);
      }
    }
  };

  const withdrawFunds = async (campaignId) => {
    try {
      setWithdrawing(true);
      const tx = await contract.withdrawFunds(campaignId);
      await tx.wait();
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error("Error withdrawing funds:", error);
      alert("Withdrawal failed. Please try again.");
    } finally {
      setWithdrawing(false);
    }
  };

  const approveCampaign = async (campaignId) => {
    try {
      setApproving(true);
      const tx = await contract.approveCampaign(campaignId);
      await tx.wait();
      alert("Campaign approved successfully!");
      fetchAdminCampaigns();
    } catch (error) {
      console.error("Error approving campaign:", error);
      alert("Failed to approve campaign.");
    } finally {
      setApproving(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchAdminCampaigns();
      fetchActiveCampaigns();
    }
  }, [contract]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 dark:text-white">Admin Dashboard</h1>

      {/* Pending Approval Campaigns Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-500">Pending Approval Campaigns</h2>
        {loadingAdmin ? (
          <p className="text-center">Loading pending campaigns...</p>
        ) : adminCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {adminCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <img src={campaign.image} alt={campaign.title} className="h-48 w-full object-cover rounded-lg mb-4" />
                <h3 className="text-2xl font-semibold mb-2 dark:text-white">{campaign.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{campaign.description}</p>
                
                {/* Ensure amountCollected and target are converted properly */}
                <p className="text-gray-900 dark:text-white">Target: {ethers.utils.formatEther(campaign.target.toString())} ETH</p>
                <p className="text-gray-900 dark:text-white">Collected: {ethers.utils.formatEther(campaign.amountCollected.toString())} ETH</p>
                
                <p className="text-gray-600 dark:text-gray-400">Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400">Owner: {campaign.owner}</p>
                <button
                  onClick={() => approveCampaign(index)}
                  disabled={approving}
                  className={`mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors ${approving ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {approving ? 'Approving...' : 'Approve Campaign'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No pending campaigns available</p>
        )}
      </div>

      {/* Active Campaigns Section */}
      <div>
        <h2 className="text-3xl font-semibold mb-4 text-center text-blue-500">Available Campaigns</h2>
        {loadingActive ? (
          <p className="text-center">Loading active campaigns...</p>
        ) : activeCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <img src={campaign.image} alt={campaign.title} className="h-48 w-full object-cover rounded-lg mb-4" />
                <h3 className="text-2xl font-semibold mb-2 dark:text-white">{campaign.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{campaign.description}</p>
                
                {/* Ensure amountCollected and target are converted properly */}
                <p className="text-gray-900 dark:text-white">Target: {ethers.utils.formatEther(campaign.target.toString())} ETH</p>
                <p className="text-gray-900 dark:text-white">Collected: {ethers.utils.formatEther(campaign.amountCollected.toString())} ETH</p>
                
                <p className="text-gray-600 dark:text-gray-400">Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400">Owner: {campaign.owner}</p>

                {/* Show Withdraw button for completed campaigns */}
                {ethers.BigNumber.from(campaign.amountCollected).gte(ethers.BigNumber.from(campaign.target)) && (
                  <button
                    onClick={() => withdrawFunds(index)}
                    disabled={withdrawing}
                    className={`mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors ${withdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {withdrawing ? 'Withdrawing...' : 'Withdraw Funds'}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No active campaigns available</p>
        )}
      </div>
    </div>
  );
};

export default AdminApproveCampaign;
