import React, { useState } from 'react';
import Button from './Button';

const CampaignForm = ({ addCampaign }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        target: '',
         image: '',
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert deadline from minutes to seconds
       

        const campaignData = {
            ...formData,
         };

        addCampaign(campaignData);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                <input
                    type="text"
                    name="title"
                    onChange={handleInputChange}
                    value={formData.title}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea
                    name="description"
                    onChange={handleInputChange}
                    value={formData.description}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Target (in ETH)</label>
                <input
                    type="text"
                    name="target"
                    onChange={handleInputChange}
                    value={formData.target}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                    required
                />
            </div>
           
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                <input
                    type="text"
                    name="image"
                    onChange={handleInputChange}
                    value={formData.image}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                />
            </div>
            <Button type="submit">Create Campaign</Button>
        </form>
    );
};

export default CampaignForm;
