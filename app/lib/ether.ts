'use client';

import { Signer, ContractFactory, Contract, BaseContract } from 'ethers';
import { NewContract } from './definitions';
import { moneyContractABI, moneyContractBtyecode, timeContractABI, timeContractBtyecode } from './contract-data';

export async function deployTimeContract(signer: Signer, newContract: NewContract) {
  try {
    // Create contract factory
    const factory = new ContractFactory(
      timeContractABI,
      timeContractBtyecode,
      signer
    );
    const { owner, currentAmount, timestamp } = newContract;

    // Deploy with constructor arguments if needed
    const contract = await factory.deploy(
      parseInt(timestamp),
      { value: currentAmount }
    );
    
    // Wait for deployment to complete
    await contract.waitForDeployment();
    const address = await contract.getAddress();
    await getContractLog(contract);
    alert('deploy success!');
    return address;
  } catch (error) {
    console.error('Deployment failed:', error);
    throw error;
  }
}

export async function deployMoneyContract(signer: Signer, newContract: NewContract) {
  
}

export async function depositContract(signer: Signer, address: string, depositAmount: bigint) {
  try {   
    const contract = new Contract(address, timeContractABI, signer);
    await getContractLog(contract);
    await contract.deposit({
      value: depositAmount
    });
    await contract.waitForDeployment();
    const totalDeposits = await contract.getTotalDeposits();
    console.log(totalDeposits);
    alert('Deposit success!');
    return totalDeposits
  } catch (error) {
    console.error('Deposit failed:', error);
    throw error;
  }
}

export async function withdrawContract(signer: Signer, address: string) {
  try {   
    const contract = new Contract(address, timeContractABI, signer);
  //  await contract.setWithdrawalTime(1744807980);
    await getContractLog(contract);
    await contract.withdraw();
    await contract.waitForDeployment();
    alert('Withdraw success!');
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


async function getContractLog(contract: BaseContract) {
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