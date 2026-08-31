'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Search, 
  Calendar, 
  User, 
  Settings,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Determine dynamic target URLs depending on user role
  const getBookingsHref = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/bookings';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  const getProfileHref = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  const getSettingsHref = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/settings';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  // Nav item list based on authentication state
  const loggedInItems = [
    {
      id: 'mobile-nav-home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      id: 'mobile-nav-teachers',
      label: 'Find Teachers',
      href: '/teachers',
      icon: Search,
      isActive: pathname.startsWith('/teachers'),
    },
    {
      id: 'mobile-nav-bookings',
      label: 'My Bookings',
      href: getBookingsHref(),
      icon: Calendar,
      isActive: pathname.includes('dashboard') || pathname.includes('bookings'),
    },
    {
      id: 'mobile-nav-profile',
      label: 'Profile',
      href: getProfileHref(),
      icon: User,
      isActive: pathname.includes('profile') || (pathname.includes('dashboard') && !pathname.includes('bookings')),
    },
    {
      id: 'mobile-nav-settings',
      label: 'Settings',
      href: getSettingsHref(),
      icon: Settings,
      isActive: pathname.includes('settings'),
    },
  ];

  const loggedOutItems = [
    {
      id: 'mobile-nav-home',
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      id: 'mobile-nav-teachers',
      label: 'Find Teachers',
      href: '/teachers',
      icon: Search,
      isActive: pathname.startsWith('/teachers'),
    },
    {
      id: 'mobile-nav-login',
      label: 'Log In',
      href: '/login',
      icon: LogIn,
      isActive: pathname === '/login' || pathname === '/signup',
    },
  ];

  const currentItems = user ? loggedInItems : loggedOutItems;

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className={`grid ${user ? 'grid-cols-5' : 'grid-cols-3'} items-center justify-around max-w-lg mx-auto`}>
        {currentItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <Link
              key={item.id}
              id={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-[#16845B] font-bold'
                  : 'text-slate-500 hover:text-[#0F2A43]'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-full transition-all ${
                    active ? 'bg-[#E8F5EF] scale-110 text-[#16845B]' : 'bg-transparent text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                </div>
                {active && (
                  <span className="absolute -top-0.5 right-0.5 w-1.5 h-1.5 bg-[#16845B] rounded-full ring-2 ring-white" />
                )}
              </div>
              <span className={`text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap ${
                active ? 'font-bold text-[#16845B]' : 'font-medium text-slate-600'
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
