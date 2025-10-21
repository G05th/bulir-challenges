'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listTransactions } from '../services/transaction.service';
import { Transaction } from '../types/api';

interface HistoryItem extends Transaction {
    description: string;
    isCredit: boolean;
}

const TransactionHistory: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user, role } = useAuth(); // Usamos o ID do user logado para dar contexto

    const loadHistory = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            const rawData = await listTransactions();

            const formattedHistory: HistoryItem[] = rawData.map(tx => {
                const isCredit = tx.toUserId === user.id;
                const targetId = isCredit ? tx.fromUserId : tx.toUserId;

                let description = '';
                if (isCredit) {
                    description = `Recebido de ${targetId} por Serviço Prestado`;
                } else {
                    description = `Pago a ${targetId} por Contratação`;
                }

                return {
                    ...tx,
                    description: description,
                    isCredit: isCredit,
                    createdAt: new Date(tx.createdAt).toLocaleDateString('pt-BR', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })
                };
            }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setHistory(formattedHistory);

        } catch (err: any) {
            setError(err?.response?.data?.message || 'Falha ao carregar histórico.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, [user]);

    if (loading) {
        return <div className="text-center p-8">Carregando histórico...</div>;
    }
    if (error) {
        return <div className="text-center p-8 text-red-600">Erro: {error}</div>;
    }
    if (history.length === 0) {
        return <div className="text-center p-8 text-gray-500">Nenhuma transação encontrada.</div>;
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {history.map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.createdAt}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.description}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${tx.isCredit ? 'text-green-600' : 'text-red-600'}`}>
                                {tx.isCredit ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.isCredit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {tx.isCredit ? 'CRÉDITO' : 'DÉBITO'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;
