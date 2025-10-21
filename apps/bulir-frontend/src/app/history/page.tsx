import RoleGuard from '../../components/RoleGuard';
import TransactionHistory from '../../components/TransactionHistory';
export default function HistoryPage() {
  return (

    <RoleGuard allowedRoles={['CLIENT', 'PROVIDER']}>
      <main className="page max-w-4xl mx-auto pt-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Histórico de Transações</h1>
        <TransactionHistory />
      </main>
    </RoleGuard>
  );
}
