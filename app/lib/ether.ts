'use client';

import { Signer, ContractFactory, Contract, BaseContract } from 'ethers';
import { NewContract } from './definitions';
import { moneyContractABI, moneyContractBytecode, timeContractABI, timeContractBytecode } from './contract-data';

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
  const address = await contract.getAddress();
  console.log('Contract deployed at:', address);
  const deploymentTime = await contract.getDeploymentTime();
  const totalDeposits = await contract.getTotalDeposits();
  const unlockTime = await contract.getWithdrawalUnlockTime();
  const canWithdraw = await contract.canWithdraw();
  const contractBalance = await contract.getContractBalance();
  console.log({
    deploymentTime: deploymentTime,
    totalDeposits: totalDeposits,
    unlockTime: unlockTime,
    canWithdraw: canWithdraw,
    contractBalance: contractBalance
  })
}

async function getMoneyLog(contract: BaseContract) {
  const address = await contract.getAddress();
  console.log('Contract deployed at:', address);
  const deploymentTime = await contract.getDeploymentTime();
  const totalDeposits = await contract.getTotalDeposits();
  const targetAmount = await contract.getWithdrawalTargetAmount();
  const canWithdraw = await contract.canWithdraw();
  const contractBalance = await contract.getContractBalance();
  console.log({
    deploymentTime: deploymentTime,
    totalDeposits: totalDeposits,
    targetAmount: targetAmount,
    canWithdraw: canWithdraw,
    contractBalance: contractBalance
  })
}