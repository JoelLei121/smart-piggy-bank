import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function ContractStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-gray-100 text-gray-500': status === 'off-chain',
          'bg-green-500 text-white': status === 'on-chain',
          'bg-yellow-400': status === 'achieved',
        },
      )}
    >
      {status === 'off-chain' ? (
        <>
          Off-Chain
          <ClockIcon className="ml-1 w-4 text-gray-500" />
        </>
      ) : null}
      {status === 'on-chain' ? (
        <>
          On-Chain
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'achieved' ? (
        <>
          achieved
          <CheckIcon className="ml-1 w-4" />
        </>
      ) : null}
    </span>
  );
}
