'use client';

import { ContractForm } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { deposit, DepositState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import CheckBalanceButton from './check-balance-button';
import { formatWeiToEther } from '@/app/lib/utils';

export default function DepositForm({
  contract,
}: {
  contract: ContractForm;
}) {
  const initialState: DepositState = { errors: {}, message: null };
  const depositWithAddress = deposit.bind(null, contract.address);
  const [state, formAction] = useActionState(depositWithAddress, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Contract Address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Contract Address
          </label>
          <div className="relative">
          <input
              id="address"
              name="address"
              type="text"
              placeholder="Example Contract Address"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={contract.address}
              readOnly
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Contract Owner */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Contract Owner
          </label>
          <div className="relative">
          <input
              id="owner"
              name="owner"
              type="text"
              placeholder="Example Owner Wallet Address Here"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue={contract.owner}
              readOnly
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Current Amount */}
        <div className="mb-4">
          <label htmlFor="currentAmount" className="mb-2 block text-sm font-medium">
            Current Amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="currentAmount"
                name="currentAmount"
                type="number"
                defaultValue={formatWeiToEther(contract.currentAmount)}
                readOnly
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="mb-4">
          <label htmlFor="depositAmount" className="mb-2 block text-sm font-medium">
            Deposit Amount
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="depositAmount"
                name="depositAmount"
                type="number"
                step="0.01"
                min={0}
                defaultValue={0}
                placeholder="Enter ETH amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <div>
          {
            state.errors?.depositAmount &&
            state.errors.depositAmount.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))
          }
        </div>

        <CheckBalanceButton />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/contracts"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Deposit</Button>
      </div>
    </form>
  );
}
