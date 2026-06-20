// app/(admin)/homepage/hero/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';

// ✅ Add API URL constant
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function HeroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    mainHeading: '',
    subHeading: '',
    bannerImage: '',
    ctaText: '',
    ctaURL: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchHeroData(token);
  }, []);

  const fetchHeroData = async (token: string) => {
    try {
      // ✅ Use API_URL instead of hardcoded localhost
      const response = await fetch(`${API_URL}/homepage/hero`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.data) {
        setFormData({
          mainHeading: data.data.mainHeading ?? '',
          subHeading: data.data.subHeading ?? '',
          bannerImage: data.data.bannerImage ?? '',
          ctaText: data.data.ctaText ?? '',
          ctaURL: data.data.ctaURL ?? '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, bannerImage: url }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // ✅ Use API_URL instead of hardcoded localhost
      const response = await fetch(`${API_URL}/homepage/hero`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Hero section updated!');
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
          <p className="mt-4 text-gray-600">Loading hero section...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-xl">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hero Section</h1>
          <p className="text-sm text-gray-600">Manage your homepage hero banner</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
          <input
            type="text"
            name="mainHeading"
            value={formData.mainHeading ?? ''}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter main heading"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub Heading</label>
          <input
            type="text"
            name="subHeading"
            value={formData.subHeading ?? ''}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="Enter sub heading"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
          <ImageUpload
            onImageUpload={handleImageUpload}
            currentImage={formData.bannerImage ?? ''}
            label="Upload Banner Image"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
            <input
              type="text"
              name="ctaText"
              value={formData.ctaText ?? ''}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Book Now"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button URL</label>
            <input
              type="url"
              name="ctaURL"
              value={formData.ctaURL ?? ''}
              onChange={handleChange}
              className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="https://example.com/book"
            />
          </div>
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h3 className="text-sm font-medium opacity-80 mb-2">Live Preview</h3>
        <h2 className="text-2xl md:text-3xl font-bold">{formData.mainHeading || 'Your Main Heading'}</h2>
        {formData.subHeading && <p className="text-blue-100 mt-2">{formData.subHeading}</p>}
        {formData.ctaText && (
          <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-xl font-medium hover:bg-blue-50 transition-colors">
            {formData.ctaText}
          </button>
        )}
      </div>
    </div>
  );
}