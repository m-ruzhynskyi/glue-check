'use client';

import { useState, useEffect } from 'react';
import ImageUploadForm from './components/ImageUploadForm';
import ImageCard from './components/ImageCard';

interface Image {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);

  // Initialize the database and fetch images on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize the database
        await fetch('/api/init');

        // Fetch images
        await fetchImages();
      } catch (err) {
        setError('Failed to initialize the application. Please refresh the page.');
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Fetch images from the API
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle successful image upload or update
  const handleImageSuccess = () => {
    setShowUploadForm(false);
    setEditingImage(null);
    fetchImages();
  };

  // Handle image edit
  const handleEditImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image) {
      setEditingImage(image);
      setShowUploadForm(true);
    }
  };

  // Handle image delete
  const handleDeleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Jysk Image Gallery</h1>
          {!showUploadForm && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-4 py-2 bg-white text-blue-900 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Add New Image
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Upload/Edit Form */}
        {showUploadForm && (
          <div className="mb-8">
            <ImageUploadForm
              onSuccess={handleImageSuccess}
              initialData={editingImage ? { id: editingImage.id, name: editingImage.name } : undefined}
              onCancel={() => {
                setShowUploadForm(false);
                setEditingImage(null);
              }}
            />
          </div>
        )}

        {/* Image Gallery */}
        <div>
          <h2 className="text-xl font-bold text-blue-900 mb-4">Your Images</h2>

          {loading ? (
            <div className="text-center p-8">
              <p>Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">No images found. Add your first image!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(image => (
                <ImageCard
                  key={image.id}
                  id={image.id}
                  name={image.name}
                  createdAt={image.created_at}
                  onEdit={handleEditImage}
                  onDelete={handleDeleteImage}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Jysk Image Gallery</p>
        </div>
      </footer>
    </div>
  );
}
