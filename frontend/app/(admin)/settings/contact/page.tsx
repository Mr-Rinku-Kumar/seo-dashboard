// app/(admin)/settings/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ✅ Add API URL constant
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    googleMapEmbed: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchContactData(token);
  }, []);

  const fetchContactData = async (token: string) => {
    try {
      // ✅ Use API_URL instead of hardcoded localhost
      const response = await fetch(`${API_URL}/homepage/contact`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.data) {
        setFormData({
          phone: data.data.phone ?? '',
          email: data.data.email ?? '',
          address: data.data.address ?? '',
          googleMapEmbed: data.data.googleMapEmbed ?? '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // ✅ Use API_URL instead of hardcoded localhost
      const response = await fetch(`${API_URL}/homepage/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Contact information updated!');
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
          <p className="mt-4 text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 rounded-xl">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
          <p className="text-sm text-gray-600">Manage your contact details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone ?? ''}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="+1 (123) 456-7890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email ?? ''}
            onChange={handleChange}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="contact@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
          <textarea
            name="address"
            value={formData.address ?? ''}
            onChange={handleChange}
            rows={3}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="123 Main St, City, State, ZIP"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Map Embed Code</label>
          <textarea
            name="googleMapEmbed"
            value={formData.googleMapEmbed ?? ''}
            onChange={handleChange}
            rows={4}
            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
            placeholder='<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
          />
          <p className="mt-1 text-xs text-gray-500">Paste the full Google Maps iframe code</p>
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
        <div className="space-y-3">
          {formData.phone && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">📞</span>
              <span className="text-gray-900">{formData.phone}</span>
            </div>
          )}
          {formData.email && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">✉️</span>
              <span className="text-gray-900">{formData.email}</span>
            </div>
          )}
          {formData.address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <span className="text-xl">📍</span>
              <span className="text-gray-900 whitespace-pre-line">{formData.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}