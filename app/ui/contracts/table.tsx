import Image from 'next/image';
import { UpdateContract } from '@/app/ui/contracts/buttons';
import ContractStatus from './status';
import { formatDateToLocal, formatWeiToEther } from '@/app/lib/utils';

import { formatEther, parseUnits } from "ethers";
import { Contract } from '@/app/lib/definitions';

export default function ContractTable({
  contracts
}: {
  contracts: Contract[]
}) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6" style={{"width": '20%'}}>
                  Address
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Timestamp
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3" style={{"width": '10%'}}>
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {contracts?.map((contract: Contract) => {
                const currentAmountInEther = formatWeiToEther(contract.currentAmount);
                return (
                <tr
                  key={contract.address}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>{contract.address}</p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {
                      contract.timestamp ?
                      formatDateToLocal(contract.timestamp) :
                      "None"
                    }
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {
                      currentAmountInEther.length > 6 ?
                      `${currentAmountInEther.slice(0, 3)}...${currentAmountInEther.slice(-3)}` :
                      currentAmountInEther
                    }
                    {}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ContractStatus status={contract.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateContract address={contract.address} />
                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}
