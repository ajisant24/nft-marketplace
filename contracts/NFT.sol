// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MarketplaceNFT", "MNFT") Ownable(msg.sender) {}

    function mint(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        return newTokenId;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    function getAllTokens() public view returns (uint256[] memory) {
        uint256 total = _tokenIds.current();
        uint256[] memory tokens = new uint256[](total);
        
        for (uint256 i = 0; i < total; i++) {
            tokens[i] = i + 1;
        }
        
        return tokens;
    }
}