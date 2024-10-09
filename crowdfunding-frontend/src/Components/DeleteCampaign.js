import React from 'react';
import Web3 from 'web3';

const DeleteCampaign = ({ contract, campaignId, onClose, onDeleted }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirmDelete) return;

    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();

      await contract.methods.deleteCampaign(campaignId).send({ from: accounts[0] });
      alert('Campaign deleted successfully!');
      onDeleted(); // Refresh the campaigns
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting campaign", error);
      alert("Failed to delete campaign");
    }
  };

  return (
    <div>
      <h2>Delete Campaign</h2>
      <p>Are you sure you want to delete this campaign?</p>
      <button onClick={handleDelete}>Yes, Delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default DeleteCampaign;
