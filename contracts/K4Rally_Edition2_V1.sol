// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";

contract K4NftCarSignatureEdition2V1 is ERC721Upgradeable, PausableUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    uint256 public nftTotalSupply;
    bool public isSaleActive;
    uint256 private constant _CONTRACTID = 12;

    event NFTMinted(address _from, uint indexed _tokenId, uint indexed _quantity, uint _contractID);
    event TokenTransfered(address _token, address _from, address _to, uint256 indexed _amount);

    mapping(bytes => bool) public signatureUsed;

    function initialize(bool newIsSaleActive) public initializer {
        OwnableUpgradeable.__Ownable_init();
        PausableUpgradeable.__Pausable_init();
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        ERC721Upgradeable.__ERC721_init("K4 Signature Edition 2 - Jan Cerney", "K4CARSE");
        isSaleActive = newIsSaleActive;
    }

    function contractURI() public pure returns (string memory) {
        return "https://game.k4rally.io/nft/car/12/";
    }
    
    function _baseURI() internal pure override returns (string memory) {
        return "https://game.k4rally.io/nft/car/12/";
    }

    function safeMintUsingEther(uint256[] memory tokenId, uint256 quantity, bytes32 hash, bytes memory signature) public payable nonReentrant {
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

    function safeMintUsingToken(uint256[] memory tokenId, address tokenAddress, uint256 amount, uint256 quantity, bytes32 hash, bytes memory signature) public nonReentrant {
        require(isSaleActive, "Sale is not active" );
        uint256 nftTotalSupplier = nftTotalSupply;
        ERC20Upgradeable token;
        token = ERC20Upgradeable(tokenAddress);
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(quantity != 0 && amount != 0, "Quantity or Amount cannot be zero");
        require(tokenAddress != address(0), "Address cannot be zero");
        require(allowance >= amount, "Check the token allowance");
        require(token.balanceOf(msg.sender) >= amount, "Insufficient token balance"); 
        require(recoverSigner(hash, signature) == owner(), "Address is not allowlisted");
        require(!signatureUsed[signature], "Signature has already been used.");
        for (uint256 i = 0; i < quantity; i++) {
            require(tokenId.length == quantity, "TokenId and quantity length should be match");
            SafeERC20Upgradeable.safeTransferFrom(token, msg.sender, address(this), amount);
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
        return ECDSAUpgradeable.recover(messageDigest, signature);
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }
}