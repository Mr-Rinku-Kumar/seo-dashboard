// app/(admin)/homepage/about/page.tsx
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';

export default function AboutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    fetchAboutData(token);
  }, []);

  const fetchAboutData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/homepage/about', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.data) {
        // ✅ Ensure every field gets a string value
        setFormData({
          title: data.data.title ?? '',
          description: data.data.description ?? '',
          image: data.data.image ?? '',
        });
      }
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
      const response = await fetch('http://localhost:5000/api/homepage/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('About section updated!');
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading about section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-xl">
          <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
          <p className="text-sm text-gray-600">Manage your about section</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
          <input
            type="text"
            name="title"
            value={formData.title ?? ''}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter section title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description ?? ''}
            onChange={handleChange}
            rows={6}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter description"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.image ?? ''}
            label="Upload Featured Image"
          />
        </div>

        <div className="flex justify-end pt-2">
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
              'Save Changes'
            )}
          </button>
        </div>
      </form>

      {/* Preview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h3>
        <div className="space-y-2">
          <p className="text-xl font-bold text-gray-900">{formData.title || 'Section Title'}</p>
          <p className="text-gray-600">{formData.description || 'Your description will appear here'}</p>
        </div>
      </div>
    </div>
  );
}