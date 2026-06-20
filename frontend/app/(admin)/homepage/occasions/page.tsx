// app/(admin)/homepage/occasions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function OccasionsPage() {
  const router = useRouter();
  const [occasions, setOccasions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOccasions(token);
  }, []);

  const fetchOccasions = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/homepage/occasions', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setOccasions(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, image: url });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `http://localhost:5000/api/homepage/occasions/${editingId}`
        : 'http://localhost:5000/api/homepage/occasions';
      
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
        toast.success(editingId ? 'Occasion updated!' : 'Occasion added!');
        setFormData({ title: '', description: '', image: '' });
        setEditingId(null);
        setShowForm(false);
        fetchOccasions(token!);
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
    if (!confirm('Are you sure you want to delete this occasion?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/homepage/occasions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Occasion deleted!');
      fetchOccasions(token!);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (occasion: any) => {
    setEditingId(occasion._id);
    // ✅ Ensure every field gets a string value
    setFormData({
      title: occasion.title ?? '',
      description: occasion.description ?? '',
      image: occasion.image ?? '',
    });
    setShowForm(true);
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading occasions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-xl">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Occasions</h1>
            <p className="text-sm text-gray-600">Manage your service occasions</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({ title: '', description: '', image: '' });
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          {showForm ? 'Cancel' : 'Add Occasion'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Occasion' : 'Add New Occasion'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title ?? ''}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter occasion title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description ?? ''}
                onChange={handleChange}
                rows={3}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description"
              />
            </div>

            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.image ?? ''}
              label="Occasion Image"
            />

            <div className="flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ title: '', description: '', image: '' });
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
                  editingId ? 'Update Occasion' : 'Add Occasion'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Occasion List */}
      {occasions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500">No occasions added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Occasion" to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {occasions.map((occasion) => (
              <div key={occasion._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {occasion.image && (
                  <img
                    src={occasion.image}
                    alt={occasion.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{occasion.title}</h3>
                  {occasion.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{occasion.description}</p>
                  )}
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(occasion)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(occasion._id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}