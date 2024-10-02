import React from 'react';

const UserInfo = ({ account }) => {
    return (
        <div className="bg-purple-900 text-white rounded-full p-2 flex items-center">
        <span className="mr-2">{account.substring(0, 6)}...{account.slice(-4)}</span>
        <span className="ml-2 bg-purple-800 p-1 rounded text-xs">
          0.0642 ETH
        </span>
      </div>
      
    );
};

export default UserInfo;
