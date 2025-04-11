'use client';

import { useState } from "react";
import { useWallet } from "@/app/lib/context";
import { AddressLike, EtherSymbol, formatEther } from "ethers";

export default function CheckBalanceButton() {
  const {
    walletAddress, provider
  } = useWallet();
  const [balance, setBalance] = useState("");
  const [networkName, setName] = useState("");

  const handleGetBalance = async () => {
    if (walletAddress && provider) {
      const address: AddressLike = walletAddress;
      const tempBalance = await provider.getBalance(address);
      const balanceInEth = formatEther(tempBalance);
      setBalance(balanceInEth);
      const network = await provider.getNetwork();
      setName(network.name);
    }
  }

  return (
    <div className='flex mb-3'>
      <a onClick={() => {handleGetBalance()}} className='underline text-blue-500 hover:text-blue-700'>
        Check Balance
      </a>
      {
        balance != "" &&
        <p className="grow ml-6 block font-medium text-gray-700">
          {networkName} ETH: {balance}
        </p>
      }
    </div>
  )
    
}