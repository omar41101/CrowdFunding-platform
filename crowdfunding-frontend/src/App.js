import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './CrowdFundingABI.json'; // Load the ABI
import DisplayCampaigns from './Components/DisplayCampaigns'; // Display Campaigns Component

// Add this line to use Infura's Sepolia network
const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/3983dd17cf254e0ba2cfb9103ed87510');

// Replace with your actual contract address
const contractAddress = "0x0e0cd8477C4fc686b55451c393A71193067F8D55"; 

function App() {
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  // Connect to MetaMask and get the provider
  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
          setSigner(tempProvider.getSigner());

          const accounts = await tempProvider.send("eth_requestAccounts", []);
          setAccount(accounts[0]);

          const tempContract = new ethers.Contract(contractAddress, abi, tempProvider.getSigner());
          setContract(tempContract);
        } catch (err) {
          console.error("Error connecting to MetaMask:", err);
        }
      } else {
        console.error("MetaMask is not installed!");
      }
    };

    connectWallet();
  }, []);

  // Function to create a new campaign
  const createCampaign = async (title, description, target, deadline, image) => {
    try {
      const deadlineDate = new Date(deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000); // Convert to Unix timestamp

      const tx = await contract.createCampaign(
        account,
        title,
        description,
        ethers.utils.parseEther(target),  // Convert target to Wei
        deadlineTimestamp,                // Pass Unix timestamp for deadline
        image
      );
      await tx.wait();
      console.log("Campaign created!");
    } catch (error) {
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div>
      <h1>Crowdfunding DApp</h1>
      <h2>Connected Account: {account}</h2>

      {/* Fetch and display campaigns */}
      {provider && <DisplayCampaigns provider={provider} />}

      {/* Form to create a new campaign */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const { title, description, target, deadline, image } = e.target.elements;
        createCampaign(title.value, description.value, target.value, deadline.value, image.value);
      }}>
        <input name="title" placeholder="Title" required />
        <input name="description" placeholder="Description" required />
        <input name="target" placeholder="Target (ETH)" required />
        <input name="deadline" type="date" placeholder="Deadline" required />
        <input name="image" placeholder="Image URL" />
        <button type="submit">Create Campaign</button>
      </form>
    </div>
  );
}

export default App;
