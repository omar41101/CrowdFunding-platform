import React, { useEffect, useState } from 'react';

const GetDonators = ({ contract, campaignId }) => {
  const [donators, setDonators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donators for the campaign
  const fetchDonators = async () => {
    try {
      setLoading(true);
      const [addresses, donations] = await contract.getDonators(campaignId);
      const formattedDonators = addresses.map((address, index) => ({
        address,
        donation: donations[index],
      }));
      setDonators(formattedDonators);
    } catch (err) {
      console.error("Error fetching donators:", err);
      setError("Failed to fetch donators.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonators();
  }, [campaignId]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Donators</h2>
      {loading ? (
        <div>Loading donators...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : donators.length > 0 ? (
        <ul>
          {donators.map((donator, index) => (
            <li key={index} className="border-b py-2">
              <p>Address: {donator.address}</p>
              <p>Donation: {ethers.utils.formatEther(donator.donation)} ETH</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>No donators for this campaign.</div>
      )}
    </div>
  );
};

export default GetDonators;
