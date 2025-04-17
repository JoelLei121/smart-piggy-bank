'use client';

import { Signer, ContractFactory, Contract, BaseContract } from 'ethers';
import { NewContract } from './definitions';
import { moneyContractABI, moneyContractBytecode, timeContractABI, timeContractBytecode } from './contract-data';


interface TimeContract extends BaseContract {
  getDeploymentTime: () => Promise<bigint>;
  getTotalDeposits: () => Promise<bigint>;
  getWithdrawalUnlockTime: () => Promise<bigint>;
  canWithdraw: () => Promise<boolean>;
  getContractBalance: () => Promise<bigint>;
}

interface MoneyContract extends BaseContract {
  getDeploymentTime: () => Promise<bigint>;
  getTotalDeposits: () => Promise<bigint>;
  getWithdrawalTargetAmount: () => Promise<bigint>; 
  canWithdraw: () => Promise<boolean>;
  getContractBalance: () => Promise<bigint>;
}

/* Time Contract */
export async function deployTimeContract(signer: Signer, newContract: NewContract) {
  try {
    // Create contract factory
    const factory = new ContractFactory(
      timeContractABI,
      timeContractBytecode,
      signer
    );
    const { currentAmount, unlockTimestamp } = newContract;

    // Validate unlockTimestamp
    if (typeof unlockTimestamp !== 'string') {
      throw new Error('unlockTimestamp must be a valid timestamp string');
    }

    // Deploy with constructor arguments if needed
    const contract = await factory.deploy(
      parseInt(unlockTimestamp),
      { value: currentAmount }
    );
    
    // Wait for deployment to complete
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    await getTimeLog(contract);
    return address;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

export async function depositTimeContract(signer: Signer, address: string, depositAmount: bigint) {
  try {   
    const contract = new Contract(address, timeContractABI, signer);
    await getTimeLog(contract);
    await contract.deposit({
      value: depositAmount
    });
    await contract.waitForDeployment();
  } catch (error) {
    console.error('Deposit failed:', error);
    throw error;
  }
}

export async function withdrawTimeContract(signer: Signer, address: string) {
  try {   
    const contract = new Contract(address, timeContractABI, signer);
    await getTimeLog(contract);
    await contract.withdraw();
    await contract.waitForDeployment();
  } catch (error) {
    console.error('Withdraw failed:', error);
    throw error;
  }
}


/* Money Contract */
export async function deployMoneyContract(signer: Signer, newContract: NewContract) {
  try {
    // Create contract factory
    const factory = new ContractFactory(
      moneyContractABI,
      moneyContractBytecode,
      signer
    );
    const { owner, currentAmount, targetAmount } = newContract;

    // Deploy with constructor arguments if needed
    const contract = await factory.deploy(
      targetAmount,
      { value: currentAmount }
    );
    
    // Wait for deployment to complete
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    await getMoneyLog(contract);
    return address;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

export async function depositMoneyContract(signer: Signer, address: string, depositAmount: bigint) {
  try {   
    const contract = new Contract(address, moneyContractABI, signer);
    await getMoneyLog(contract);
    await contract.deposit({
      value: depositAmount
    });
    await contract.waitForDeployment();
  } catch (error) {
    console.error('Deposit failed:', error);
    throw error;
  }
}

export async function withdrawMoneyContract(signer: Signer, address: string) {
  try {   
    const contract = new Contract(address, moneyContractABI, signer);
    await getMoneyLog(contract);
    await contract.withdraw();
    await contract.waitForDeployment();
  } catch (error) {
    console.error('Withdraw failed:', error);
    throw error;
  }
}




export async function updateContractsFromChain() {
  // 1. get all contracts of owner
  // 2. for each, reload from chain and update status
  // 3. write new status to database
  // 4. return true if success
  console.log("reload data from contracts!")
}


async function getTimeLog(contract: BaseContract) {
  const timeContract = contract as TimeContract;
  
  const address = await timeContract.getAddress();
  console.log('Time Contract deployed at:', address);
  

  const deploymentTime = await timeContract.getDeploymentTime();
  const totalDeposits = await timeContract.getTotalDeposits();
  const unlockTime = await timeContract.getWithdrawalUnlockTime(); 
  const canWithdraw = await timeContract.canWithdraw();
  const contractBalance = await timeContract.getContractBalance();
  
  console.log('Time Contract Status:', {
    deploymentTime: Number(deploymentTime),
    totalDeposits: Number(totalDeposits),
    unlockTime: Number(unlockTime),
    canWithdraw,
    contractBalance: Number(contractBalance)
  });
}


async function getMoneyLog(contract: BaseContract) {
  const moneyContract = contract as MoneyContract; 
  
  const address = await moneyContract.getAddress();
  console.log('Money Contract deployed at:', address);
  

  const deploymentTime = await moneyContract.getDeploymentTime();
  const totalDeposits = await moneyContract.getTotalDeposits();
  const targetAmount = await moneyContract.getWithdrawalTargetAmount(); 
  const canWithdraw = await moneyContract.canWithdraw();
  const contractBalance = await moneyContract.getContractBalance();
  
  console.log('Money Contract Status:', {
    deploymentTime: Number(deploymentTime),
    totalDeposits: Number(totalDeposits),
    targetAmount: Number(targetAmount),
    canWithdraw,
    contractBalance: Number(contractBalance)
  });
}

// async function getTimeLog(contract: BaseContract) {


//   const address = await contract.getAddress();
//   console.log('Contract deployed at:', address);
//   const deploymentTime = await contract.getDeploymentTime();
//   const totalDeposits = await contract.getTotalDeposits();
//   const unlockTime = await contract.getWithdrawalUnlockTime();
//   const canWithdraw = await contract.canWithdraw();
//   const contractBalance = await contract.getContractBalance();
//   console.log({
//     deploymentTime: deploymentTime,
//     totalDeposits: totalDeposits,
//     unlockTime: unlockTime,
//     canWithdraw: canWithdraw,
//     contractBalance: contractBalance
//   })
// }

// async function getMoneyLog(contract: BaseContract) {
//   const address = await contract.getAddress();
//   console.log('Contract deployed at:', address);
//   const deploymentTime = await contract.getDeploymentTime();
//   const totalDeposits = await contract.getTotalDeposits();
//   const targetAmount = await contract.getWithdrawalTargetAmount();
//   const canWithdraw = await contract.canWithdraw();
//   const contractBalance = await contract.getContractBalance();
//   console.log({
//     deploymentTime: deploymentTime,
//     totalDeposits: totalDeposits,
//     targetAmount: targetAmount,
//     canWithdraw: canWithdraw,
//     contractBalance: contractBalance
//   })
// }