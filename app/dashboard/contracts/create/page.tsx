import Form from '@/app/ui/contracts/create-form';
import Breadcrumbs from '@/app/ui/contracts/breadcrumbs';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Contracts', href: '/dashboard/contracts' },
          {
            label: 'Create Contracts',
            href: '/dashboard/contracts/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}