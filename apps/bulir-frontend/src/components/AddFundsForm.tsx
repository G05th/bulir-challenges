'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { addFunds } from '../services/user.service';

const AddFundsForm: React.FC = () => {
    const [amount, setAmount] = useState<number | string>('');
    const [loading, setLoading] = useState(false);


    const { role, balance, updateBalance } = useAuth();

    if (role !== 'CLIENT') {
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = Number(amount);

        if (value <= 0 || isNaN(value)) {
            return alert('Por favor, insira um valor positivo e válido.');
        }

        setLoading(true);
        try {
            const { newBalance } = await addFunds({ amount: value });

            updateBalance(newBalance);

            alert(`R$ ${value.toFixed(2)} adicionados com sucesso! Novo saldo: R$ ${newBalance.toFixed(2)}`);
            setAmount('');

        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || 'Falha ao processar o depósito. Tente novamente.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-xl border border-blue-100 mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-4">
                Adicionar Fundos 💳
                <span className="text-sm font-normal text-gray-500 ml-3">
                    (Seu Saldo Atual: R$ {balance.toFixed(2)})
                </span>
            </h2>
            <form onSubmit={handleSubmit} className="flex space-x-3">
                <input
                    type="number"
                    step="0.01"
                    placeholder="Valor (Ex: 50.00)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400 transition"
                >
                    {loading ? 'Processando...' : 'Depositar'}
                </button>
            </form>
        </div>
    );
};

export default AddFundsForm;
