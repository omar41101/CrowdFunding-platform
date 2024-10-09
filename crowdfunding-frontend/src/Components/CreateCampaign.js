import React, { useState } from 'react';
import { ethers } from 'ethers';

const CreateCampaign = ({ contract, account }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // State to control the modal visibility

  // Function to create a new campaign
  const createCampaign = async (title, description, target, image) => {
    try {
      setLoading(true);
      setError(null);

      const tx = await contract.createCampaign(
        account,
        title,
        description,
        ethers.utils.parseEther(target), // Convert target to Wei
        image
      );
      await tx.wait();
      console.log("Campaign created!");
      setIsOpen(false); // Close modal after successful campaign creation
    } catch (error) {
      console.error("Error creating campaign:", error);
      setError("Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Button to open modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-6 rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
      >
        Create Campaign
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create a New Campaign</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const { title, description, target, image } = e.target.elements;
                createCampaign(title.value, description.value, target.value, image.value);
              }}
            >
              <div className="space-y-4">
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  name="title"
                  placeholder="Title"
                  required
                />
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  name="description"
                  placeholder="Description"
                  required
                />
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  name="target"
                  placeholder="Target (ETH)"
                  required
                />
                <input
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                  name="image"
                  placeholder="Image URL"
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mr-4 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-6 rounded-full shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>

              {error && <p className="text-red-600 mt-4">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCampaign;
