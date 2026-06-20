// components/MobileNav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
}

export default function MobileNav({ items }: { items: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = items.map(item => {
    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
    return { ...item, isActive };
  });

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-target"
        aria-label="Toggle menu"
      >
        <Bars3Icon className="h-6 w-6 text-gray-600" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={toggleMenu} />
          
          {/* Menu */}
          <div className="absolute right-0 top-0 w-4/5 max-w-sm h-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <span className="font-bold text-blue-600">Menu</span>
              <button
                onClick={toggleMenu}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-target"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={toggleMenu}
                  className={`
                    block px-4 py-3 rounded-lg transition-colors touch-target
                    ${item.isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* User section in mobile menu */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="px-4 py-2">
                  <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user?.role || 'editor'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="w-full mt-2 text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-target"
                >
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}