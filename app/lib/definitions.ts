export type NewContract = {
  owner: string;
  currentAmount: bigint;
  type: 'money' | 'time';
  targetAmount: bigint | undefined;
  timestamp: string | undefined;
};

export type ContractData = {
  address: string;
  owner: string;
  currentAmount: bigint;
  targetAmount: bigint;
  timestamp: string;
  // contract type is the expire condition of contract
  type: 'money' | 'time';
  status: 'off-chain' | 'on-chain' | 'achieved';
};

export type ContractForm = {
  address: string;
  owner: string;
  currentAmount: bigint;
  depositAmount: bigint;
};