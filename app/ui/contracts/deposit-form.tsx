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
import { deposit, DepositState } from '@/app/lib/actions';
import { useActionState, useState } from 'react';
import CheckBalanceButton from './check-balance-button';
import { formatTimestampToTime, formatWeiToEther } from '@/app/lib/utils';
import { depositMoneyContract, depositTimeContract } from '@/app/lib/ether';
import { parseUnits } from 'ethers';
import { useWallet, useLoading } from '@/app/lib/context';

export default function DepositForm({
  contract,
}: {
  contract: ContractData;
}) {
  const { setIsLoading } = useLoading();
  const { signer } = useWallet();
  const initialState: DepositState = { errors: {}, message: null };
  const [state, formAction] = useActionState(deposit, initialState);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const address = formData.get('address')?.toString();
    const depositAmount = parseUnits(formData.get('depositAmount').toString(), 'ether');
    try {
      setIsLoading(true);
      if(contract.type === 'time') {
        await depositTimeContract(signer, address, depositAmount);
      } else {
        await depositMoneyContract(signer, address, depositAmount);
      }
      formAction(formData);
      alert('Deposit success!');
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


        {/* Target Time */}
        {
          contract.type==='time' &&
          <div className="mb-4">
            <label htmlFor="unlockTimestamp" className="mb-2 block text-sm font-medium">
              Unlock Time
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="unlockTimestamp"
                  name="unlockTimestamp"
                  type="datetime-local"
                  value={formatTimestampToTime(contract.unlockTimestamp)}
                  readOnly
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        }

        {/* Target Amount */}
        {
          contract.type==='money' &&
          <div className="mb-4">
            <label htmlFor="targetAmount" className="mb-2 block text-sm font-medium">
              Target Amount (ETH)
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  step="0.0001"
                  value={formatWeiToEther(contract.targetAmount)}
                  readOnly
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
        }



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
                step="0.0001"
                min={0}
                defaultValue={0}
                placeholder="Enter ETH amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* <div>
          {
            state.errors?.depositAmount &&
            state.errors.depositAmount.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))
          }
        </div> */}

        <CheckBalanceButton />
        {/* <div>
          {
            state.message &&
              <p className="mt-2 text-sm text-red-500">
                {state.message}
              </p>
          }
        </div> */}
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
