'use client';

import { PowerIcon } from "@heroicons/react/24/outline";
import { useWallet } from "../lib/context";
import { redirect } from 'next/navigation';
import { ethers } from "ethers";

export default function WalletConnectButton() {
  const { 
    walletAddress, setWalletAddress, 
    isConnecting, setIsConnecting,
    error,
    setProvider
  } = useWallet();

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setWalletAddress(accounts[0]);
      setProvider(new ethers.BrowserProvider(window.ethereum));
      alert('Wallet is connected!');
      redirect('/dashboard/contracts');
    } catch (err) {
      console.error("User rejected request:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    alert('Disconnected!');
    redirect('/dashboard');
  };

  if (walletAddress) {
    return (
      <div>
        {/* <p>Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p> */}
        <button 
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md text-white bg-blue-500 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          onClick={handleDisconnect}
        >
          <PowerIcon className="w-6" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md text-white bg-blue-500 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        // className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        onClick={handleConnect}
        disabled={isConnecting}
      >
        <PowerIcon className="w-6" />
        {isConnecting ? 'Connecting...' : 'Connect to Wallet'}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}