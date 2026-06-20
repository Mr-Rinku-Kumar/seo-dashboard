// app/(admin)/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, PlusIcon, UserCircleIcon } from '@heroicons/react/24/outline';

// ✅ Add API URL constant
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

export default function UsersPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading, isBackendAvailable } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'editor' as 'admin' | 'editor',
  });

  useEffect(() => {
    if (!authLoading && !isAdmin()) {
      toast.error('Admin access required');
      router.push('/dashboard');
      return;
    }
    if (user) {
      fetchUsers();
    }
  }, [authLoading, isAdmin, user]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login again');
        router.push('/login');
        return;
      }

      if (!isBackendAvailable) {
        setUsers([
          {
            _id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            createdAt: new Date().toISOString(),
          },
          {
            _id: '2',
            name: 'Editor User',
            email: 'editor@example.com',
            role: 'editor',
            createdAt: new Date().toISOString(),
          },
        ]);
        setLoading(false);
        toast('Showing mock data (backend not available)', {
          icon: 'ℹ️',
          style: {
            background: '#f59e0b',
            color: '#fff',
          },
        });
        return;
      }

      // ✅ Use API_URL instead of hardcoded localhost
      const response = await fetch(`${API_URL}/auth/users`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to view users.');
        } else if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch users');
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      toast.error(error.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!isBackendAvailable) {
        const newUser = {
          _id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          role: formData.role,
          createdAt: new Date().toISOString(),
        };
        if (editingUser) {
          setUsers(users.map(u => u._id === editingUser._id ? { ...u, ...newUser } : u));
          toast.success('User updated (mock mode)!');
        } else {
          setUsers([...users, newUser]);
          toast.success('User created (mock mode)!');
        }
        setFormData({ name: '', email: '', password: '', role: 'editor' });
        setEditingUser(null);
        setShowForm(false);
        setLoading(false);
        return;
      }

      const url = editingUser 
        ? `${API_URL}/auth/users/${editingUser._id}`
        : `${API_URL}/auth/register`;
      
      const method = editingUser ? 'PUT' : 'POST';
      const payload = editingUser 
        ? { name: formData.name, email: formData.email, role: formData.role }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      if (data.success) {
        toast.success(editingUser ? 'User updated!' : 'User created!');
        setFormData({ name: '', email: '', password: '', role: 'editor' });
        setEditingUser(null);
        setShowForm(false);
        fetchUsers();
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
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      
      if (!isBackendAvailable) {
        setUsers(users.filter(u => u._id !== id));
        toast.success('User deleted (mock mode)!');
        return;
      }

      // ✅ Use API_URL instead of hardcoded localhost
      await fetch(`${API_URL}/auth/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      toast.success('User deleted!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name ?? '',
      email: user.email ?? '',
      password: '',
      role: user.role ?? 'editor',
    });
    setShowForm(true);
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium'
      : 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-100 rounded-xl">
            <UserCircleIcon className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-gray-600">Manage admin and editor users</p>
              <span className={`inline-block w-2 h-2 rounded-full ${isBackendAvailable ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
              <span className="text-xs text-gray-500">
                {isBackendAvailable ? 'Backend Connected' : 'Mock Data Mode'}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingUser(null);
              setFormData({ name: '', email: '', password: '', role: 'editor' });
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          {showForm ? 'Cancel' : 'Add User'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchUsers}
            className="text-red-700 hover:text-red-900 font-medium text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name ?? ''}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email ?? ''}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password ?? ''}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!editingUser}
                  minLength={6}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role ?? 'editor'}
                onChange={handleChange}
                className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingUser(null);
                  setFormData({ name: '', email: '', password: '', role: 'editor' });
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
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
                  editingUser ? 'Update User' : 'Create User'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            All Users ({users.length})
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {users.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No users found</div>
          ) : (
            users.map((u) => (
              <div key={u._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <UserCircleIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-900">{u.name}</p>
                      <span className={getRoleBadge(u.role)}>{u.role}</span>
                      {u._id === user?.id && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">(You)</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(u)}
                    className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                    disabled={u._id === user?.id}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    className="text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    disabled={u._id === user?.id}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}