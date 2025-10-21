'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Resolver, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/api';

const schema = yup
  .object({
    fullName: yup.string().required('Nome completo é obrigatório'),
    email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
    password: yup.string().min(6, 'Mínimo de 6 caracteres').required('Senha é obrigatória'),

    // aceita string vazia ou 9 dígitos; é opcional/nullable
    nif: yup
      .string()
      .nullable()
      .notRequired()
      .transform((value) => (value === '' ? null : value))
      .matches(/^(\d{9})?$/, 'NIF deve ter 9 dígitos'),

    role: yup.string().oneOf(['CLIENT', 'PROVIDER']).required('Selecione um papel (Cliente/Fornecedor)'),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

const RegisterForm: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as Resolver<FormData, any>,
    defaultValues: { role: 'CLIENT' },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      await registerAuth({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role as Role,
        nif: data.nif || undefined,
      });

      router.push('/');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Falha no registo';

      if (errorMessage.includes('email') || errorMessage.includes('Email')) {
        setError('email', { type: 'manual', message: errorMessage });
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl mb-4 text-gray-700">Registar</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
          <input {...register('fullName')} className="w-full border p-2 rounded" />
          {errors.fullName && <div className="text-red-600 text-sm mt-1">{errors.fullName.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail</label>
          <input {...register('email')} className="w-full border p-2 rounded" />
          {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input type="password" {...register('password')} className="w-full border p-2 rounded" />
          {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NIF (Opcional)</label>
          <input {...register('nif')} className="w-full border p-2 rounded" placeholder="9 dígitos" />
          {errors.nif && <div className="text-red-600 text-sm mt-1">{errors.nif.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Papel</label>
          <select {...register('role')} className="w-full border p-2 rounded">
            <option value="CLIENT">Cliente</option>
            <option value="PROVIDER">Fornecedor</option>
          </select>
          {errors.role && <div className="text-red-600 text-sm mt-1">{errors.role.message}</div>}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
          >
            {isSubmitting ? 'A registar...' : 'Registar'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 pt-2">
          Já tem conta? <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">Entrar aqui</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
