import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { DeeniLogoIcon } from '@/components/shared/DeeniLogo';

export default function Footer() {
  return (
    <footer className="bg-[#0F2A43] text-white pt-16 pb-12 border-t border-[#163C5F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#163C5F]/60">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <DeeniLogoIcon className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform drop-shadow-xs" />
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  DEENI <span className="text-[#D9A441]">TUTOR</span>
                </span>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  Authentic Arabic &amp; Quran
                </p>
              </div>
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              The premier online marketplace connecting qualified Bangladeshi madrasa and Arabic educators with global students, expatriates, and Muslim families worldwide.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#D9A441] bg-[#163C5F]/40 p-3 rounded-xl border border-[#163C5F]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#D9A441]" />
              <span>Rigorous 4-tier verification for all Dawra-e-Hadith &amp; university scholars.</span>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-300" />
                <span>Serving students across UK, USA, Canada, UAE, Europe &amp; Australia</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-300" />
                <span>Dhaka, Bangladesh — Worldwide Operations</span>
              </div>
            </div>
          </div>

          {/* Col 3: Popular Subjects */}
          <div>
            <h3 className="text-sm font-semibold text-[#D9A441] uppercase tracking-wider mb-4 font-serif">
              Core Subjects
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/teachers?subject=arabic-language" className="hover:text-white transition-colors">
                  Arabic Language (Fusha)
                </Link>
              </li>
              <li>
                <Link href="/teachers?subject=quranic-arabic" className="hover:text-white transition-colors">
                  Quranic Arabic &amp; Tafseer
                </Link>
              </li>
              <li>
                <Link href="/teachers?subject=tajweed" className="hover:text-white transition-colors">
                  Tajweed &amp; Makharij
                </Link>
              </li>
              <li>
                <Link href="/teachers?subject=nahw" className="hover:text-white transition-colors">
                  Arabic Syntax (Nahw)
                </Link>
              </li>
              <li>
                <Link href="/teachers?subject=sarf" className="hover:text-white transition-colors">
                  Arabic Morphology (Sarf)
                </Link>
              </li>
              <li>
                <Link href="/teachers?subject=arabic-for-kids" className="hover:text-white transition-colors">
                  Arabic for Children
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Students */}
          <div>
            <h3 className="text-sm font-semibold text-[#D9A441] uppercase tracking-wider mb-4 font-serif">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/teachers" className="hover:text-white transition-colors">
                  Browse Teachers
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/signup?role=teacher" className="text-[#D9A441] hover:underline font-medium">
                  Apply as a Teacher
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Portals & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-[#D9A441] uppercase tracking-wider mb-4 font-serif">
              Access Portals
            </h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/student/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/teacher/dashboard" className="hover:text-white transition-colors">
                  Teacher Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-white transition-colors">
                  Admin Verification
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Deeni Tutor. All rights reserved. Empowering Islamic Education Globally.</p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 font-bold text-[#D9A441] tracking-wider uppercase text-[11px]">
              <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
              <span>Bangladesh Pride</span>
            </div>
            <Link href="/faq" className="hover:text-white transition-colors">Safety &amp; Trust</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
