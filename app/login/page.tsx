'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { DeeniLogoIcon } from '@/components/shared/DeeniLogo';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loginAsDemo, isSupabaseActive } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await signIn(email, password);
    setIsSubmitting(false);

    if (res.success) {
      if (email.includes('teacher')) {
        router.push('/teacher/dashboard');
      } else if (email.includes('admin')) {
        router.push('/admin/dashboard');
      } else {
        router.push('/student/dashboard');
      }
    } else {
      setErrorMsg(res.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleQuickDemo = (role: 'student' | 'teacher' | 'admin') => {
    loginAsDemo(role);
    if (role === 'teacher') router.push('/teacher/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
    else router.push('/student/dashboard');
  };

  return (
    <div className="bg-[#F7F5EF] min-h-[calc(100vh-160px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
          <DeeniLogoIcon className="w-9 h-9 shrink-0 group-hover:scale-105 transition-transform drop-shadow-xs" />
          <span className="text-xl font-bold tracking-tight text-[#0F2A43]">
            DEENI <span className="text-[#D9A441]">TUTOR</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-[#0F2A43]">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Access your Arabic &amp; Quran lessons or teaching schedule
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs rounded-xl border border-[#E2E8F0] space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-[#16845B] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
              Instant Demo Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-2 px-2 text-xs font-bold bg-[#FAF9F5] hover:bg-[#E8F5EF] text-[#0F2A43] border border-slate-200 rounded-lg transition-colors text-center cursor-pointer"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('teacher')}
                className="py-2 px-2 text-xs font-bold bg-[#FAF9F5] hover:bg-[#E8F5EF] text-[#0F2A43] border border-slate-200 rounded-lg transition-colors text-center cursor-pointer"
              >
                Teacher
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-2 px-2 text-xs font-bold bg-[#FAF9F5] hover:bg-[#E8F5EF] text-[#0F2A43] border border-slate-200 rounded-lg transition-colors text-center cursor-pointer"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500 pt-2">
            Don&apos;t have an account yet?{' '}
            <Link href="/signup" className="text-[#16845B] font-bold hover:underline">
              Create an Account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
