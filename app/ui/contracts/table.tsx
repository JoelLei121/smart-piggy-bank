import Image from 'next/image';
import { ReloadButton, UpdateContract, WithdrawButton } from '@/app/ui/contracts/buttons';
import ContractStatus from './status';
import { formatDateToLocal, formatTimestampToDate, formatWeiToEther } from '@/app/lib/utils';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { ContractData } from '@/app/lib/definitions';

export default function ContractTable({
  contracts,
  reload
}: {
  contracts: ContractData[],
  reload: () => void
}) {
  const renderTime = Date.now();
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
                  Unlock Time
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Amount
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="font-medium px-3 py-5" >
                  <ReloadButton reload={reload}/>
                </th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {contracts?.map((contract: ContractData) => {
                const time = formatTimestampToDate((contract.timestamp));
                const currentAmountInEther = formatWeiToEther(contract.currentAmount);
                console.log(currentAmountInEther);
                let status: 'on-chain' | 'achieved' = 'on-chain';
                if(contract.type === 'time') {
                  if(parseInt(contract.timestamp)*1000 < renderTime) {
                    status = 'achieved';
                  }
                } else {
                  if(contract.currentAmount >= contract.targetAmount) {
                    status = 'achieved';
                  }
                }
                return (
                <tr
                  key={contract.address}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <p>
                      {
                        `${contract.address.slice(0, 8)}...${contract.address.slice(-3)}`
                      }
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {
                      contract.timestamp ? time : "None"
                    }
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {
                      currentAmountInEther.length > 6 ?
                      `${currentAmountInEther.slice(0, 3)}...${currentAmountInEther.slice(-3)}` :
                      currentAmountInEther
                    }
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <ContractStatus status={status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-3 pr-3" >
                    <div 
                      className={`flex justify-end gap-3 
                        ${status != 'on-chain' ? "hidden" : ""}`}
                    >
                      <UpdateContract address={contract.address} />
                    </div>
                    <div 
                      className={`flex justify-end gap-3 
                        ${status != 'achieved' ? "hidden" : ""}`}
                    >
                      <WithdrawButton address={contract.address} />
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
