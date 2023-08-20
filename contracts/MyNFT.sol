// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FiredGuys is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    Counters.Counter private _burnedNumberCounter;

    mapping(string => uint8) existingURIs;
    mapping(string => uint8) burnedURIs;
    mapping(uint256 => uint8) burnedIDs;

    constructor() ERC721("FiredGuys", "FYR") {}

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        existingURIs[uri] = 1;
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function isContentOwned(string memory uri) public view returns (bool) {
        return existingURIs[uri] == 1;
    }

    function isContentBurned(string memory uri) public view returns (bool) {
        return burnedURIs[uri] == 1;
    }

    function isTokenBurned(uint256 tokenID) public view returns (bool) {
        return burnedIDs[tokenID] == 1;
    }

    function payToMint(
        address recipient,
        string memory metadataURI
    ) public payable returns (uint256) {
        require(existingURIs[metadataURI] != 1, "NFT already minted!");
        require(msg.value >= 0.05 ether, "Need to pay up!");

        uint256 newItemId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        existingURIs[metadataURI] = 1;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    function compare(
        string memory str1,
        string memory str2
    ) public pure returns (bool) {
        return
            keccak256(abi.encodePacked(str1)) ==
            keccak256(abi.encodePacked(str2));
    }

    function payToBurn(
        string memory metadataURI,
        uint256 tokenId
        
    ) public payable returns (uint256) {
        require(burnedURIs[metadataURI] != 1, "NFT already burned!");
        require(msg.value >= 0.05 ether, "Need to pay up!");
        // require(ownerOf(tokenId) == recipient, "You must own this number in order to burn it");
        require(
            msg.sender == ownerOf(tokenId),
            "You must own this number in order to burn it"
        );

        // require(compare(tokenURI(tokenId), metadataURI), "need to match");
        burnedURIs[metadataURI] = 1;
        burnedIDs[tokenId] = 1;
        _burnedNumberCounter.increment();

        _burn(tokenId);
        // _setTokenURI(newItemId, metadataURI);
        return tokenId;
    }

    function count() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function count_burned() public view returns (uint256) {
        return _burnedNumberCounter.current();
    }

    function transferNFT(
        address recipient,
        uint256 tokenId
    ) public {
        require(msg.sender == ownerOf(tokenId), "Transfer not allowed");
        // require(_isApprovedOrOwner(_msgSender(), tokenId), "Transfer not allowed");
        _transfer( msg.sender, recipient, tokenId);
    }
}
