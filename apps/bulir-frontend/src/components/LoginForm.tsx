'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const schema = yup.object({

  identifier: yup
    .string()
    .required('E-mail ou NIF é obrigatório'),
  password: yup.string().required('Senha é obrigatória'),
}).required();

type FormData = yup.InferType<typeof schema>;

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.identifier, data.password);

      router.push('/');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Falha no login';

      setError("identifier", { type: "manual", message: errorMessage });
      setError("password", { type: "manual", message: "" });
      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h2 className="text-2xl mb-4 text-gray-700">Entrar</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">E-mail ou NIF</label>
          <input
            {...register('identifier')}
            className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Seu email ou NIF"
          />
          {errors.identifier && <div className="text-red-600 text-sm mt-1">{errors.identifier.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            {...register('password')}
            className="w-full border p-2 rounded focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password.message}</div>}
        </div>
        <div className="flex gap-2 justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
          >
            {isSubmitting ? 'A entrar...' : 'Entrar'}
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 pt-2">
            Não tem conta? <a href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">Registe-se aqui</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
