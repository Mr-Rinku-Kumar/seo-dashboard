// app/(admin)/seo/schema/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api-client';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const SCHEMA_TYPES = ['Organization', 'FAQ', 'Breadcrumb', 'Website', 'LocalBusiness'] as const;

type SchemaType = typeof SCHEMA_TYPES[number];

interface SchemaFormData {
  type: SchemaType;
  data: any;
}

function SchemaManagementContent() {
  const [loading, setLoading] = useState(false);
  const [schemaType, setSchemaType] = useState<SchemaType>('Organization');
  const [schemas, setSchemas] = useState<any[]>([]);
  const [editingSchema, setEditingSchema] = useState<any>(null);
  const { register, handleSubmit, reset, setValue, watch } = useForm<SchemaFormData>();

  useEffect(() => {
    fetchSchemas();
  }, []);

  const fetchSchemas = async () => {
    try {
      const response = await apiClient.get('/schemas');
      setSchemas(response.data.data || []);
    } catch (error) {
      console.error('Error fetching schemas:', error);
    }
  };

  const onSubmit = async (data: SchemaFormData) => {
    setLoading(true);
    try {
      const payload = { type: schemaType, data: data.data };
      const response = await apiClient.post('/schemas', payload);
      
      if (response.data.success) {
        toast.success(`${schemaType} schema updated successfully!`);
        fetchSchemas();
        reset({ data: {} });
        setEditingSchema(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update schema');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schema: any) => {
    setEditingSchema(schema);
    setSchemaType(schema.type);
    setValue('data', schema.data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schema?')) return;
    try {
      await apiClient.delete(`/schemas/${id}`);
      toast.success('Schema deleted successfully!');
      fetchSchemas();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete schema');
    }
  };

  const renderSchemaFields = () => {
    switch (schemaType) {
      case 'Organization':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
              <input
                type="text"
                {...register('data.name')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Company Inc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                {...register('data.url')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                {...register('data.logo')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                {...register('data.email')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('data.description')}
                rows={3}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Company description"
              />
            </div>
          </div>
        );

      case 'FAQ':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
              <input
                type="text"
                {...register('data.question')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter frequently asked question"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
              <textarea
                {...register('data.answer')}
                rows={4}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the answer"
              />
            </div>
          </div>
        );

      case 'Breadcrumb':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                {...register('data.name')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Home"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                {...register('data.url')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>
        );

      case 'Website':
        return (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
              <input
                type="text"
                {...register('data.name')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Website"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                {...register('data.url')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('data.description')}
                rows={3}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Website description"
              />
            </div>
          </div>
        );

      case 'LocalBusiness':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                {...register('data.name')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="My Local Business"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                {...register('data.address')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main St, City, State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                {...register('data.phone')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (123) 456-7890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
              <input
                type="url"
                {...register('data.url')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
              <input
                type="text"
                {...register('data.openingHours')}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mon-Fri 9:00-17:00"
              />
            </div>
          </div>
        );

      default:
        return <p className="text-gray-500">Select a schema type to configure</p>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-xl">
          <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schema Management</h1>
          <p className="text-sm text-gray-600">Manage structured data for rich search results</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Schema Type</label>
          <select
            value={schemaType}
            onChange={(e) => {
              setSchemaType(e.target.value as SchemaType);
              reset({ data: {} });
            }}
            className="block w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SCHEMA_TYPES.map((type) => (
              <option key={type} value={type}>{type} Schema</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-4">
              {schemaType} Schema Details
            </h3>
            {renderSchemaFields()}
          </div>

          <div className="flex justify-end gap-3">
            {editingSchema && (
              <button
                type="button"
                onClick={() => {
                  reset({ data: {} });
                  setEditingSchema(null);
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
                'Save Schema'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Schemas */}
      {schemas.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Existing Schemas</h3>
          <div className="space-y-3">
            {schemas.map((schema) => (
              <div key={schema._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{schema.type}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      schema.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {schema.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Updated: {new Date(schema.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(schema)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(schema._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SchemaManagementContent;
