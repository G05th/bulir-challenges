// app/page.tsx

import AddFundsForm from '../components/AddFundsForm';
import Header from '../components/Header';
import ServiceList from '../components/ServiceList';

export default function HomePage() {
  return (
    <div className="page">
      <Header />
      <div className="flex justify-between items-center max-w-4xl mx-auto mb-6 pt-4">
        <AddFundsForm />
        <h1 className="text-3xl font-bold text-gray-800">Serviços Disponíveis</h1>
      </div>
      <ServiceList />
    </div>
  );
}
