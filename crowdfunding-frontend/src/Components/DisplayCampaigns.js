import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import abi from '../CrowdFundingABI.json';
import './DisplayCampaign.css'; // Assuming you'll add custom styles here

const contractAddress = "0x0e0cd8477C4fc686b55451c393A71193067F8D55";
const contractABI = abi;

const DisplayCampaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="campaign-container">
      <h1 className="campaign-title">Available Campaigns</h1>
      {loading ? (
        <div className="loading-spinner">Loading campaigns...</div>
      ) : campaigns.length > 0 ? (
        <div className="campaign-grid">
          {campaigns.map((campaign, index) => (
            <div className="campaign-card" key={index}>
              <img src={campaign.image} alt={campaign.title} className="campaign-image"/>
              <div className="campaign-content">
                <h3>{campaign.title}</h3>
                <p>{campaign.description}</p>
                <p><strong>Target:</strong> {Web3.utils.fromWei(campaign.target, "ether")} ETH</p>
                <p><strong>Collected:</strong> {Web3.utils.fromWei(campaign.amountCollected, "ether")} ETH</p>
                <button className="donate-button">Donate Now</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No campaigns available</div>
      )}
    </div>
  );
};

export default DisplayCampaign;
