// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

contract K4NftCarSignatureEdition2 is ERC721, Pausable, Ownable {
    uint256 public nftTotalSupply;
    bool public isSaleActive = false;
    uint256 private constant _CONTRACTID = 12;

    event NFTMinted(address _from, uint indexed _tokenId, uint indexed _quantity, uint _contractID);
    event TokenTransfered(address _token, address _from, address _to, uint256 indexed _amount);

    mapping(bytes => bool) public signatureUsed;

    constructor() ERC721("K4 Signature Edition 2 - Jan Cerney", "K4CARSE") {}

    function contractURI() public pure returns (string memory) {
        return "https://game.k4rally.io/nft/car/12/";
    }
    
    function _baseURI() internal pure override returns (string memory) {
        return "https://game.k4rally.io/nft/car/12/";
    }

    function safeMintUsingEther(uint256[] memory tokenId, uint256 quantity, bytes32 hash, bytes memory signature) public payable {
        // require(msg.value == 230 ether, "Not enough payment sent!");
        // require(msg.value == 1000, "Not enough payment sent!");
        uint256 nftTotalSupplier = nftTotalSupply;
        require(isSaleActive, "Sale is not active" );
        require(quantity != 0, "Quantity cannot be zero");
        require(recoverSigner(hash, signature) == owner(), "Address is not allowlisted");
        require(!signatureUsed[signature], "Signature has already been used.");
        for (uint256 i = 0; i < quantity; i++) {
            require(tokenId.length == quantity, "TokenId and quantity length should be match");
            _safeMint(msg.sender, tokenId[i]);
            tokenId[i] += 1;
            nftTotalSupplier = nftTotalSupplier + 1;
            emit NFTMinted(msg.sender, tokenId[i], quantity, _CONTRACTID);
        }
        nftTotalSupply = nftTotalSupplier;
        signatureUsed[signature] = true;
    }

    function safeMintUsingToken(uint256[] memory tokenId, address tokenAddress, uint256 amount, uint256 quantity, bytes32 hash, bytes memory signature) public {
        require(isSaleActive, "Sale is not active" );
        uint256 nftTotalSupplier = nftTotalSupply;
        ERC20 token;
        token = ERC20(tokenAddress);
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(quantity != 0 && amount != 0, "Quantity or Amount cannot be zero");
        require(tokenAddress != address(0), "Address cannot be zero");
        require(allowance >= amount, "Check the token allowance");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient token balance"); 
        require(recoverSigner(hash, signature) == owner(), "Address is not allowlisted");
        require(!signatureUsed[signature], "Signature has already been used.");
        for (uint256 i = 0; i < quantity; i++) {
            require(tokenId.length == quantity, "TokenId and quantity length should be match");
            SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
            _safeMint(msg.sender, tokenId[i]);
            tokenId[i] += 1;
            nftTotalSupplier = nftTotalSupplier + 1;  
            emit NFTMinted(msg.sender, tokenId[i], quantity, _CONTRACTID);
            emit TokenTransfered(tokenAddress, msg.sender, address(this), amount);
        }
        nftTotalSupply = nftTotalSupplier;
        signatureUsed[signature] = true;
    }

    function withdraw(address payable recipient) public onlyOwner {
        require(recipient != address(0), "Address cannot be zero");
        uint256 balance = address(this).balance;
        recipient.transfer(balance);
    }

    function flipSaleStatus() public onlyOwner {
        isSaleActive = !isSaleActive;
    }

    function recoverSigner(bytes32 hash, bytes memory signature) internal pure returns (address) {
        bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        return ECDSA.recover(messageDigest, signature);
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }
}