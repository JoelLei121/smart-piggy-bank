'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';

type WalletContextType = {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  isConnecting: boolean;
  setIsConnecting: (flag: boolean) => void;
  error: string | null;
  provider: BrowserProvider | null;
  setProvider: (provider: BrowserProvider | null) => void;
  signer: JsonRpcSigner | null;
  setSigner: (signer: JsonRpcSigner | null) => void;
}

const WalletContext = createContext<WalletContextType|undefined>(undefined);

type WalletProviderProps = {
  children: ReactNode;
};

export function WalletProvider({ children }: WalletProviderProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  // // Check if wallet is connected on component mount
  // useEffect(() => {
  //   const checkWalletConnection = async () => {
  //     if (window.ethereum) {
  //       try {
  //         const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  //         if (accounts.length > 0) {
  //           setWalletAddress(accounts[0]);
  //         }
  //       } catch (err) {
  //         console.error("Error checking wallet connection:", err);
  //       }
  //     }
  //   };

  //   checkWalletConnection();
  // }, []);

  // useEffect(() => {
  //   if (window.ethereum) {
  //     const handleAccountsChanged = (accounts: string[]) => {
  //       setWalletAddress(accounts[0] || null);
  //     };
      
  //     window.ethereum.on('accountsChanged', handleAccountsChanged);
  //     return () => {
  //       window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
  //     };
  //   }
  // }, []);

  const value = {
    walletAddress, setWalletAddress,
    isConnecting, setIsConnecting,
    error, setError,
    provider, setProvider,
    signer, setSigner
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );

}

export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}