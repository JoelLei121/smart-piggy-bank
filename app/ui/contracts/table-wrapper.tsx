'use client';

import Table from '@/app/ui/contracts/table';
import { useWallet } from '@/app/lib/context';
import { Suspense, useEffect, useState } from 'react';
import { InvoicesTableSkeleton } from '../skeletons';
import { getFilteredContractsApi } from '@/app/lib/data';
import { Contract } from '@/app/lib/definitions';

export default function TableWrapper({
  query,
  currentPage
}: {
  query: string;
  currentPage: number;
}) {
  const { walletAddress } = useWallet();
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await getFilteredContractsApi(walletAddress||"", query, currentPage);
      setContracts(result);
    };
    loadData();
  }, [walletAddress, query, currentPage]);

  return (
    <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
      <Table contracts={contracts}/>
    </Suspense>
  );
}

