import { api } from './api';

interface AddFundsPayload {
    amount: number;
}

interface AddFundsResponse {
    newBalance: number;
}

export const addFunds = async (payload: AddFundsPayload): Promise<AddFundsResponse> => {
    const { data } = await api.post<AddFundsResponse>('/users/funds', payload);
    return data;
};
