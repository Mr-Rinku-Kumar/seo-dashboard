// app/(admin)/homepage/testimonials/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

// ✅ Add API URL constant
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    review: '',
    rating: '5',
    customerImage: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchTestimonials(token);
  }, []);

  const fetchTestimonials = async (token: string) => {
    try {
      // ✅ Use API_URL instead of hardcoded localhost
      const response = await fetch(`${API_URL}/homepage/testimonials`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setTestimonials(data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData({ ...formData, customerImage: url });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `${API_URL}/homepage/testimonials/${editingId}`
        : `${API_URL}/homepage/testimonials`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          rating: parseInt(formData.rating),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(editingId ? 'Testimonial updated!' : 'Testimonial added!');
        setFormData({ customerName: '', review: '', rating: '5', customerImage: '' });
        setEditingId(null);
        setShowForm(false);
        fetchTestimonials(token!);
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
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/homepage/testimonials/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Testimonial deleted!');
      fetchTestimonials(token!);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (testimonial: any) => {
    setEditingId(testimonial._id);
    setFormData({
      customerName: testimonial.customerName ?? '',
      review: testimonial.review ?? '',
      rating: testimonial.rating?.toString() ?? '5',
      customerImage: testimonial.customerImage ?? '',
    });
    setShowForm(true);
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl">
            <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
            <p className="text-sm text-gray-600">Manage customer reviews</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({ customerName: '', review: '', rating: '5', customerImage: '' });
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          {showForm ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName ?? ''}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea
                name="review"
                value={formData.review ?? ''}
                onChange={handleChange}
                rows={4}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter customer review"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <select
                name="rating"
                value={formData.rating ?? '5'}
                onChange={handleChange}
                className="block w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value="4">⭐⭐⭐⭐☆ (4 Stars)</option>
                <option value="3">⭐⭐⭐☆☆ (3 Stars)</option>
                <option value="2">⭐⭐☆☆☆ (2 Stars)</option>
                <option value="1">⭐☆☆☆☆ (1 Star)</option>
              </select>
            </div>

            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.customerImage ?? ''}
              label="Customer Image"
            />

            <div className="flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ customerName: '', review: '', rating: '5', customerImage: '' });
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
                  editingId ? 'Update Testimonial' : 'Add Testimonial'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonial List */}
      {testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-gray-500">No testimonials added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Testimonial" to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {testimonial.customerImage && (
                      <img
                        src={testimonial.customerImage}
                        alt={testimonial.customerName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{testimonial.customerName}</h3>
                        <span className="text-sm text-yellow-500">{renderStars(testimonial.rating)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{testimonial.review}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial._id)}
                      className="text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
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