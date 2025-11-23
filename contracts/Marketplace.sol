// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
contract Marketplace is ReentrancyGuard {
    // Using a simple uint256 counter instead of OpenZeppelin Counters (v5 removed Counters.sol)
    uint256 private _listingIds;
    
    uint256 public platformFee = 250; // 2.5%
    address payable public feeRecipient;

    struct Listing {
        uint256 listingId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    event NFTListed(
        uint256 indexed listingId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    event NFTSold(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    event ListingCancelled(uint256 indexed listingId);

    constructor() {
        feeRecipient = payable(msg.sender);
    }

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant returns (uint256) {
        require(price > 0, "Price must be greater than 0");
        
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            nft.isApprovedForAll(msg.sender, address(this)) || 
            nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        _listingIds += 1;
        uint256 listingId = _listingIds;

        listings[listingId] = Listing({
            listingId: listingId,
            nftContract: nftContract,
            tokenId: tokenId,
            seller: payable(msg.sender),
            price: price,
            active: true
        });

        emit NFTListed(listingId, nftContract, tokenId, msg.sender, price);
        return listingId;
    }

    function buyNFT(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.active, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");
        require(msg.sender != listing.seller, "Cannot buy your own NFT");

        listing.active = false;

        uint256 fee = (listing.price * platformFee) / 10000;
        uint256 sellerAmount = listing.price - fee;

        IERC721(listing.nftContract).safeTransferFrom(
            listing.seller,
            msg.sender,
            listing.tokenId
        );

        listing.seller.transfer(sellerAmount);
        feeRecipient.transfer(fee);

        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }

        emit NFTSold(listingId, msg.sender, listing.seller, listing.price);
    }

    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.active, "Listing not active");

        listing.active = false;
        emit ListingCancelled(listingId);
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }

    function getAllListings() external view returns (Listing[] memory) {
        uint256 total = _listingIds;
        uint256 activeCount = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (listings[i].active) {
                activeCount++;
            }
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 index = 0;

        for (uint256 i = 1; i <= total; i++) {
            if (listings[i].active) {
                activeListings[index] = listings[i];
                index++;
            }
        }

        return activeListings;
    }

    function updatePlatformFee(uint256 newFee) external {
        require(msg.sender == feeRecipient, "Not authorized");
        require(newFee <= 1000, "Fee too high");
        platformFee = newFee;
    }
}