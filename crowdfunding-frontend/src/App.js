import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './CrowdFundingABI.json';
import DisplayCampaigns from './Components/DisplayCampaigns';
import CreateCampaign from './Components/CreateCampaign';
import UserInfo from './Components/UserInfo'; // Import UserInfo Component

const contractAddress = "0xc6da8028f0B89afe9f5b3A45D1851bA1d027729d";

function App() {
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false); // Track connection status

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setSigner(provider.getSigner());
          setAccount(accounts[0]);
          const tempContract = new ethers.Contract(contractAddress, abi, provider.getSigner());
          setContract(tempContract);
          setIsConnected(true);
        }
      }
    };

    checkWalletConnection(); // Check if the wallet is already connected
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setSigner(provider.getSigner());
        setAccount(accounts[0]);
        const tempContract = new ethers.Contract(contractAddress, abi, provider.getSigner());
        setContract(tempContract);
        setIsConnected(true); // Update connection state
      } catch (err) {
        console.error("Error connecting to MetaMask:", err);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      <header className="bg-black p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Crowdfunding DApp</h1>
        
        {account ? (
          <UserInfo account={account} />
        ) : (
          <button 
            onClick={connectWallet} 
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Connect Wallet
          </button>
        )}
      </header>

      <main className="container mx-auto py-8 px-4">
        {isConnected ? (
          <>
            <DisplayCampaigns contract={contract} /> {/* Display campaigns when connected */}
            <CreateCampaign contract={contract} account={account} /> {/* Display create form when connected */}
          </>
        ) : (
          <p className="text-center text-lg">Please connect your wallet to view and create campaigns.</p>
        )}
      </main>

      <footer className="bg-black p-4 text-center">
        <p>© 2023 Crowdfunding DApp</p>
      </footer>
    </div>
  );
}

export default App;