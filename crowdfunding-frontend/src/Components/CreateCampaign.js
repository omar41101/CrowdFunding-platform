import React, { useState } from 'react';
import { ethers } from 'ethers';

const CreateCampaign = ({ contract, account }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // State to control the modal visibility

  // Function to create a new campaign
  const createCampaign = async (title, description, target, deadline, image) => {
    try {
      setLoading(true);
      setError(null);
      const deadlineDate = new Date(deadline);
      const deadlineTimestamp = Math.floor(deadlineDate.getTime() / 1000); // Convert to Unix timestamp

      const tx = await contract.createCampaign(
        account,
        title,
        description,
        ethers.utils.parseEther(target), // Convert target to Wei
        deadlineTimestamp,               // Pass Unix timestamp for deadline
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
        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
      >
        Create Campaign
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white p-6">
                <h2 className="text-2xl font-semibold mb-4">Create a New Campaign</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const { title, description, target, deadline, image } = e.target.elements;
                    createCampaign(title.value, description.value, target.value, deadline.value, image.value);
                  }}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <input className="p-2 border rounded-lg" name="title" placeholder="Title" required />
                    <input className="p-2 border rounded-lg" name="description" placeholder="Description" required />
                    <input className="p-2 border rounded-lg" name="target" placeholder="Target (ETH)" required />
                    <input className="p-2 border rounded-lg" name="deadline" type="date" placeholder="Deadline" required />
                    <input className="p-2 border rounded-lg" name="image" placeholder="Image URL" />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="mr-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Campaign'}
                    </button>
                  </div>
                  {error && <p className="text-red-600 mt-4">{error}</p>}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCampaign;
