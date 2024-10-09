import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

const UserInfo = ({ account }) => {
    const [balance, setBalance] = useState("0");

    useEffect(() => {
        const fetchBalance = async () => {
            if (account) {
                const web3 = new Web3(window.ethereum); // Use MetaMask's provider
                const balanceInWei = await web3.eth.getBalance(account); // Fetch balance in Wei
                const balanceInEth = Web3.utils.fromWei(balanceInWei, 'ether'); // Convert to Ether
                setBalance(balanceInEth); // Update state
            }
        };

        fetchBalance();
    }, [account]); // Fetch balance whenever the account changes

    return (
        <div className="bg-purple-900 text-white rounded-full p-2 flex items-center">
            <span className="mr-2">{account.substring(0, 6)}...{account.slice(-4)}</span>
            <span className="ml-2 bg-purple-800 p-1 rounded text-xs">
                {balance} POL
            </span>
        </div>
    );
};

export default UserInfo;
