import ManageServiceForm from '../../components/ManageServiceForm';
import RoleGuard from '../../components/RoleGuard';

export default function ManagePage() {
  return (
    <RoleGuard allowedRoles={['PROVIDER']}>
      <main className="page max-w-2xl mx-auto pt-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Gerir Serviços</h1>

        <ManageServiceForm />
      </main>
    </RoleGuard>
  );
}
