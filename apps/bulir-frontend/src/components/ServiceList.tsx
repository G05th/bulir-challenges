'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { contractService, listAllServices } from '../services/service.service';
import { Service } from '../types/api';

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContracting, setIsContracting] = useState(false);

  const { role, isAuthenticated, balance, updateBalance } = useAuth();
  const isClient = role === 'CLIENT';

  const handleContract = async (service: Service) => {
    if (!window.confirm(`Tem certeza que deseja contratar "${service.title}" por R$ ${service.price.toFixed(2)}?`)) {
        return;
    }

    setIsContracting(true);
    setError(null);
    try {
        const { newClientBalance } = await contractService({ serviceId: service.id });

        updateBalance(newClientBalance);

        alert(`Serviço contratado com sucesso! Saldo atual: R$ ${newClientBalance.toFixed(2)}.`);

    } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'Falha na contratação do serviço.';
        setError(errorMessage);
        alert(errorMessage);
    } finally {
        setIsContracting(false);
    }
  };

  const loadServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAllServices();
      setServices(data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Falha ao carregar serviços.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);


  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {

    const hasSufficientBalance = isClient && balance >= service.price;

    return (
      <li key={service.id} className="card flex flex-col justify-between">
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-2">
          <h3 className="text-xl font-semibold text-blue-600 mb-2">{service.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
          <span className="text-lg font-bold text-green-700">R$ {service.price.toFixed(2)}</span>

          {isClient && (
            <button
              onClick={() => handleContract(service)}
              disabled={!hasSufficientBalance || isContracting}
              title={!hasSufficientBalance ? `Saldo insuficiente (Saldo: R$ ${balance.toFixed(2)})` : ''}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isContracting ? 'Processando...' : 'Contratar'}
            </button>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {error && <div className="text-center p-3 mb-4 text-red-600 bg-red-100 rounded">{error}</div>}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map(s => <ServiceCard key={s.id} service={s} />)}
      </ul>
    </div>
  );
};

export default ServiceList;
