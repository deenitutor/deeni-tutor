'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { DeeniLogoIcon } from '@/components/shared/DeeniLogo';

export default function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    const res = await resetPasswordForEmail(email);
    setIsSubmitting(false);

    if (res.success) {
      setSubmitted(true);
    } else {
      setErrorMsg(res.error || 'Failed to send reset email.');
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
          Reset Password
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          We will send password reset instructions to your registered email
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xs rounded-xl border border-[#E2E8F0] space-y-6">
          
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F5EF] text-[#16845B] mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-[#0F2A43]">Check Your Email</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If an account exists for <span className="font-semibold text-[#0F2A43]">{email}</span>, you will receive a password reset link shortly.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-block px-4 py-2 bg-[#16845B] text-white text-xs font-bold rounded-lg hover:bg-[#126D4B] transition-colors"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email address
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Sending instructions...' : 'Send Reset Link'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0F2A43]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
