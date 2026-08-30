'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, GraduationCap, ArrowRight, AlertCircle, ShieldCheck, Check, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { UserRole } from '@/types/auth';
import { DeeniLogoIcon } from '@/components/shared/DeeniLogo';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'teacher' ? 'teacher' : 'student';

  const { signUp } = useAuth();
  const [role, setRole] = useState<UserRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await signUp(email, password, fullName, role);
    setIsSubmitting(false);

    if (res.success) {
      if (role === 'teacher') {
        router.push('/teacher/register');
      } else {
        router.push('/student/dashboard');
      }
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check your information.');
    }
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
          Create your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Join thousands of learners and verified Bangladeshi teachers
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs rounded-xl border border-[#E2E8F0] space-y-6">
          
          {/* Role Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              I am registering as a:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  role === 'student'
                    ? 'border-[#16845B] bg-[#E8F5EF] text-[#0F2A43] ring-1 ring-[#16845B]'
                    : 'border-slate-200 bg-[#FAF9F5] text-slate-600 hover:border-slate-300'
                }`}
              >
                <User className={`w-5 h-5 mt-0.5 ${role === 'student' ? 'text-[#16845B]' : 'text-slate-400'}`} />
                <div>
                  <div className="font-bold text-xs">Student / Parent</div>
                  <div className="text-[10px] text-slate-500">Learn Arabic &amp; Quran</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  role === 'teacher'
                    ? 'border-[#16845B] bg-[#E8F5EF] text-[#0F2A43] ring-1 ring-[#16845B]'
                    : 'border-slate-200 bg-[#FAF9F5] text-slate-600 hover:border-slate-300'
                }`}
              >
                <GraduationCap className={`w-5 h-5 mt-0.5 ${role === 'teacher' ? 'text-[#16845B]' : 'text-slate-400'}`} />
                <div>
                  <div className="font-bold text-xs">Teacher / Scholar</div>
                  <div className="text-[10px] text-slate-500">Madrasa graduate</div>
                </div>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={role === 'teacher' ? 'e.g. Mawlana Tariqul Islam' : 'e.g. Farhan Chowdhury'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="your.email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
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

            <div className="text-[11px] text-slate-500 leading-relaxed">
              By creating an account, you agree to Deeni Tutor&apos;s Community Guidelines and verified lesson terms.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Registering...' : role === 'teacher' ? 'Continue to Teacher Application' : 'Create Student Account'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <Link href="/login" className="text-[#16845B] font-bold hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading sign up...</div>}>
      <SignupContent />
    </Suspense>
  );
}
