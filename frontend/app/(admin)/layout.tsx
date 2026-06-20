// app/(admin)/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  CodeBracketIcon,
  UserGroupIcon,
  TruckIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  PhotoIcon,
  InformationCircleIcon,
  EnvelopeIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'SEO Settings', href: '/seo', icon: MagnifyingGlassIcon },
    { name: 'Schema Management', href: '/seo/schema', icon: CodeBracketIcon },
    { name: 'Hero Section', href: '/homepage/hero', icon: HomeIcon },
    { name: 'About Us', href: '/homepage/about', icon: InformationCircleIcon },
    { name: 'Vehicles', href: '/homepage/vehicles', icon: TruckIcon },
    { name: 'Occasions', href: '/homepage/occasions', icon: CalendarIcon },
    { name: 'Testimonials', href: '/homepage/testimonials', icon: ChatBubbleLeftIcon },
    { name: 'Gallery', href: '/homepage/gallery', icon: PhotoIcon },
    { name: 'Contact Info', href: '/settings/contact', icon: EnvelopeIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  const adminNavigation = [
    ...navigation,
    { name: 'Users', href: '/users', icon: UserGroupIcon },
  ];

  const navItems = isAdmin() ? adminNavigation : navigation;

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-3 sm:px-4 h-14 flex items-center justify-between shadow-sm">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>
        <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          SEO Dashboard
        </h1>
        <div className="w-8 sm:w-10"></div>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] sm:w-72 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
          ${isMobile ? (mobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')}
          lg:translate-x-0 shadow-xl lg:shadow-none
        `}
      >
        <div className="flex h-14 lg:h-16 items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hidden sm:block">
              SEO Dashboard
            </h1>
          </div>
          <button
            onClick={() => {
              if (isMobile) {
                setMobileMenuOpen(false);
              } else {
                setSidebarOpen(false);
              }
            }}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-3 px-3 space-y-0.5 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && setMobileMenuOpen(false)}
                className={`
                  group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 touch-target
                  ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm ring-1 ring-blue-200/50'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-6 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-3 lg:p-4 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3 min-w-0">
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 ring-2 ring-blue-200/50">
                <UserCircleIcon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Admin'}</p>
                <div className="flex items-center gap-1 lg:gap-2">
                  <p className="text-xs text-gray-500 truncate hidden xs:block">{user?.email || 'admin@example.com'}</p>
                  <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user?.role || 'admin'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors touch-target flex-shrink-0"
              aria-label="Logout"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen pt-14 lg:pt-0">
        <header className="hidden lg:flex bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30 h-16 items-center px-6 shadow-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
                aria-label="Toggle sidebar"
              >
                <Bars3Icon className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-sm text-gray-500 hidden md:block">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {user?.role && (
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              )}
              <button
                onClick={logout}
                className="text-sm text-red-600 hover:text-red-700 font-medium hidden sm:block transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}