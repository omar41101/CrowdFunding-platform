import React, { useState } from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3'; // To handle conversions between Ether and Wei
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateCampaign = ({ contract, account }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState('');
  const [isOpen, setIsOpen] = useState(false); // Control modal visibility
  const [error, setError] = useState(null);

  // Helper function to create a new campaign
  const handleCreateCampaign = async () => {
    try {
      if (!contract) {
        setError('Contract is not initialized');
        return;
      }

      if (!title || !description || !target || !duration || !image) {
        setError('All fields are required');
        return;
      }

      // Convert target to Wei (smallest unit of Ether)
      const targetInWei = Web3.utils.toWei(target, 'ether');
      // Convert duration from days to seconds (as required by the contract)
      const durationInSeconds = parseInt(duration) * 24 * 60 * 60;

      // Call the smart contract function
      const tx = await contract.createCampaign(
        account,               // Owner address
        title,                 // Campaign title
        description,           // Campaign description
        targetInWei,           // Target in Wei
        durationInSeconds,     // Duration in seconds
        image                  // Campaign image URL
      );

      await tx.wait();  // Wait for the transaction to be mined

      // Display a success message using Toastify
      toast.success('Campaign created successfully! Request sent to admin for approval.');

      // Reset form after successful creation
      setTitle('');
      setDescription('');
      setTarget('');
      setDuration('');
      setImage('');
      setError(null); // Clear any previous errors
      setIsOpen(false); // Close the modal after successful campaign creation
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Failed to create campaign. Check console for details.');
      toast.error('Failed to create campaign. Please try again.');
    }
  };

  return (
    <div>
      <button 
        className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
        onClick={() => setIsOpen(true)}
      >
        Create Campaign
      </button>

      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-lg shadow-md max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">Create a New Campaign</h2>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateCampaign();
                }}
              >
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded-md mt-3 w-full p-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div className="mb-4">
                  <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-md mt-3 w-full p-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="Target (ETH)"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full p-2 border rounded-md mt-3 w-full p-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="Duration (days)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2 border rounded-md mt-3 w-full p-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-2 border rounded-md mt-3 w-full p-2 border rounded-md bg-black text-white focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)} // Close the modal
                    className="mr-4 p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                  >
                    Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toastify notification container */}
      <ToastContainer />
    </div>
  );
};

export default CreateCampaign;
