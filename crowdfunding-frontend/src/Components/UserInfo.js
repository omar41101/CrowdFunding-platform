import React from 'react';

const UserInfo = ({ account }) => {
    return (
        <div className="text-center mb-6">
            <p>Connected as: {account}</p>
        </div>
    );
};

export default UserInfo;
