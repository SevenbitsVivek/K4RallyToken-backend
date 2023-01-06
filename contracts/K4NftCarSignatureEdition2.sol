// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract K4NftCarSignatureEdition2 is ERC721, Ownable, ReentrancyGuard {
    uint256 private constant NFTTOTALSUPPLY = 1000;
    bool public isSaleActive = true;
    address[] private hotWalletAddress;
    uint256 private constant _CONTRACTID = 12;

    event NFTMinted(
        address _from,
        uint256 indexed _tokenId,
        uint256 indexed _quantity,
        bool _success,
        uint256 _contractID
    );
    event TokenTransfered(
        address _token,
        address _from,
        address _to,
        uint256 indexed _amount
    );

    mapping(bytes => bool) private signatureUsed;
    mapping(address => bool) private whitelist;

    constructor() ERC721("Jan Cerny - K4CARSE2", "K4CARSE") {}

    function contractURI() external pure returns (string memory) {
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
    ) external payable nonReentrant {
        require(quantity <= 10, "Cannot buy more than 10 nfts");
        require(quantity != 0, "Insufficient quantity");
        require(isSaleActive, "Sale Inactive");
        require(msg.value != 0, "Insufficient amount");
        require(
            recoverSigner(hash, signature) == owner(),
            "Address is not authorized"
        );
        require(!signatureUsed[signature], "Already signature used");
        require(tokenId.length == quantity, "Invalid parameter");
        for (uint256 i = 0; i < quantity; i++) {
            if (tokenId[i] <= NFTTOTALSUPPLY && !_exists(tokenId[i])) {
                _safeMint(msg.sender, tokenId[i]);
                emit NFTMinted(
                    msg.sender,
                    tokenId[i],
                    quantity,
                    true,
                    _CONTRACTID
                );
            } else {
                emit NFTMinted(
                    msg.sender,
                    tokenId[i],
                    quantity,
                    false,
                    _CONTRACTID
                );
            }
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
    ) external {
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
        require(tokenId.length == quantity, "Invalid parameter");
        IERC20 token;
        token = IERC20(tokenAddress);
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Check token allowance"
        );
        for (uint256 i = 0; i < quantity; i++) {
            if (tokenId[i] <= NFTTOTALSUPPLY && !_exists(tokenId[i])) {
                _safeMint(msg.sender, tokenId[i]);
                emit NFTMinted(
                    msg.sender,
                    tokenId[i],
                    quantity,
                    true,
                    _CONTRACTID
                );
            } else {
                emit NFTMinted(
                    msg.sender,
                    tokenId[i],
                    quantity,
                    false,
                    _CONTRACTID
                );
            }
        }
        signatureUsed[signature] = true;
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        emit TokenTransfered(tokenAddress, msg.sender, address(this), amount);
    }

    function mintHotWalletUsingToken(
        uint256[] memory tokenId,
        address tokenAddress,
        uint256 amount,
        uint256 quantity,
        address to
    ) external {
        require(quantity <= 10, "Cannot buy more than 10 nfts");
        require(quantity != 0, "Insufficient quantity");
        require(isSaleActive, "Sale Inactive");
        require(
            tokenAddress != address(0) && to != address(0),
            "Address cannot be zero"
        );
        require(tokenId.length == quantity, "Invalid parameter");
        require(whitelist[msg.sender], "Not whitelisted");
        IERC20 token;
        token = IERC20(tokenAddress);
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Check token allowance"
        );
        for (uint256 i = 0; i < quantity; i++) {
            if (tokenId[i] <= NFTTOTALSUPPLY && !_exists(tokenId[i])) {
                _safeMint(to, tokenId[i]);
                emit NFTMinted(to, tokenId[i], quantity, true, _CONTRACTID);
            } else {
                emit NFTMinted(
                    msg.sender,
                    tokenId[i],
                    quantity,
                    false,
                    _CONTRACTID
                );
            }
        }
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        emit TokenTransfered(tokenAddress, msg.sender, address(this), amount);
    }

    function withdraw(address payable recipient) external onlyOwner {
        require(recipient != address(0), "Address cannot be zero");
        recipient.transfer(address(this).balance);
    }

    function withdrawToken(address tokenAddress, address recipient)
        external
        onlyOwner
    {
        require(
            recipient != address(0) && tokenAddress != address(0),
            "Address cannot be zero"
        );
        IERC20 token;
        token = IERC20(tokenAddress);
        require(token.balanceOf(address(this)) > 0, "Insufficient balance");
        SafeERC20.safeTransfer(
            token,
            recipient,
            token.balanceOf(address(this))
        );
    }

    function flipSaleStatus() external onlyOwner {
        isSaleActive = !isSaleActive;
    }

    function setHotwalletAddress(address user) external onlyOwner {
        require(user != address(0), "Address cannot be 0");
        require(!whitelist[user], "User already exists");
        whitelist[user] = true;
        hotWalletAddress.push(user);
    }

    function removeHotwalletAddress(address user) public onlyOwner {
        require(user != address(0), "Address cannot be 0");
        address[] memory hotWalletAddresses = hotWalletAddress;
        require(whitelist[user], "User is already removed from the whitelist.");
        for (uint256 i = 0; i < hotWalletAddress.length; i++) {
            if (hotWalletAddress[i] == user) {
                delete hotWalletAddresses[i];
                hotWalletAddresses[i] = hotWalletAddresses[
                    hotWalletAddresses.length - 1
                ];
                whitelist[user] = false;
            }
        }
        hotWalletAddress = hotWalletAddresses;
        hotWalletAddress.pop();
    }

    function getHotWalletAddress()
        external
        view
        onlyOwner
        returns (address[] memory)
    {
        return hotWalletAddress;
    }

    function recoverSigner(bytes32 hash, bytes memory signature)
        internal
        pure
        returns (address)
    {
        bytes32 messageDigest = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", hash)
        );
        return ECDSA.recover(messageDigest, signature);
    }
}
