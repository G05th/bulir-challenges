export type Role = 'CLIENT' | 'PROVIDER';

export interface User {
  id: number;
  email: string;
  nif?: string;
  fullName: string;
  role: Role;
  balance: number;
}

export interface Service {
  id: number;
  providerId: number;
  title: string;
  description: string;
  price: number;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export type TransactionType = 'RESERVE' | 'REFUND';

export interface Transaction {
  id: number;
  type: 'DEBIT' | 'CREDIT';
  fromUserId: number;
  toUserId: number;
  amount: number;
  createdAt: string;
}
