'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/api';

interface Props {
  allowedRoles: Role[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<Props> = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      alert("Acesso negado: Você não tem permissão para ver esta página.");
      router.replace('/');
    }

  }, [isAuthenticated, role, allowedRoles, router]);

  if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
    return <main className="page pt-16 text-center text-gray-500">A verificar permissões...</main>;
  }

  return <>{children}</>;
};

export default RoleGuard;
