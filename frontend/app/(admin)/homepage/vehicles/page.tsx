// app/(admin)/homepage/vehicles/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';

// Import DnD Kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ✅ Add API URL constant
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Vehicle {
  _id: string;
  name: string;
  slug: string;
  image: string;
  seatingCapacity: number;
  description?: string;
  features?: string;
  order: number;
  isActive: boolean;
}

// Sortable Vehicle Item Component
function SortableVehicleItem({ vehicle, onEdit, onDelete }: { 
  vehicle: Vehicle; 
  onEdit: (v: Vehicle) => void; 
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: vehicle._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:bg-gray-100 p-2 rounded-lg transition-colors flex-shrink-0"
            title="Drag to reorder"
          >
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
          </div>

          {/* Vehicle Image */}
          {vehicle.image && (
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
            />
          )}

          {/* Vehicle Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 truncate">{vehicle.name}</span>
              <span className="text-sm text-gray-500 flex-shrink-0">{vehicle.seatingCapacity} Seats</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded flex-shrink-0">
                Order: {vehicle.order}
              </span>
            </div>
            {vehicle.slug && (
              <p className="text-xs text-gray-400 truncate">/vehicles/{vehicle.slug}</p>
            )}
            {vehicle.features && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">Features: {vehicle.features}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(vehicle)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(vehicle._id)}
            className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    seatingCapacity: '',
    description: '',
    features: '',
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchVehicles(token);
  }, []);

  const fetchVehicles = async (token: string) => {
    try {
      // ✅ Use API_URL instead of hardcoded localhost
      const response = await fetch(`${API_URL}/homepage/vehicles`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      const sorted = (data.data || []).sort((a: Vehicle, b: Vehicle) => a.order - b.order);
      setVehicles(sorted);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch vehicles');
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
    if (!formData.image) {
      toast.error('Please upload an image');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingId 
        ? `${API_URL}/homepage/vehicles/${editingId}`
        : `${API_URL}/homepage/vehicles`;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          seatingCapacity: parseInt(formData.seatingCapacity),
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(editingId ? 'Vehicle updated!' : 'Vehicle added!');
        setFormData({ name: '', slug: '', image: '', seatingCapacity: '', description: '', features: '' });
        setEditingId(null);
        setShowForm(false);
        fetchVehicles(token!);
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
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/homepage/vehicles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('Vehicle deleted!');
      fetchVehicles(token!);
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle._id);
    setFormData({
      name: vehicle.name ?? '',
      slug: vehicle.slug ?? '',
      image: vehicle.image ?? '',
      seatingCapacity: vehicle.seatingCapacity?.toString() ?? '',
      description: vehicle.description ?? '',
      features: vehicle.features ?? '',
    });
    setShowForm(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = vehicles.findIndex((v) => v._id === active.id);
      const newIndex = vehicles.findIndex((v) => v._id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newVehicles = arrayMove(vehicles, oldIndex, newIndex);
        setVehicles(newVehicles);

        setSavingOrder(true);
        try {
          const token = localStorage.getItem('token');
          const vehicleIds = newVehicles.map((v) => v._id);
          
          // ✅ Use API_URL instead of hardcoded localhost
          const response = await fetch(`${API_URL}/homepage/vehicles/reorder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ vehicleIds }),
          });

          const data = await response.json();
          if (data.success) {
            toast.success('Vehicle order updated!');
            fetchVehicles(token!);
          } else {
            toast.error(data.message || 'Failed to reorder');
            fetchVehicles(token!);
          }
        } catch (error) {
          console.error('Reorder error:', error);
          toast.error('Failed to save order');
          const token = localStorage.getItem('token');
          if (token) fetchVehicles(token);
        } finally {
          setSavingOrder(false);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
            <p className="text-sm text-gray-600">Manage and reorder your vehicles</p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingId(null);
              setFormData({ name: '', slug: '', image: '', seatingCapacity: '', description: '', features: '' });
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name ?? ''}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter vehicle name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity ?? ''}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter seating capacity"
                  required
                />
              </div>
            </div>

            {editingId && formData.slug && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (SEO URL)</label>
                <input
                  type="text"
                  value={formData.slug ?? ''}
                  disabled
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Auto-generated from vehicle name</p>
              </div>
            )}

            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImage={formData.image ?? ''}
              label="Vehicle Image"
            />

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
              <input
                type="text"
                name="features"
                value={formData.features ?? ''}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="AC, Music System, WiFi (comma separated)"
              />
            </div>

            <div className="flex justify-end gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({ name: '', slug: '', image: '', seatingCapacity: '', description: '', features: '' });
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
                  editingId ? 'Update Vehicle' : 'Add Vehicle'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle List */}
      {vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7" />
          </svg>
          <p className="text-gray-500">No vehicles added yet</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Vehicle" to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm text-gray-500">{vehicles.length} vehicles</span>
            {savingOrder && (
              <span className="text-sm text-blue-600 flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving order...
              </span>
            )}
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={vehicles.map((v) => v._id)}
              strategy={verticalListSortingStrategy}
            >
              {vehicles.map((vehicle) => (
                <SortableVehicleItem
                  key={vehicle._id}
                  vehicle={vehicle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}