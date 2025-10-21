'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { createService } from '../services/service.service';

const schema = yup.object({
  title: yup.string().required('Título é obrigatório'),
  description: yup.string().required('Descrição é obrigatória'),
  price: yup
    .number()
    .required('Preço é obrigatório')
    .min(0.01, 'O preço deve ser maior que zero')
    .typeError('O preço deve ser um número válido')
}).required();

type FormData = yup.InferType<typeof schema>;

const ManageServiceForm: React.FC = () => {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setSuccessMessage('');
    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: data.price,
      };

      const newService = await createService(payload);

      setSuccessMessage(`Serviço "${newService.name}" criado com sucesso!`);
      reset();

    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Falha ao criar serviço.';
      alert(errorMessage);
    }
  };

  return (
    <div className="card mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Criar Novo Serviço</h2>

      {successMessage && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input {...register('title')} className="w-full border p-2 rounded" placeholder="Ex: Consultoria de Marketing" />
          {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title.message}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Descrição</label>
          <textarea {...register('description')} rows={3} className="w-full border p-2 rounded" placeholder="Descreva em detalhe o que o serviço inclui." />
          {errors.description && <div className="text-red-600 text-sm mt-1">{errors.description.message}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full border p-2 rounded"
            placeholder="Ex: 50.00"
          />
          {errors.price && <div className="text-red-600 text-sm mt-1">{errors.price.message}</div>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
          >
            {isSubmitting ? 'A criar...' : 'Criar Serviço'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageServiceForm;
