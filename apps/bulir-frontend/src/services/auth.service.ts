// src/services/auth.service.ts

import { AuthResponse, Role } from '../types/api';
import { api } from './api';

const adaptLoginData = (identifier: string, password: string) => {
    const isNif = /^\d{9}$/.test(identifier.trim());

    return {
        password,
        ...(isNif ? { nif: identifier } : { email: identifier }),
    };
};

export const login = async (identifier: string, password: string): Promise<AuthResponse> => {
    const payload = adaptLoginData(identifier, password);

    const { data } = await api.post<AuthResponse>('/auth/login', payload);

    return data;
};

interface RegisterPayload {
    fullName: string;
    email: string;
    password: string;
    role: Role;
    nif?: string;
}

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);

    return data;
};
