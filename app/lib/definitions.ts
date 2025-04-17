export type NewContract = {
  owner: string;
  currentAmount: bigint;
  type: 'money' | 'time';
  targetAmount: bigint | undefined;
  unlockTimestamp: string | undefined;
};

export type ContractData = {
  address: string;
  owner: string;
  currentAmount: bigint;
  targetAmount: bigint;
  unlockTimestamp: string;
  // contract type is the expire condition of contract
  type: 'money' | 'time';
  status: 'off-chain' | 'on-chain' | 'achieved';
};

// export type DepositForm = {
//   address: string;
//   owner: string;
//   currentAmount: bigint;
//   depositAmount: bigint;
// };