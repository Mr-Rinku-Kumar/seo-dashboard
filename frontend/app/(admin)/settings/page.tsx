// app/(admin)/settings/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Cog6ToothIcon, EnvelopeIcon, UserGroupIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const settingsCards = [
    {
      title: 'Contact Information',
      description: 'Manage phone, email, address, and map',
      href: '/settings/contact',
      icon: EnvelopeIcon,
      color: 'bg-red-100 text-red-600',
    },
    {
      title: 'User Management',
      description: 'Manage admin and editor users',
      href: '/users',
      icon: UserGroupIcon,
      color: 'bg-pink-100 text-pink-600',
      adminOnly: true,
    },
    {
      title: 'General Settings',
      description: 'Site name, logo, and other settings',
      href: '#',
      icon: Cog6ToothIcon,
      color: 'bg-gray-100 text-gray-600',
      comingSoon: true,
    },
    {
      title: 'Security',
      description: 'Manage security settings',
      href: '#',
      icon: ShieldCheckIcon,
      color: 'bg-green-100 text-green-600',
      comingSoon: true,
    },
  ];

  const availableCards = settingsCards.filter(
    (card) => !card.adminOnly || (card.adminOnly && isAdmin())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-xl">
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">Manage your website settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableCards.map((card) => (
          <div
            key={card.title}
            onClick={() => !card.comingSoon && router.push(card.href)}
            className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-200 ${
              card.comingSoon
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:shadow-md hover:border-blue-200 cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  {card.comingSoon && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Coming Soon</span>
                  )}
                  {card.adminOnly && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Admin</span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                {!card.comingSoon && (
                  <span className="text-sm text-blue-600 mt-2 inline-block">Manage →</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🚀</span>
          <div>
            <p className="font-medium text-blue-800">More settings coming soon</p>
            <p className="text-sm text-blue-700">Additional settings will be added in future updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}