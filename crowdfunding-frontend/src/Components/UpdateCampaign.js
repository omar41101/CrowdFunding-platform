import React, { useState } from 'react';
import Web3 from 'web3';

const UpdateCampaign = ({ contract, campaignId, onClose, onUpdated }) => {
  const [updatedDetails, setUpdatedDetails] = useState({ title: "", description: "", target: "", image: "", deadlineInHours: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      await contract.methods.updateCampaign(
        campaignId,
        updatedDetails.title,
        updatedDetails.description,
        Web3.utils.toWei(updatedDetails.target, 'ether'), // Convert target to Wei
        updatedDetails.deadlineInHours,
        updatedDetails.image
      ).send({ from: accounts[0] });

      alert('Campaign updated successfully!');
      onUpdated(); // Refresh the campaigns
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating campaign", error);
      setError("Failed to update campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Update Campaign</h2>
      <input 
        type="text" 
        placeholder="Title" 
        onChange={(e) => setUpdatedDetails({ ...updatedDetails, title: e.target.value })}
      />
      <input 
        type="text" 
        placeholder="Description" 
        onChange={(e) => setUpdatedDetails({ ...updatedDetails, description: e.target.value })}
      />
      <input 
        type="text" 
        placeholder="Target (ETH)" 
        onChange={(e) => setUpdatedDetails({ ...updatedDetails, target: e.target.value })}
      />
      <input 
        type="text" 
        placeholder="Image URL" 
        onChange={(e) => setUpdatedDetails({ ...updatedDetails, image: e.target.value })}
      />
      
      <button onClick={handleUpdate} disabled={loading}>
        {loading ? 'Updating...' : 'Update Campaign'}
      </button>
      {error && <p>{error}</p>}
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default UpdateCampaign;
