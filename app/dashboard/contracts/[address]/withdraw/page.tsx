import Form from '@/app/ui/contracts/withdraw-form';
import Breadcrumbs from '@/app/ui/contracts/breadcrumbs';
import { notFound } from 'next/navigation'; 
import { getContractByAddressApi } from '@/app/lib/data';

export default async function Page(props: {
  params: Promise<{ address: string }>
}) {
  const params = await props.params;
  const address = params.address;
  const contract = await getContractByAddressApi(address);
  
  if (!contract) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Contracts', href: '/dashboard/contracts' },
          {
            label: 'Withdraw',
            href: `/dashboard/contracts/${address}/withdraw`,
            active: true,
          },
        ]}
      />
      <Form contract={contract}/>
    </main>
  );
}