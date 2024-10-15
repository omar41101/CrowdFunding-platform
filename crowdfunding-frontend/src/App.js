import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './CrowdFundingABI.json';
import DisplayCampaigns from './Components/DisplayCampaigns';
import CreateCampaign from './Components/CreateCampaign';
import UserInfo from './Components/UserInfo';
import AdminApproveCampaign from './Components/AdminApproveCampaign'; // Import AdminApproveCampaign

const contractAddress = "0x83f3C99Cc70133DBa8Db231591dCfFF5b9710991";

function App() {
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Track if the user is an admin

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

          // Check if the connected account is the admin
          const adminAddress = await tempContract.admin(); // Ensure you have a function in the contract to get admin address
          setIsAdmin(accounts[0].toLowerCase() === adminAddress.toLowerCase());
        }
      }
    };

    checkWalletConnection();
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
        setIsConnected(true);

        const adminAddress = await tempContract.admin();
        setIsAdmin(accounts[0].toLowerCase() === adminAddress.toLowerCase());
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
            {isAdmin ? (
              <AdminApproveCampaign contract={contract} account={account} /> // Show admin approve component
            ) : (
              <>
                <DisplayCampaigns contract={contract} />
                <CreateCampaign contract={contract} account={account} />
              </>
            )}
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
