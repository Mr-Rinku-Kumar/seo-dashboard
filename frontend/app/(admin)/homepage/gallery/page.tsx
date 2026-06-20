// app/(admin)/homepage/gallery/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

// ✅ Add API URL constant
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function GalleryPage() {
  const router = useRouter();
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    altText: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchGallery(token);
  }, []);

  const fetchGallery = async (token: string) => {
    try {
      // ✅ Use API_URL instead of hardcoded localhost
      const response = await fetch(`${API_URL}/homepage/gallery`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setGallery(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, image: url });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error('Please upload an image');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `${API_URL}/homepage/gallery/${editingId}`
        : `${API_URL}/homepage/gallery`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(editingId ? 'Image updated!' : 'Image added!');
        setFormData({ image: '', altText: '' });
        setEditingId(null);
        setShowForm(false);
        fetchGallery(token!);
      } else {
        toast.error(data.message || 'Failed to save');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/homepage/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Image deleted!');
      fetchGallery(token!);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({
      image: item.image ?? '',
      altText: item.altText ?? '',
    });
    setShowForm(true);
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>
            <p className="text-sm text-gray-600">Manage your gallery images</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({ image: '', altText: '' });
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          {showForm ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Image' : 'Add New Image'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.image ?? ''}
              label="Gallery Image"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text (SEO)</label>
              <input
                type="text"
                name="altText"
                value={formData.altText ?? ''}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the image for accessibility"
              />
              <p className="mt-1 text-xs text-gray-500">Helps with SEO and accessibility</p>
            </div>

            <div className="flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ image: '', altText: '' });
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2.5 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200 font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  editingId ? 'Update Image' : 'Add Image'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No images in gallery</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Image" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div key={item._id} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.altText || 'Gallery image'}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 bg-white rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              {item.altText && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                  {item.altText}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}