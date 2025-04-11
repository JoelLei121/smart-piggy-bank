import Pagination from '@/app/ui/contracts/pagination';
import Search from '@/app/ui/search';
import { CreateContract } from '@/app/ui/contracts/buttons';
import { lusitana } from '@/app/ui/fonts';
import TableWrapper from '@/app/ui/contracts/table-wrapper';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Contracts</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search contracts..." />
        <CreateContract />
      </div>
      <TableWrapper query={query} currentPage={currentPage} />
      <div className="mt-5 flex w-full justify-center">
        <Pagination query={query}/>
      </div>
    </div>
  );
}