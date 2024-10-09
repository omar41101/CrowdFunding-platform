import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const AdminApproveCampaign = ({ contract }) => {
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingCampaigns = async () => {
    if (contract) {
      try {
        const campaigns = await contract.methods.getPendingCampaigns().call();
        setPendingCampaigns(campaigns);
      } catch (error) {
        console.error("Error fetching pending campaigns:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const approveCampaign = async (campaignId) => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      await contract.methods.approveCampaign(campaignId).send({ from: accounts[0] });
      alert("Campaign approved successfully!");
      fetchPendingCampaigns(); // Refresh the list after approval
    } catch (error) {
      console.error("Error approving campaign:", error);
      alert("Failed to approve campaign");
    }
  };

  useEffect(() => {
    if (contract) {
      // Fetch pending campaigns initially
      fetchPendingCampaigns();

      // Set up event listener for CampaignCreated event
      const onCampaignCreated = () => {
        fetchPendingCampaigns(); // Fetch pending campaigns when the event is emitted
      };

      // Subscribe to the CampaignCreated event
      contract.events.CampaignCreated({}, (error, event) => {
        if (error) {
          console.error(error);
          return;
        }
        onCampaignCreated(); // Call the fetch function on event
      });

      // Clean up the event listener on component unmount
      return () => {
        contract.events.CampaignCreated().off();
      };
    }
  }, [contract]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Pending Campaigns</h2>
      {loading ? (
        <p>Loading...</p>
      ) : pendingCampaigns.length > 0 ? (
        pendingCampaigns.map((campaign, index) => (
          <div key={index} className="border p-4 mb-4 rounded">
            <h3 className="text-lg">{campaign.title}</h3>
            <p>{campaign.description}</p>
            <p>Target: {Web3.utils.fromWei(campaign.target, 'ether')} ETH</p>
            <button
              onClick={() => approveCampaign(index)}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Approve
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
