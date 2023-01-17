// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiSigWallet {
    event Deposit(address indexed sender, uint amount, uint balance);
    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint value,
        string message
    );
    event ConfirmTransaction(address indexed owner, uint indexed txIndex);
    event RevokeConfirmation(address indexed owner, uint indexed txIndex);
    event ExecuteTransaction(address indexed owner, uint indexed txIndex);
    event TokenTransfered(
        address _token,
        address _from,
        address _to,
        uint256 indexed _amount
    );

    address[] private owners;
    mapping(address => bool) private isOwner;
    uint private numConfirmationsRequired;

    struct Transaction {
        address to;
        uint value;
        string message;
        bool executed;
        uint numConfirmations;
    }

    // mapping from tx index => owner => bool
    mapping(uint => mapping(address => bool)) private isConfirmed;
    mapping(address => bool) private ownersAddresses;
    mapping(bytes => bool) private signatureUsed;

    Transaction[] private transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    modifier isOwnerAdded(address _address) {
        require(ownersAddresses[_address], "You need to be added as a owner");
        _;
    }

    constructor(address[] memory _owners, uint _numConfirmationsRequired) {
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
    }

    function submitTransaction(
        address _to,
        uint _value,
        string memory _message
    ) public onlyOwner isOwnerAdded(msg.sender){
        uint txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                message: _message,
                executed: false,
                numConfirmations: 0
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _value, _message);
    }

    function confirmTransaction(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) isOwnerAdded(msg.sender) {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;

        emit ConfirmTransaction(msg.sender, _txIndex);
    }

    function executeTransaction(
        uint _txIndex, address tokenAddress,  uint256 amount,  bytes32 hash,
        bytes memory signature
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) isOwnerAdded(msg.sender){
        Transaction storage transaction = transactions[_txIndex];
        require(amount != 0, "Insufficient amount");
        require(tokenAddress != address(0), "Address cannot be zero");
        for(uint i = 0; i < owners.length; i++){
            require(
                recoverSigner(hash, signature) == owners[i],
                "Address is not authorized"
            );
        }
        require(!signatureUsed[signature], "Already signature used");

        IERC20 token;
        token = IERC20(tokenAddress);
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Check the token allowance"
        );
        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );


        emit ExecuteTransaction(msg.sender, _txIndex);
        transaction.executed = true;    
        emit TokenTransfered(tokenAddress, msg.sender, address(this), amount);
        SafeERC20.safeTransferFrom(token, msg.sender, address(this), amount);
        signatureUsed[signature] = true;
    }

    function revokeConfirmation(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;

        emit RevokeConfirmation(msg.sender, _txIndex);
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(
        uint _txIndex
    )
        public
        view
        returns (
            address to,
            uint value,
            string memory message,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.message,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    function addOwners(address newOwners) external onlyOwner {
        require(newOwners != address(0), "Address cannot be 0");
        require(!ownersAddresses[newOwners], "Owners already exists");
        ownersAddresses[newOwners] = true;
    }

    function removeOwners(address oldOwners) public onlyOwner {
        require(oldOwners != address(0), "Address cannot be 0");
        ownersAddresses[oldOwners] = false;
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