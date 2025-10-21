import { Transaction } from '../types/api';
import { api } from './api';

export const listTransactions = async (): Promise<Transaction[]> => {
    const { data } = await api.get<Transaction[]>('/transactions');

    return data;
};
