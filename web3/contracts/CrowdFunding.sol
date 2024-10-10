// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    address public admin; // Admin is the contract deployer

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 amountCollected;
        string image;
        bool completed;
        bool approved;  // New field to track if the campaign is approved by admin
        bool pendingApproval;  // New field to indicate if the campaign is awaiting approval
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    event TargetAchieved(uint256 campaignId, uint256 amountCollected);
    event CampaignCreated(uint256 campaignId, address owner);
    event CampaignApproved(uint256 campaignId);
    event CampaignDeclined(uint256 campaignId);

    // Constructor to set the deployer as admin
    constructor() {
        admin = msg.sender;
    }

    // Modifier to allow only admin
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can approve or decline campaigns");
        _;
    }

    // Create a new campaign
    function createCampaign(
        address _owner,
        string calldata _title,
        string calldata _description,
        uint256 _target,
        string calldata _image
    ) external returns (uint256) {
        require(_target > 0, "Target must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_owner != address(0), "Invalid owner address");

        Campaign storage campaign = campaigns[numberOfCampaigns];
        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.completed = false;
        campaign.pendingApproval = true;
        campaign.approved = false;

        numberOfCampaigns++;

        emit CampaignCreated(numberOfCampaigns - 1, _owner);

        return numberOfCampaigns - 1;
    }

    // Admin approves a pending campaign
    function approveCampaign(uint256 _id) external onlyAdmin {
        Campaign storage campaign = campaigns[_id];
        require(campaign.pendingApproval == true, "Campaign is not pending approval");
        campaign.approved = true;
        campaign.pendingApproval = false;

        emit CampaignApproved(_id);
    }

    // Admin declines a pending campaign
    function declineCampaign(uint256 _id) external onlyAdmin {
        Campaign storage campaign = campaigns[_id];
        require(campaign.pendingApproval == true, "Campaign is not pending approval");

        // Remove the campaign if it is declined
        delete campaigns[_id];

        emit CampaignDeclined(_id);
    }

    // Donate to a specific campaign
    function donateToCampaign(uint256 _id) external payable {
        require(msg.value > 0, "Donation amount must be greater than 0");
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner != address(0), "Campaign does not exist");
        require(campaign.approved, "Campaign has not been approved by the admin"); // Only approved campaigns can receive donations
        require(!campaign.completed, "Campaign already completed");

        uint256 initialAmountCollected = campaign.amountCollected;

        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);

        campaign.amountCollected += msg.value;

        if (campaign.amountCollected >= campaign.target) {
            campaign.completed = true;
            (bool sent, ) = payable(campaign.owner).call{value: campaign.amountCollected}("");
            require(sent, "Failed to send Ether to campaign owner");

            emit TargetAchieved(_id, campaign.amountCollected);
        }

        assert(campaign.amountCollected == initialAmountCollected + msg.value);
    }

    // Get the list of donators and their donations for a specific campaign
    function getDonators(uint256 _id) external view returns (address[] memory, uint256[] memory) {
        Campaign storage campaign = campaigns[_id];
        return (campaign.donators, campaign.donations);
    }

// Get all approved campaigns
function getCampaigns() external view returns (Campaign[] memory) {
    uint256 approvedCount = 0;

    // First, count the number of approved campaigns
    for (uint256 i = 0; i < numberOfCampaigns; i++) {
        if (campaigns[i].approved) {
            approvedCount++;
        }
    }

    // Create an array for approved campaigns
    Campaign[] memory approvedCampaigns = new Campaign[](approvedCount);
    uint256 index = 0;

    // Fill the array with approved campaigns
    for (uint256 i = 0; i < numberOfCampaigns; i++) {
        if (campaigns[i].approved) {
            approvedCampaigns[index] = campaigns[i];
            index++;
        }
    }

    return approvedCampaigns;
}

// Get all pending campaigns for admin
function getPendingCampaigns() external view onlyAdmin returns (Campaign[] memory) {
    uint256 pendingCount = 0;

    // First, count the number of pending campaigns
    for (uint256 i = 0; i < numberOfCampaigns; i++) {
        if (campaigns[i].pendingApproval) {
            pendingCount++;
        }
    }

    // Create an array for pending campaigns
    Campaign[] memory pendingCampaigns = new Campaign[](pendingCount);
    uint256 index = 0;

    // Fill the array with pending campaigns
    for (uint256 i = 0; i < numberOfCampaigns; i++) {
        if (campaigns[i].pendingApproval) {
            pendingCampaigns[index] = campaigns[i];
            index++;
        }
    }

    return pendingCampaigns;
}


    // Update an existing campaign
    function updateCampaign(
        uint256 _id,
        string calldata _title,
        string calldata _description,
        uint256 _target,
        string calldata _image
    ) external {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only the campaign owner can update");
        require(_target > 0, "Target must be greater than 0");
        require(!campaign.completed, "Cannot update a completed campaign");
        require(campaign.approved == false, "Cannot update an approved campaign");

        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.image = _image;
    }

    // Delete a campaign
    function deleteCampaign(uint256 _id) external {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only the campaign owner can delete");
        require(campaign.amountCollected == 0, "Cannot delete a campaign with funds");

        delete campaigns[_id];
    }
}
