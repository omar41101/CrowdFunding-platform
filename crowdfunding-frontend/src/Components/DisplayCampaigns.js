import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import BN from 'bn.js'; // Use BN.js directly for BigNumber handling
import abi from '../CrowdFundingABI.json';
import './DisplayCampaign.css';

const contractAddress = "0x52C2CfCe16b112668ab1Fd2D350B0efBc86D2103";
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

  // Handle campaign update
  const handleUpdateCampaign = async () => {
    if (!selectedCampaign) return;
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      await contract.methods.updateCampaign(
        selectedCampaign,
        updateTitle,
        updateDescription,
        Web3.utils.toWei(updateTarget, 'ether'),
        updateImage
      ).send({ from: account });

      alert("Campaign updated successfully!");
      setIsOpenUpdateModal(false);
      fetchCampaigns(); // Refresh the campaigns list
    } catch (error) {
      console.error("Error updating campaign:", error);
      alert("Failed to update campaign");
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Crowdfunding Campaigns</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : activeCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCampaigns.map((campaign, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <img src={campaign.image} alt={campaign.title} className="h-48 w-full object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-2 text-gray-900">{campaign.title}</h3>
                <p className="text-gray-700 mb-4">{campaign.description}</p>

                {/* Progress Bar */}
                <div className="relative pt-1 mb-4">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                        Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-blue-600">
                        {(parseFloat(Web3.utils.fromWei(campaign.amountCollected, 'ether')) / parseFloat(Web3.utils.fromWei(campaign.target, 'ether')) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                    <div
                      style={{
                        width: `${(parseFloat(Web3.utils.fromWei(campaign.amountCollected, 'ether')) / parseFloat(Web3.utils.fromWei(campaign.target, 'ether')) * 100).toFixed(2)}%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                    ></div>
                  </div>
                </div>

                {/* Amount Collected and Target */}
                <p className="text-lg font-medium text-gray-900">
                  {Web3.utils.fromWei(campaign.amountCollected, 'ether')} ETH / {Web3.utils.fromWei(campaign.target, 'ether')} ETH
                </p>

                {/* Donation Input */}
                <input
                  type="text"
                  placeholder="Amount in ETH"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="mt-4 w-full p-2 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 transition-colors"
                />

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleDonate(index)}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    Donate
                  </button>
                  <button
                    onClick={() => fetchDonators(index)}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    Show Donators
                  </button>
                  <button
                    onClick={() => handleUpdateCampaign()}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(index)}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
                  >
                    Delete
                  </button>
                </div>

                {/* Donators List */}
                {donators[index] && (
                  <div className="mt-4 p-4 bg-gray-200 rounded-lg">
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
