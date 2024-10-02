const { ethers } = require("ethers");
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CrowdFundingModule", (m) => {
  const campaignOwner = m.getParameter("campaignOwner", "0xYourOwnerAddress");
  const campaignTitle = m.getParameter("campaignTitle", "Sample Campaign");
  const campaignDescription = m.getParameter("campaignDescription", "This is a test campaign");
  const campaignTarget = m.getParameter("campaignTarget", ethers.utils.parseEther("10")); // Use ethers here
  const campaignDeadline = m.getParameter("campaignDeadline", Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60); // 30 days from now
  const campaignImage = m.getParameter("campaignImage", "https://example.com/image.jpg");

  const crowdFunding = m.contract("CrowdFunding");

  // Creating the first campaign with pre-defined details
  const createCampaignTx = m.call(crowdFunding, "createCampaign", [
    campaignOwner,
    campaignTitle,
    campaignDescription,
    campaignTarget,
    campaignDeadline,
    campaignImage,
  ]);

  return { crowdFunding, createCampaignTx };
});
