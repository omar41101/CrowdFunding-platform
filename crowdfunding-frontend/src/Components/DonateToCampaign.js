import React, { useState } from 'react';
import { ethers } from 'ethers';

const DonateToCampaign = ({ contract, campaignId, account }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDonation = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const tx = await contract.donateToCampaign(campaignId, { value: ethers.utils.parseEther(amount) });
      await tx.wait();

      setSuccess(true);
      console.log("Donation successful!");
    } catch (err) {
      console.error("Error donating to campaign:", err);
      setError("Failed to donate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Donate to Campaign</h2>
      <form onSubmit={handleDonation}>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Donate'}
        </button>
        {error && <p className="text-red-600 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">Donation successful!</p>}
      </form>
    </div>
  );
};

export default DonateToCampaign;
