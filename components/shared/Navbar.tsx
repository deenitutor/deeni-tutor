'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ShieldCheck, 
  GraduationCap, 
  LogOut, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { DeeniLogoIcon } from '@/components/shared/DeeniLogo';
import NotificationDropdown from '@/components/shared/NotificationDropdown';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut, loginAsDemo } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Find Teachers', href: '/teachers' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-xs">
      {/* Top Notification / Demo Bar */}
      <div className="bg-[#0F2A43] text-[#F7F5EF] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#16845B] text-white px-2 py-0.5 rounded-full font-medium text-[11px]">
              <ShieldCheck className="w-3 h-3" /> 100% Verified
            </span>
            <span className="hidden sm:inline text-slate-300">
              Direct connection with Bangladesh&apos;s leading Madrasa &amp; Arabic scholars
            </span>
          </div>

          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-[#D9A441] hover:text-amber-300 font-medium cursor-pointer transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>{user ? `Active: ${user.role.toUpperCase()}` : 'Quick Demo Role'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {demoDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-white text-[#16202A] rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setDemoDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Demo Account
                </div>
                <button
                  onClick={() => { loginAsDemo('student'); setDemoDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#F7F5EF] flex items-center justify-between"
                >
                  <span className="font-medium">Student (Tariq - UK)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Student</span>
                </button>
                <button
                  onClick={() => { loginAsDemo('teacher'); setDemoDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#F7F5EF] flex items-center justify-between"
                >
                  <span className="font-medium">Teacher (Mawlana Abdullah)</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">Teacher</span>
                </button>
                <button
                  onClick={() => { loginAsDemo('admin'); setDemoDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#F7F5EF] flex items-center justify-between"
                >
                  <span className="font-medium">Admin Portal</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Admin</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <DeeniLogoIcon className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform drop-shadow-xs" />
            <div>
              <span className="text-xl font-bold tracking-tight text-[#0F2A43]">
                DEENI <span className="text-[#D9A441]">TUTOR</span>
              </span>
              <p className="text-[10px] text-[#64748B] tracking-wider uppercase font-semibold -mt-1">
                Authentic Arabic &amp; Quran
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[#16845B] bg-[#E8F5EF] font-semibold'
                      : 'text-[#16202A] hover:text-[#0F2A43] hover:bg-[#F7F5EF]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/signup?role=teacher"
              className="text-xs font-semibold text-[#0F2A43] hover:text-[#16845B] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-[#16845B]" />
              <span>Teach with Us</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-2.5">
                <NotificationDropdown />
                <Link
                  href={getDashboardLink()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2A43] text-white text-sm font-medium hover:bg-[#163C5F] transition-all shadow-xs"
                >
                  <User className="w-4 h-4 text-[#D9A441]" />
                  <span>Dashboard ({user.role})</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[#0F2A43] hover:bg-[#F7F5EF] rounded-xl transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#16845B] hover:bg-[#126D4B] rounded-xl shadow-xs transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0F2A43] hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'text-[#16845B] bg-[#E8F5EF] font-semibold'
                    : 'text-slate-800 hover:bg-[#F7F5EF]'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <Link
              href="/signup?role=teacher"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#0F2A43] hover:bg-slate-50 rounded-lg"
            >
              <GraduationCap className="w-4 h-4 text-[#16845B]" />
              <span>Apply to Teach on Deeni Tutor</span>
            </Link>

            {user ? (
              <div className="space-y-2 pt-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-[#0F2A43] text-white rounded-xl font-medium"
                >
                  Go to {user.role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-full text-center px-4 py-2 text-rose-600 font-medium hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 border border-slate-300 text-slate-800 rounded-xl font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 bg-[#16845B] text-white rounded-xl font-medium shadow-xs"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
