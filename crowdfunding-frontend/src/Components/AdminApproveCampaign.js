import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3'; // Import Web3 for interacting with blockchain

const AdminApproveCampaign = ({ contract, account }) => {
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [loadingActive, setLoadingActive] = useState(true);
  const [approving, setApproving] = useState(false); // State to track approval process

  // Function to fetch pending admin campaigns (those awaiting approval)
  const fetchAdminCampaigns = async () => {
    if (contract) {
      try {
        setLoadingAdmin(true);
        const campaigns = await contract.getAdminCampaigns(); // Call the contract method to get admin campaigns
        setAdminCampaigns(campaigns);
      } catch (error) {
        console.error("Error fetching admin campaigns:", error);
        alert("Failed to fetch admin campaigns. Please try again later.");
      } finally {
        setLoadingAdmin(false);
      }
    }
  };

  // Function to fetch active (approved) campaigns
  const fetchActiveCampaigns = async () => {
    if (contract) {
      try {
        setLoadingActive(true);
        const campaigns = await contract.getActiveCampaigns(); // Call the contract method to get active campaigns
        setActiveCampaigns(campaigns);
      } catch (error) {
        console.error("Error fetching active campaigns:", error);
        alert("Failed to fetch active campaigns. Please try again.");
      } finally {
        setLoadingActive(false);
      }
    }
  };

  // Function to approve a campaign by its ID
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

  // Fetch campaigns when the component loads
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
                <p className="text-gray-900 dark:text-white">Target: {ethers.utils.formatEther(campaign.target)} ETH</p>
                <p className="text-gray-900 dark:text-white">Collected: {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>
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
                <p className="text-gray-900 dark:text-white">Target: {ethers.utils.formatEther(campaign.target)} ETH</p>
                <p className="text-gray-900 dark:text-white">Collected: {ethers.utils.formatEther(campaign.amountCollected)} ETH</p>
                <p className="text-gray-600 dark:text-gray-400">Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
                <p className="text-gray-600 dark:text-gray-400">Owner: {campaign.owner}</p>
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
