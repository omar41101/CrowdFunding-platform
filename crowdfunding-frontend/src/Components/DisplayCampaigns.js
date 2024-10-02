import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import abi from '../CrowdFundingABI.json';
import './DisplayCampaign.css'; // Assuming you'll add custom styles here

const contractAddress = "0x0e0cd8477C4fc686b55451c393A71193067F8D55";
const contractABI = abi;

const DisplayCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donators, setDonators] = useState({});
  const [selectedCampaignId, setSelectedCampaignId] = useState(null); // Track selected campaign for donation

  const [donationAmount, setDonationAmount] = useState(""); // For storing the input donation amount

  // Fetch campaigns using Web3
  const fetchCampaigns = async () => {
    try {
      const web3 = new Web3("https://sepolia.infura.io/v3/3983dd17cf254e0ba2cfb9103ed87510");
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const campaignData = await contract.methods.getCampaigns().call();
      setCampaigns(campaignData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching campaigns", error);
      setLoading(false);
    }
  };

  const fetchDonators = async (campaignId) => {
    try {
      const web3 = new Web3("https://sepolia.infura.io/v3/3983dd17cf254e0ba2cfb9103ed87510");
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      
      const result = await contract.methods.getDonators(campaignId).call();
      
      // Assuming the result is an object where 0 is donatorAddresses and 1 is donationAmounts
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

  // Handle the donation
  const handleDonate = async (campaignId) => {
    try {
      const web3 = new Web3(window.ethereum); // Connect to MetaMask
      await window.ethereum.enable(); // Request MetaMask access

      const contract = new web3.eth.Contract(contractABI, contractAddress);

      const accounts = await web3.eth.getAccounts(); // Get the user's account
      const account = accounts[0];

      const amountInWei = Web3.utils.toWei(donationAmount, 'ether'); // Convert donation amount to Wei

      // Call the donateToCampaign method from the contract
      await contract.methods.donateToCampaign(campaignId).send({
        from: account,
        value: amountInWei
      });

      alert('Donation successful!');
    } catch (error) {
      console.error("Error donating to campaign", error);
      alert('Donation failed. Please try again.');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

   return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">
        Available Campaigns
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
        </div>
      ) : campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700"
            >
              <img
                src={campaign.image}
                alt={campaign.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{campaign.title}</h3>
                <p className="text-gray-700 mb-4 dark:text-gray-300">{campaign.description}</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Target: {Web3.utils.fromWei(campaign.target, 'ether')} ETH
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  Collected: {Web3.utils.fromWei(campaign.amountCollected, 'ether')} ETH
                </p>
                {/* Donation Input */}
                <input
                  type="text"
                  placeholder="Amount in ETH"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="mt-4 w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={() => handleDonate(index)}
                  className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  Donate Now
                </button>
                {/* Show Donators */}
                <button
                  onClick={() => fetchDonators(index)}
                  className="mt-4 w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  Show Donators
                </button>
                {/* Donators List */}
                {donators[index] && (
                  <div className="mt-4 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <h4 className="text-lg font-semibold dark:text-white">Donators:</h4>
                    <ul>
                      {donators[index].donatorAddresses.map((donator, idx) => (
                        <li key={idx} className="text-sm dark:text-gray-300">
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
        <div className="text-center text-lg text-gray-600 dark:text-gray-300">
          No campaigns available
        </div>
      )}
    </div>
  );
};

export default DisplayCampaign;
