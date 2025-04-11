'use client';

import { FaceFrownIcon } from '@heroicons/react/24/outline';
import WalletConnectButton from './wallet-connect-button';
import { useWallet } from '../lib/context';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { walletAddress } = useWallet();

  if (!walletAddress) {
    return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">Authentication Required</h2>
      <p className='mb-5'>Please connect your wallet to access this page.</p>
      <WalletConnectButton />
    </main>
    );
  }

  return <>{children}</>;
}