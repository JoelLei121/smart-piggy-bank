'use client';

import { ContractData } from '@/app/lib/definitions';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { withdraw, WithdrawState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import CheckBalanceButton from './check-balance-button';
import { formatWeiToEther } from '@/app/lib/utils';
import { useLoading, useWallet } from '@/app/lib/context';
import { withdrawMoneyContract, withdrawTimeContract } from '@/app/lib/ether';

export default function WithdrawForm({
  contract,
}: {
  contract: ContractData;
}) {
  const { setIsLoading } = useLoading();
  const { signer } = useWallet();
  const initialState: WithdrawState = { message: null };
  const [state, formAction] = useActionState(withdraw, initialState);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const address = formData.get('address')?.toString();
    try {
      setIsLoading(true);
      if(contract.type === 'time') {
        await withdrawTimeContract(signer, address);
      } else {
        await withdrawMoneyContract(signer, address);
      }
      formAction(formData);
      alert('Withdraw success!');
    } catch(error) {
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
            Contract Amount
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

        <div>
        {
          state.message &&
          <p className="mt-2 text-sm text-red-500">
            {state.message}
          </p>
        }
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/contracts"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Withdraw</Button>
      </div>
    </form>
  );
}
