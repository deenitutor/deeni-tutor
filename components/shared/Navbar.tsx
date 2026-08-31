'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  GraduationCap, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { DeeniLogoIcon } from '@/components/shared/DeeniLogo';
import NotificationDropdown from '@/components/shared/NotificationDropdown';

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
