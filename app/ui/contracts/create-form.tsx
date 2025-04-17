'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createContract, CreateState } from '@/app/lib/actions';
import { useWallet, useLoading } from '@/app/lib/context';
import CheckBalanceButton from './check-balance-button';
import { deployMoneyContract, deployTimeContract } from '@/app/lib/ether';
import { NewContract } from '@/app/lib/definitions';
import { parseUnits } from 'ethers';
import { useFormState } from 'react-dom';
export default function Form() {
  const { walletAddress, signer } = useWallet();
  const { setIsLoading } = useLoading();
  const initialState: CreateState = { message: null, errors: {} };
  const [state, formAction] = useFormState(createContract, initialState);
  // const [state, formAction] = useActionState<CreateState>(createContract, initialState);
  const [contractType, setType] = useState('time');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentAmountInput = formData.get('currentAmount');
      if (!currentAmountInput) {
        throw new Error('Current amount is required');
      }
    const parseData = {
      owner: formData.get('owner')?.toString(),
      type: formData.get('type')?.toString(),
      
      currentAmount : parseUnits(currentAmountInput.toString(), 'ether'),
      // currentAmount: parseUnits(formData.get('currentAmount').toString(), 'ether'),
      unlockTimestamp: formData.get('unlockTimestamp'),
      targetAmount: undefined
    };
    const newContract: NewContract = parseData as NewContract;
    let address: string = "";
    try {
      setIsLoading(true);
      if (!signer) {
        alert("Wallet not connected.");
        return;
      }
      if(parseData.type === 'time') {
        const msec = new Date(newContract.unlockTimestamp as string).getTime()
        newContract.unlockTimestamp = (msec / 1000).toString();
        address = await deployTimeContract(signer, newContract);
      } else {
        const targetAmountRaw = formData.get('targetAmount');
        if (!targetAmountRaw) {
          alert("Please enter a target amount.");
          return;
        }
        newContract.targetAmount = parseUnits(targetAmountRaw.toString(), 'ether');
        // newContract.targetAmount = parseUnits(formData.get('targetAmount').toString(), 'ether');
        address = await deployMoneyContract(signer, newContract);
      }
      formData.append('address', address);
      formAction(formData);
      alert('deploy success!');
    } catch(error) {
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={formAction} onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* User Wallet */}
        <div className="mb-4">
          <label htmlFor="owner" className="mb-2 block text-sm font-medium">
            User Wallet Address
          </label>
          <div className="relative">
            <input
              id="owner"
              name="owner"
              type="text"
              placeholder="Enter Owner Wallet Address"
              defaultValue={walletAddress ? walletAddress : ""}
              readOnly
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          <div>
            {
              state.errors?.owner &&
              state.errors.owner.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))
            }
          </div>
        </div>

        {/* Contract Type */}
        <fieldset className="mb-4" onChange={(e) => {
          const value = (e.target as HTMLInputElement).value;
          setType(value);
          // setType(e.target.value);
           }}>
          <legend className="mb-2 block text-sm font-medium">
            Select Contract Type
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="time"
                  name="type"
                  type="radio"
                  value="time"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="time"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  By Time <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="money"
                  name="type"
                  type="radio"
                  value="money"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="money"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  By Money <CurrencyDollarIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
          <div>
            {
              state.errors?.type &&
              state.errors.type.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))
            }
          </div>
        </fieldset>

        {/* Target Time */}
        {
          contractType==='time' &&
          <div className="mb-4">
            <label htmlFor="unlockTimestamp" className="mb-2 block text-sm font-medium">
              Choose a Target Date
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="unlockTimestamp"
                  name="unlockTimestamp"
                  type="datetime-local"
                  required
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div>
              {
                state.errors?.unlockTimestamp &&
                state.errors.unlockTimestamp.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))
              }
            </div>
          </div>
        }

        {/* Target Amount */}
        {
          contractType==='money' &&
          <div className="mb-4">
            <label htmlFor="targetAmount" className="mb-2 block text-sm font-medium">
              Choose a Target Amount (ETH)
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  step="0.0001"
                  placeholder="Enter ETH amount"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
            <div>
              {
                state.errors?.targetAmount &&
                state.errors.targetAmount.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))
              }
            </div>
          </div>
        }

        {/* Initial Amount */}
        <div className="mb-4">
          <label htmlFor="currentAmount" className="mb-2 block text-sm font-medium">
            (Optional) Give an Initial Amount (ETH)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="currentAmount"
                name="currentAmount"
                type="number"
                step="0.0001"
                defaultValue={0}
                min={0}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby='amount-error'
              />
              <CurrencyDollarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div>
            {
              state.errors?.currentAmount &&
              state.errors.currentAmount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))
            }
          </div>
        </div>

        <CheckBalanceButton />

        <div>
          {
            state.message &&
            <p className="mt-2 text-sm text-red-500" key={state.message}>
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
        <Button type="submit">Create Contract</Button>
      </div>
    </form>
  );
}
