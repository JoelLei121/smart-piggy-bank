import { lusitana } from '@/app/ui/fonts';
import { redirect } from 'next/navigation';

export default async function Page() {
  redirect('/dashboard/contracts')
  return (
    <main>
      <div className='flex mb-5'>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl grow`}>
          Dashboard
        </h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense> */}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-8 lg:grid-cols-16">
        {/* <Suspense fallback={<RevenueChartSkeleton />}>
          <ContractTable />
        </Suspense> */}
      </div>
    </main>
  );
}