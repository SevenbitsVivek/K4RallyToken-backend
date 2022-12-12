// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

contract K4_NFT_Car_Signature_Edition_1 is ERC721, ERC721URIStorage, Pausable, Ownable {
    uint256 public nftTotalSupply;
    bool public isSaleActive = false;
    uint256 private _contractID = 11;

    event NFTMinted(address _from, uint indexed _tokenId, uint indexed _quantity, uint _contractID);
    event tokenTransfered(address _token, address _from, address _to, uint256 _amount);

    mapping(bytes => bool) public signatureUsed;

    constructor() ERC721("K4 Signature Edition 1 - Christof Klausner Memorial", "K4CARSE") {}

    function contractURI() public pure returns (string memory) {
        return "https://game.k4rally.io/nft/car/11/";
    }
    
    function _baseURI() internal pure override returns (string memory) {
        return "https://game.k4rally.io/nft/car/11/";
    }

    function safeMintUsingEther(uint256[] memory tokenId, uint256 quantity, bytes32 hash, bytes memory signature) public payable {
        // require(msg.value == 230 ether, "Not enough payment sent!");
        // require(msg.value == 1000, "Not enough payment sent!");
        require(isSaleActive, "Sale is not active" );
        require(quantity != 0, "Quantity cannot be zero");
        require(recoverSigner(hash, signature) == owner(), "Address is not allowlisted");
        require(!signatureUsed[signature], "Signature has already been used.");
        for (uint256 i = 0; i < quantity; i++) {
            require(tokenId[i] != 0, "TokenId cannot be zero");
            require(tokenId.length == quantity, "Length should be match");
            _safeMint(msg.sender, tokenId[i]);
            tokenId[i] += 1;
            nftTotalSupply = nftTotalSupply + 1;  
            emit NFTMinted(msg.sender, tokenId[i], quantity, _contractID);
        }
        signatureUsed[signature] = true;
    }

    function safeMintUsingToken(uint256[] memory tokenId, address token_address, uint256 amount, uint256 quantity, bytes32 hash, bytes memory signature) public {
        require(isSaleActive, "Sale is not active" );
        ERC20 token;
        token = ERC20(token_address);
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(quantity != 0 && amount != 0, "Quantity or Amount cannot be zero");
        require(token_address != address(0), "Address cannot be zero");
        require(allowance >= amount, "Check the token allowance");
        require(recoverSigner(hash, signature) == owner(), "Address is not allowlisted");
        require(!signatureUsed[signature], "Signature has already been used.");
        for (uint256 i = 0; i < quantity; i++) {
            require(tokenId[i] != 0, "TokenId cannot be zero");
            require(tokenId[i] < 334, "SOLD OUT!");
            require(tokenId.length == quantity, "Length should be match");
            token.transferFrom(msg.sender, address(this), amount);
            _safeMint(msg.sender, tokenId[i]);
            tokenId[i] += 1;
            nftTotalSupply = nftTotalSupply + 1;  
            emit NFTMinted(msg.sender, tokenId[i], quantity, _contractID);
            emit tokenTransfered(token_address, msg.sender, address(this), amount);
        }
        signatureUsed[signature] = true;
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function withdraw(address payable recipient) public onlyOwner {
        uint256 balance = address(this).balance;
        recipient.transfer(balance);
    }

    function flipSaleStatus() public onlyOwner {
        isSaleActive = !isSaleActive;
    }


    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function recoverSigner(bytes32 hash, bytes memory signature) internal pure returns (address) {
        bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        return ECDSA.recover(messageDigest, signature);
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }
}