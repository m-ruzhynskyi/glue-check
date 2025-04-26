'use client';

import { useState, useEffect } from 'react';
import ImageUploadForm from './components/ImageUploadForm';
import ImageCard from './components/ImageCard';
import ConsultantImageCard from './components/ConsultantImageCard';
import CashierImageCard from './components/CashierImageCard';
import RoleSwitcher from './components/RoleSwitcher';

interface Image {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Submission {
  id: string;
  image_id: string;
  length_meters: number;
  created_at: string;
  expires_at: string;
  image_name: string;
}

type UserRole = 'admin' | 'consultant' | 'cashier';

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingImage, setEditingImage] = useState<Image | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('consultant');
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await fetch('/api/init');

        await fetchImages();

        if (userRole === 'cashier') {
          await fetchSubmissions();
        }
      } catch (err) {
        setError('Failed to initialize the application. Please refresh the page.');
        setLoading(false);
      }
    };

    initializeApp();

    const cleanupInterval = setInterval(cleanupExpiredSubmissions, 60000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [userRole]);

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

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/submissions');
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      const data = await response.json();
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cleanupExpiredSubmissions = async () => {
    try {
      await fetch('/api/submissions', { method: 'DELETE' });
      if (userRole === 'cashier') {
        await fetchSubmissions();
      }
    } catch (err) {
    }
  };

  const handleImageSuccess = () => {
    setShowUploadForm(false);
    setEditingImage(null);
    fetchImages();
  };

  const handleEditImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image) {
      setEditingImage(image);
      setShowUploadForm(true);
    }
  };

  const handleDeleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmitLength = async (imageId: string, length: number) => {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_id: imageId,
          length_meters: length,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit length');
      }

      alert('Length submitted successfully!');
    } catch (err) {
      throw err;
    }
  };

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
    if (!isAdminMode) {
      setUserRole('admin');
    } else {
      setUserRole('consultant');
    }
  };

  const handleRoleChange = (role: 'consultant' | 'cashier') => {
    setUserRole(role);
    if (role === 'cashier') {
      fetchSubmissions();
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold" onDoubleClick={toggleAdminMode}>Jysk Image Gallery</h1>

          {isAdminMode && !showUploadForm && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-4 py-2 bg-white text-blue-900 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-white"
            >
              Add New Image
            </button>
          )}

          {!isAdminMode && (
            <RoleSwitcher 
              currentRole={userRole as 'consultant' | 'cashier'} 
              onRoleChange={handleRoleChange} 
            />
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isAdminMode && (
          <>
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

            <div>
              <h2 className="text-xl font-bold text-blue-900 mb-4">Admin Image Management</h2>

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
          </>
        )}

        {userRole === 'consultant' && !isAdminMode && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Select an Image and Enter Length</h2>

            {loading ? (
              <div className="text-center p-8">
                <p>Loading images...</p>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No images available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map(image => (
                  <ConsultantImageCard
                    key={image.id}
                    id={image.id}
                    name={image.name}
                    createdAt={image.created_at}
                    onSubmit={handleSubmitLength}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {userRole === 'cashier' && !isAdminMode && (
          <div>
            <h2 className="text-xl font-bold text-blue-900 mb-4">Consultant Submissions</h2>

            {loading ? (
              <div className="text-center p-8">
                <p>Loading submissions...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No active submissions found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {submissions.map(submission => (
                  <CashierImageCard
                    key={submission.id}
                    id={submission.id}
                    imageId={submission.image_id}
                    imageName={submission.image_name}
                    lengthMeters={submission.length_meters}
                    createdAt={submission.created_at}
                    expiresAt={submission.expires_at}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-blue-900 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Jysk Image Gallery</p>
        </div>
      </footer>
    </div>
  );
}
