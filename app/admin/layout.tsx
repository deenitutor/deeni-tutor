'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  Star, 
  AlertTriangle, 
  Settings, 
  History,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { DeeniLogoIcon } from '@/components/shared/DeeniLogo';
import NotificationDropdown from '@/components/shared/NotificationDropdown';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { user, loginAsDemo } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const adminNavItems = [
    { name: 'Overview Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Teacher Faculty', href: '/admin/teachers', icon: GraduationCap },
    { name: 'Pending Applications', href: '/admin/applications', icon: FileText, badge: 'New' },
    { name: 'Student Learners', href: '/admin/students', icon: Users },
    { name: 'All Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Payments & Escrow', href: '/admin/payments', icon: DollarSign },
    { name: 'Teacher Payouts', href: '/admin/payouts', icon: CreditCard, badge: 'Payout' },
    { name: 'Review Moderation', href: '/admin/reviews', icon: Star },
    { name: 'Reports & Disputes', href: '/admin/reports', icon: AlertTriangle },
    { name: 'Platform Settings', href: '/admin/settings', icon: Settings },
    { name: 'Audit Action Logs', href: '/admin/audit-logs', icon: History },
  ];

  const isRoleAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col">
      {/* SuperAdmin Top Header */}
      <div className="bg-[#0F2A43] border-b border-[#1E3E5B] text-white px-4 sm:px-6 py-3 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              aria-label="Toggle admin navigation"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#16845B] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Console
              </span>
              <span className="hidden sm:inline text-xs text-slate-300">
                Bangladesh Madrasa Faculty &amp; Global Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/teachers"
              target="_blank"
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <span>Public Directory</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {!isRoleAdmin && (
              <button
                onClick={() => loginAsDemo('admin')}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#D9A441] hover:bg-amber-400 text-[#0F2A43] font-bold rounded-lg transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Switch to Admin Role</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container with Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Left Admin Sidebar (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-xs sticky top-36 space-y-4">
            <div className="px-3 py-2 border-b border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Platform Navigation
              </p>
              <p className="text-xs font-semibold text-[#0F2A43] mt-0.5">
                Deeni Tutor Control Center
              </p>
            </div>

            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    id={`admin-nav-${item.href.replace('/admin/', '')}`}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0F2A43] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-[#FAF9F5] hover:text-[#0F2A43]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9A441]' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        isActive ? 'bg-[#16845B] text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 px-3 text-[11px] text-slate-400 space-y-1">
              <p>Platform v2.4 (2026)</p>
              <p>Dhaka Ops • London • Texas</p>
            </div>
          </div>
        </aside>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
            <div className="bg-white w-72 max-w-[80vw] h-full p-4 space-y-4 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <DeeniLogoIcon className="w-6 h-6" />
                  <span className="font-bold text-sm text-[#0F2A43]">Admin Menu</span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-[#0F2A43] text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9A441]' : 'text-slate-500'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {!isRoleAdmin && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <p className="font-bold">Role Preview Notice</p>
                  <p className="text-amber-800">
                    You are currently logged in as <span className="font-bold uppercase">{user?.role || 'Guest'}</span>. Switch to Admin mode for full privileged actions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => loginAsDemo('admin')}
                className="px-3 py-1.5 bg-[#0F2A43] hover:bg-[#163C5F] text-white font-bold rounded-lg shrink-0 cursor-pointer"
              >
                Switch to Admin Demo
              </button>
            </div>
          )}

          {children}
        </main>

      </div>
    </div>
  );
}
