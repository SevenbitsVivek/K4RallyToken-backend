// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract K4NftCarSignatureEdition2V1 is
    ERC721Upgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    uint256 private constant NFTTOTALSUPPLY = 1000 ;
    bool public isSaleActive;
    uint256 private constant _CONTRACTID = 12;

    event NFTMinted(
        address _from,
        uint256 indexed _tokenId,
        uint256 indexed _quantity,
        uint256 _contractID
    );
    event TokenTransfered(
        address _token,
        address _from,
        address _to,
        uint256 indexed _amount
    );

    mapping(bytes => bool) private signatureUsed;

    function initialize(bool newIsSaleActive) public initializer {
        OwnableUpgradeable.__Ownable_init();
        ReentrancyGuardUpgradeable.__ReentrancyGuard_init();
        ERC721Upgradeable.__ERC721_init(
            "K4 Signature Edition #2 - Jan Cerney",
            "K4CARSE"
        );
        isSaleActive = newIsSaleActive;
    }

    function contractURI() public pure returns (string memory) {
        return "https://game.k4rally.io/nft/car/12/";
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://game.k4rally.io/nft/car/12/";
    }

    function safeMintUsingEther(
        uint256[] memory tokenId,
        uint256 quantity,
        bytes32 hash,
        bytes memory signature
    ) public payable nonReentrant {
       require(quantity <= 10, "Cannot buy more than 10 nfts");
        require(quantity != 0, "Insufficient quantity");
        require(isSaleActive, "Sale Inactive");
        require(msg.value != 0, "Insufficient amount");
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not authorized"
        );
        require(!signatureUsed[signature], "Already signature used");
        require(
            tokenId.length == quantity,
            "Invalid parameters"
        );
        for (uint256 i = 0; i < quantity; i++) {
            require(tokenId[i] <= NFTTOTALSUPPLY, "Invalid tokenId");
            emit NFTMinted(msg.sender, tokenId[i], quantity, _CONTRACTID);
            _safeMint(msg.sender, tokenId[i]);
        }
        signatureUsed[signature] = true;
    }

    function safeMintUsingToken(
        uint256[] memory tokenId,
        address tokenAddress,
        uint256 amount,
        uint256 quantity,
        bytes32 hash,
        bytes memory signature
    ) public nonReentrant {
       require(quantity <= 10, "Cannot buy more than 10 nfts");
        require(quantity != 0, "Insufficient quantity");
        require(isSaleActive, "Sale Inactive");
        require(amount != 0, "Insufficient amount");
        require(tokenAddress != address(0), "Address cannot be zero");
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not authorized"
        );
        require(!signatureUsed[signature], "Already signature used");
        require(
            tokenId.length == quantity,
            "Invalid parameter"
        );
        IERC20Upgradeable token;
        token = IERC20Upgradeable(tokenAddress);
        require(token.allowance(msg.sender, address(this)) >= amount, "Check the token allowance");
        for (uint256 i = 0; i < quantity; i++) {
            require(tokenId[i] <= NFTTOTALSUPPLY, "Invalid tokenId");
            emit NFTMinted(msg.sender, tokenId[i], quantity, _CONTRACTID);
            _safeMint(msg.sender, tokenId[i]);
        }
        signatureUsed[signature] = true;
        emit TokenTransfered(
            tokenAddress,
            msg.sender,
            address(this),
            amount
        );
        SafeERC20Upgradeable.safeTransferFrom(
            token,
            msg.sender,
            address(this),
            amount
        );
    }

    function withdraw(address payable recipient) public onlyOwner {
        require(recipient != address(0), "Address cannot be zero");
        recipient.transfer(address(this).balance);
    }
    
    function withdrawToken(address tokenAddress, address recipient) public onlyOwner {
        require(recipient != address(0), "Address cannot be zero");
        IERC20Upgradeable token;
        token = IERC20Upgradeable(tokenAddress);
        require(token.balanceOf(address(this)) > 0, "Insufficient balance");
        SafeERC20Upgradeable.safeTransfer(
            token,
            recipient,
            token.balanceOf(address(this))
        );
    }

    function flipSaleStatus() public onlyOwner {
        isSaleActive = !isSaleActive;
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSAUpgradeable.recover(messageDigest, signature);
    }
}
