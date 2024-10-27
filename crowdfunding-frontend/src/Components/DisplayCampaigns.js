import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import BN from 'bn.js'; // Use BN.js directly for BigNumber handling
import abi from '../CrowdFundingABI.json';

const contractAddress = "0xf7DA46d3Ba9605DBb3a14fA60a694cF60929C219";
const contractABI = abi;

const DisplayCampaign = ({ account }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [adminCampaigns, setAdminCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [donators, setDonators] = useState({});
  const [donationAmount, setDonationAmount] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateTarget, setUpdateTarget] = useState("");
  const [updateImage, setUpdateImage] = useState("");
  const [isOpenUpdateModal, setIsOpenUpdateModal] = useState(false);

  // Fetch campaigns using Web3
  const fetchCampaigns = async () => {
    try {
      const web3 = new Web3("https://polygon-amoy.infura.io/v3/3983dd17cf254e0ba2cfb9103ed87510");
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const campaignData = await contract.methods.getActiveCampaigns().call();
      setCampaigns(campaignData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns", error);
      setLoading(false);
    }
  };

  const handleUpdateCampaign = async () => {
    if (!selectedCampaign) return;
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      await contract.methods
        .updateCampaign(
          selectedCampaign,
          updateTitle,
          updateDescription,
          Web3.utils.toWei(updateTarget, 'ether'),
          updateImage
        )
        .send({ from: account });

      alert("Campaign updated successfully!");
      fetchCampaigns(); // Refresh the campaign list after updating
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Failed to update campaign");
    }
  };

  // Fetch admin campaigns
  const fetchAdminCampaigns = async () => {
    try {
      const web3 = new Web3("https://polygon-amoy.infura.io/v3/3983dd17cf254e0ba2cfb9103ed87510");
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const adminCampaignData = await contract.methods.getAdminCampaigns().call();
      setAdminCampaigns(adminCampaignData);
    } catch (error) {
      console.error("Error fetching admin campaigns", error);
    }
  };

  // Check if the user is an admin
  const checkIfAdmin = async () => {
    const web3 = new Web3("https://polygon-amoy.infura.io/v3/3983dd17cf254e0ba2cfb9103ed87510");
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const adminAddress = await contract.methods.admin().call();
    if (account && account.toLowerCase() === adminAddress.toLowerCase()) {
      setIsAdmin(true);
      fetchAdminCampaigns();
    }
  };

  useEffect(() => {
    fetchCampaigns();
    checkIfAdmin();
  }, [account]);

  // Fetch donators for a campaign
  const fetchDonators = async (campaignId) => {
    try {
      const web3 = new Web3("https://polygon-amoy.infura.io/v3/3983dd17cf254e0ba2cfb9103ed87510");
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const result = await contract.methods.getDonators(campaignId).call();
      const donatorAddresses = result[0];
      const donationAmounts = result[1];

      setDonators((prevDonators) => ({
        ...prevDonators,
        [campaignId]: { donatorAddresses, donationAmounts },
      }));
    } catch (error) {
      console.error("Error fetching donators", error);
    }
  };

  // Handle donation
  const handleDonate = async (campaignId) => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const amountInWei = Web3.utils.toWei(donationAmount, 'ether');

      await contract.methods.donateToCampaign(campaignId).send({
        from: account,
        value: amountInWei,
      });

      alert('Donation successful!');
    } catch (error) {
      console.error("Error donating to campaign", error);
      alert('Donation failed. Please try again.');
    }
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async (campaignId) => {
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      await contract.methods.deleteCampaign(campaignId).send({ from: account });
      alert("Campaign deleted successfully!");
      fetchCampaigns(); // Refresh the campaigns list
    } catch (error) {
      console.error("Error deleting campaign:", error);
      alert("Failed to delete campaign");
    }
  };

  // Separate campaigns into active and completed
  const activeCampaigns = campaigns.filter((campaign) => {
    return new BN(campaign.amountCollected).lt(new BN(campaign.target));
  });

  const completedCampaigns = campaigns.filter((campaign) => {
    return new BN(campaign.amountCollected).gte(new BN(campaign.target));
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Crowdfunding Campaigns</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : activeCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCampaigns.map((campaign, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img src={campaign.image} alt={campaign.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{campaign.title}</h3>
                <p className="text-gray-600 mb-3">{campaign.description}</p>

                {/* Updated Deadline Display */}
                <p className="text-gray-600 mb-3">
  Days Remaining: {campaign.deadline} {/* Directly display the number of days */}
</p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-600">Progress</span>
                    <span className="text-xs font-semibold text-blue-600">
                      {(parseFloat(Web3.utils.fromWei(campaign.amountCollected, 'ether')) /
                        parseFloat(Web3.utils.fromWei(campaign.target, 'ether')) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(parseFloat(Web3.utils.fromWei(campaign.amountCollected, 'ether')) /
                          parseFloat(Web3.utils.fromWei(campaign.target, 'ether')) * 100).toFixed(2)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Amount Collected and Target */}
                <p className="text-lg font-medium text-gray-800">
                  {Web3.utils.fromWei(campaign.amountCollected, 'ether')} ETH /{' '}
                  {Web3.utils.fromWei(campaign.target, 'ether')} ETH
                </p>

                {/* Donation Input */}
                <input
                  type="text"
                  placeholder="Amount in ETH"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="mt-3 w-full p-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 transition"
                />

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleDonate(index)}
                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
                  >
                    Donate
                  </button>
                  <button
                    onClick={() => fetchDonators(index)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                  >
                    Show Donators
                  </button>
                  <button
                    onClick={() => handleUpdateCampaign()}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(index)}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>

                {/* Donators List */}
                {donators[index] && (
                  <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <h4 className="text-lg font-semibold">Donators:</h4>
                    <ul>
                      {donators[index].donatorAddresses.map((donator, idx) => (
                        <li key={idx} className="text-sm">
                          {donator} - {Web3.utils.fromWei(donators[index].donationAmounts[idx], 'ether')} ETH
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-lg">No active campaigns available</div>
      )}
    </div>
  );
};

export default DisplayCampaign;
