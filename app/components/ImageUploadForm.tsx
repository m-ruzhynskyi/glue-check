'use client';

import { useState, FormEvent, ChangeEvent } from 'react';

interface ImageUploadFormProps {
  onSuccess: () => void;
  initialData?: {
    id: string;
    name: string;
  };
  onCancel?: () => void;
}

export default function ImageUploadForm({ onSuccess, initialData, onCancel }: ImageUploadFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);

      if (file) {
        formData.append('file', file);
      }

      let url = '/api/images';
      let method = 'POST';

      if (isEditing) {
        url = `/api/images/${initialData.id}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setName('');
      setFile(null);
      setPreview(null);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-blue-900">
        {isEditing ? 'Edit Image' : 'Upload New Image'}
      </h2>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Image Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Image File {!isEditing && <span className="text-red-500">*</span>}
          {isEditing && <span className="text-gray-500 text-xs ml-2">(Leave empty to keep current image)</span>}
        </label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          accept="image/*"
          required={!isEditing}
        />
      </div>

      {preview && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Preview:</p>
          <img src={preview} alt="Preview" className="mt-1 max-h-40 rounded-md" />
        </div>
      )}

      {isEditing && !preview && (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Current image:</p>
          <img 
            src={`/api/images/${initialData.id}/data`} 
            alt={initialData.name} 
            className="mt-1 max-h-40 rounded-md" 
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : isEditing ? 'Update' : 'Upload'}
        </button>
      </div>
    </form>
  );
}
