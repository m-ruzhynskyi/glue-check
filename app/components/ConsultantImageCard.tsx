'use client';

import { useState } from 'react';

interface ConsultantImageCardProps {
  id: string;
  name: string;
  onSubmit: (id: string, length: number) => void;
}

export default function ConsultantImageCard({ id, name, onSubmit }: ConsultantImageCardProps) {
  const [length, setLength] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!length || isNaN(Number(length)) || Number(length) <= 0) {
      setError('Будь-ласка введіть довжину (більшу 0)');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(id, Number(length));
      setLength('');
    } catch (err) {
      setError('Щось пішло не так.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <img
          src={`/api/images/${id}/data`}
          alt={name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">{name}</h3>

        {error && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <div className="mt-4">
          <label htmlFor={`length-${id}`} className="block text-sm font-medium text-gray-700 mb-1">
            Довжина (метри)
          </label>
          <div className="flex space-x-2">
            <input
              id={`length-${id}`}
              type="number"
              step="0.01"
              min="0.01"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Введіть довжину..."
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Збереження...' : 'Зберегти'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
