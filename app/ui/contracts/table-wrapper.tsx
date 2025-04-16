'use client';

import Table from '@/app/ui/contracts/table';
import { useWallet } from '@/app/lib/context';
import { Suspense, useEffect, useState } from 'react';
import { InvoicesTableSkeleton } from '../skeletons';
import { getFilteredContractsApi } from '@/app/lib/data';
import { updateContractsFromChain } from '@/app/lib/ether';
import { ContractData } from '@/app/lib/definitions';

export default function TableWrapper({
  query,
  currentPage
}: {
  query: string;
  currentPage: number;
}) {
  const { walletAddress } = useWallet();
  const [contracts, setContracts] = useState<ContractData[]>([]);

  const reloadContracts = async () => {
    await updateContractsFromChain();
    await loadData();
  }

  const loadData = async () => {
    const result = await getFilteredContractsApi(walletAddress||"", query, currentPage);
    setContracts(result);
  };
  useEffect(() => {
    loadData();
  }, [walletAddress, query, currentPage]);

  return (
    <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
      <Table contracts={contracts} reload={reloadContracts}/>
    </Suspense>
  );
}

