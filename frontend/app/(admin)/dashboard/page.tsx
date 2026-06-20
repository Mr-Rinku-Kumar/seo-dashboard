// app/(admin)/dashboard/page.tsx
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import {
  TruckIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  PhotoIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  CodeBracketIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const { user, isAdmin, loading: authLoading, isBackendAvailable } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalOccasions: 0,
    totalTestimonials: 0,
    totalGallery: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const fetchedRef = useRef(false);

  const fetchStats = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      if (!isBackendAvailable) {
        setStats({
          totalVehicles: 5,
          totalOccasions: 4,
          totalTestimonials: 3,
          totalGallery: 8,
          totalUsers: 2,
        });
        setLoading(false);
        setConnectionError(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const [vehicles, occasions, testimonials, gallery, users] = await Promise.all([
          fetch('http://localhost:5000/api/homepage/vehicles', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal,
          }),
          fetch('http://localhost:5000/api/homepage/occasions', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal,
          }),
          fetch('http://localhost:5000/api/homepage/testimonials', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal,
          }),
          fetch('http://localhost:5000/api/homepage/gallery', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal,
          }),
          isAdmin() ? fetch('http://localhost:5000/api/auth/users', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal,
          }) : Promise.resolve({ json: () => ({ data: [] }) }),
        ]);

        clearTimeout(timeoutId);

        const responses = [vehicles, occasions, testimonials, gallery];
        const hasError = responses.some(r => !r.ok);
        
        if (hasError) {
          throw new Error('One or more API calls failed');
        }

        const vehiclesData = await vehicles.json();
        const occasionsData = await occasions.json();
        const testimonialsData = await testimonials.json();
        const galleryData = await gallery.json();
        const usersData = await users.json();

        setStats({
          totalVehicles: vehiclesData.data?.length || 0,
          totalOccasions: occasionsData.data?.length || 0,
          totalTestimonials: testimonialsData.data?.length || 0,
          totalGallery: galleryData.data?.length || 0,
          totalUsers: usersData.data?.length || 0,
        });
        setConnectionError(false);
      } catch (fetchError: any) {
        console.error('Fetch error:', fetchError);
        setStats({
          totalVehicles: 0,
          totalOccasions: 0,
          totalTestimonials: 0,
          totalGallery: 0,
          totalUsers: 0,
        });
        setConnectionError(true);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
      setStats({
        totalVehicles: 0,
        totalOccasions: 0,
        totalTestimonials: 0,
        totalGallery: 0,
        totalUsers: 0,
      });
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }, [isBackendAvailable, isAdmin]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user && !fetchedRef.current) {
      fetchStats();
    }
  }, [user, fetchStats]);

  useEffect(() => {
    fetchedRef.current = false;
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Vehicles', value: stats.totalVehicles, icon: TruckIcon, color: 'blue' },
    { title: 'Total Occasions', value: stats.totalOccasions, icon: CalendarIcon, color: 'green' },
    { title: 'Testimonials', value: stats.totalTestimonials, icon: ChatBubbleLeftIcon, color: 'purple' },
    { title: 'Gallery Images', value: stats.totalGallery, icon: PhotoIcon, color: 'orange' },
  ];

  if (isAdmin()) {
    statCards.push({ 
      title: 'Total Users', 
      value: stats.totalUsers, 
      icon: UserGroupIcon,
      color: 'pink' 
    });
  }

  const quickActions = [
    { title: 'SEO Settings', href: '/seo', icon: Cog6ToothIcon, color: 'blue' },
    { title: 'Schema Management', href: '/seo/schema', icon: CodeBracketIcon, color: 'purple' },
    { title: 'Hero Section', href: '/homepage/hero', icon: HomeIcon, color: 'green' },
    { title: 'Vehicles', href: '/homepage/vehicles', icon: TruckIcon, color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Connection Error */}
      {connectionError && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-medium text-yellow-800 text-sm sm:text-base">Connection Issue</p>
              <p className="text-xs sm:text-sm text-yellow-700">Could not connect to backend. Showing cached data.</p>
            </div>
          </div>
          <button
            onClick={() => {
              fetchedRef.current = false;
              fetchStats();
            }}
            className="text-yellow-800 hover:text-yellow-900 font-medium text-sm touch-target px-4 py-2 rounded-lg bg-yellow-100 hover:bg-yellow-200 w-full sm:w-auto"
          >
            Retry
          </button>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Welcome back, {user?.name || 'Admin'}! 👋
            </h1>
            <p className="text-blue-100 mt-1 flex flex-wrap items-center gap-2 text-sm sm:text-base">
              You are logged in as <span className="font-medium bg-white/20 px-2 py-0.5 rounded">{user?.role}</span>
              <span className={`inline-block w-2 h-2 rounded-full ${isBackendAvailable ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
              <span className="text-xs opacity-80">{isBackendAvailable ? 'Backend Connected' : 'Mock Data Mode'}</span>
            </p>
          </div>
          {isAdmin() && (
            <a
              href="/users"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur-sm text-sm w-full sm:w-auto justify-center"
            >
              <UserGroupIcon className="h-5 w-5" />
              Manage Users
            </a>
          )}
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((stat) => (
          <div key={stat.title} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
              <div className={`p-2 sm:p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="section-title mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <a
              key={action.title}
              href={action.href}
              className="group p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className={`p-2 rounded-xl ${colorClasses[action.color as keyof typeof colorClasses]} w-fit mx-auto mb-2`}>
                <action.icon className="h-5 w-5" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {action.title}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* Role Info Card */}
      <div className={`rounded-2xl p-4 sm:p-6 border ${
        isAdmin() 
          ? 'bg-purple-50 border-purple-200' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl text-lg sm:text-xl ${
            isAdmin() ? 'bg-purple-200' : 'bg-blue-200'
          }`}>
            {isAdmin() ? '🛡️' : '📝'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              {isAdmin() ? 'Admin Access' : 'Editor Access'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {isAdmin() 
                ? 'You have full access to all features including user management.'
                : 'You can manage content but cannot create or delete users.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}