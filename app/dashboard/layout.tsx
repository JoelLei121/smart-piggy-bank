import SideNav from '@/app/ui/dashboard/sidenav';
import ProtectedRoute from '../ui/protected-route';
import LoadingLayer from '../ui/Loading';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <LoadingLayer />
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </div>
  </div>
    
  );
}