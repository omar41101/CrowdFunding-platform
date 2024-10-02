import React from 'react';
import { ethers } from 'ethers';
import Button from './Button';

const ConnectWallet = ({ setProvider }) => {
    const connectWalletHandler = async () => {
        if (window.ethereum) {
            try {
                // Request account access from MetaMask
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                
                // ethers v5 Web3Provider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);
            } catch (err) {
                console.error("Error connecting wallet:", err);
            }
        } else {
            alert('Please install MetaMask!');
        }
    };

    return (
        <div className="flex justify-center">
            <Button onClick={connectWalletHandler}>
                Connect Wallet
            </Button>
        </div>
    );
};

export default ConnectWallet;
