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


type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType|undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const value = {
    isLoading, setIsLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export function useLoading(): LoadingContextType {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading failed');
  }
  return context;
};