// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimedStorage {
    address public owner;
    uint256 public deploymentTimestamp;
    uint256 public totalDeposits;
    uint256 public withdrawalTargetAmount; // Target amount for withdrawal availability

    event DepositReceived(address indexed from, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Withdrawal(address indexed to, uint256 amount);
    event WithdrawalAmountSet(uint256 targetAmount);

    // Constructor sets owner, accepts initial deposit, and sets withdrawal time
    constructor(uint256 _targetAmount) payable {
        // require(_withdrawalUnlockTime > block.timestamp, "Unlock time must be in the future");
        
        owner = msg.sender;
        deploymentTimestamp = block.timestamp;
        totalDeposits = msg.value;
        withdrawalTargetAmount = _targetAmount;
        
        emit DepositReceived(msg.sender, msg.value);
        emit WithdrawalAmountSet(_targetAmount);
    }

    // Deposit function
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        totalDeposits += msg.value;
        emit DepositReceived(msg.sender, msg.value);
    }

    // Withdraw function with time lock check
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(totalDeposits >= withdrawalTargetAmount, "Funds are target-locked");
        require(address(this).balance > 0, "Insufficient balance");
        
        payable(owner).transfer(totalDeposits);
        totalDeposits = 0;
        emit Withdrawal(owner, totalDeposits);
    }

    // ========== VIEW FUNCTIONS ==========
    
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getOwnerAddress() public view returns (address) {
        return owner;
    }

    function getDeploymentTime() public view returns (uint256) {
        return deploymentTimestamp;
    }

    function getTotalDeposits() public view returns (uint256) {
        return totalDeposits;
    }

    function getWithdrawalTargetAmount() public view returns (uint256) {
        return withdrawalTargetAmount;
    }

    function canWithdraw() public view returns (bool) {
        return totalDeposits >= withdrawalTargetAmount;
    }

    // ========== ADMIN FUNCTIONS ==========
    
    // function transferOwnership(address newOwner) public {
    //     require(msg.sender == owner, "Only owner can transfer ownership");
    //     require(newOwner != address(0), "New owner cannot be zero address");
    //     emit OwnershipTransferred(owner, newOwner);
    //     owner = newOwner;
    // }

    // Emergency function to update withdrawal target (owner only)
    function setWithdrawalTargetAmount(uint256 newTargetAmount) external {
        require(msg.sender == owner, "Only owner can modify unlock time");
        withdrawalTargetAmount = newTargetAmount;
        emit WithdrawalAmountSet(newTargetAmount);
    }
}