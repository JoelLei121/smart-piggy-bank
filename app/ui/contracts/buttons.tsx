import { 
  PencilIcon, 
  PlusIcon, 
  BanknotesIcon, 
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateContract() {
  return (
    <Link
      href="/dashboard/contracts/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Contract</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateContract({ 
  address, 
}: { 
  address: string,
}) {
  return (
    <Link
      href={`/dashboard/contracts/${address}/deposit`}
      className={`flex rounded-md border p-2 hover:bg-gray-100`}
    >
      Deposit
      <PencilIcon className="w-5 ml-2" />
    </Link>
  );
}


export function WithdrawButton({ address }: { address: string }) {
  return (
    <Link
      href={`/dashboard/contracts/${address}/withdraw`}
      className={`flex rounded-md bg-yellow-500 text-white p-2 hover:bg-yellow-300`}
    >
      Withdraw
      <BanknotesIcon className="w-5 ml-2" />
    </Link>
  );
}

export function ReloadButton({ reload }: { reload: () => void}) {
  return (
    <div className='flex justify-center font-medium px-3 py-5'
      onClick={() => reload()}
    >
      Reload
      <ArrowPathIcon className="w-5 ml-2" />
    </div>
  );
}