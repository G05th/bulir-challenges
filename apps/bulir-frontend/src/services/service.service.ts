import { Service } from '../types/api';
import { api } from './api';

interface CreateServicePayload {
    title: string;
    description: string;
    price: number;
}

interface ContractServicePayload {
    serviceId: number;
}

export const createService = async (payload: CreateServicePayload): Promise<Service> => {
    const { data } = await api.post<Service>('/services', payload);
    return data;
};

export const listAllServices = async (): Promise<Service[]> => {
    const { data } = await api.get<Service[]>('/services');

    return data;
};

export const contractService = async (payload: ContractServicePayload): Promise<{ newClientBalance: number }> => {
    const { data } = await api.post<{ newClientBalance: number }>('/services/contract', payload);

    return data;
};
