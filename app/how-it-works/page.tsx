import React from 'react';
import Link from 'next/link';
import { 
  Search, 
  Calendar, 
  Video, 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  DollarSign,
  Globe2,
  Clock
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="bg-[#F7F5EF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8F5EF] border border-[#16845B]/20">
            <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider">
              Clear &amp; Transparent
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2A43]">
            How Deeni Tutor Works
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Whether you are an expat parent looking for trusted Quran teachers for your children, or an adult student studying Arabic grammar (Nahw &amp; Sarf), Deeni Tutor connects you directly with verified Bangladeshi madrasa scholars.
          </p>
        </div>

        {/* Section 1: For Students & Parents */}
        <div className="bg-white rounded-xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs space-y-10">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider">Student &amp; Parent Journey</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2A43] mt-1">
              Start Learning in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#0F2A43] text-[#D9A441] flex items-center justify-center font-bold text-sm shadow-xs">
                1
              </div>
              <h3 className="font-bold text-base text-[#0F2A43]">Search &amp; Filter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by subject (Quranic Arabic, Tajweed, Fiqh), teacher gender, languages (Bengali/English), and hourly rates ($8–$15/hr).
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16845B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                2
              </div>
              <h3 className="font-bold text-base text-[#0F2A43]">Book a Trial Lesson</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose an available slot in your local timezone and book a discounted 30-minute trial ($3–$5) with zero long-term commitment.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#D9A441] text-[#0F2A43] flex items-center justify-center font-bold text-sm shadow-xs">
                3
              </div>
              <h3 className="font-bold text-base text-[#0F2A43]">Live 1-on-1 Class</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Join the secure video meeting directly from your student dashboard with interactive digital whiteboards and live feedback.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#163C5F] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                4
              </div>
              <h3 className="font-bold text-base text-[#0F2A43]">Weekly Progress</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Schedule regular weekly lessons, track child attendance, submit reviews, and pay lesson-by-lesson with full peace of mind.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/teachers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Browse Verified Teachers Now</span>
            </Link>
          </div>
        </div>

        {/* Section 2: For Teachers */}
        <div className="bg-[#0F2A43] text-white rounded-xl p-8 sm:p-10 shadow-xs space-y-8 border border-[#1E3E5B]">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">Teacher Onboarding</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              How Bangladeshi Scholars Teach on Deeni Tutor
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              We empower madrasa graduates and Arabic educators with global students and direct bank / bKash remuneration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#163C5F]/50 p-6 rounded-xl border border-[#163C5F]">
              <div className="w-9 h-9 rounded-lg bg-[#16845B] text-white flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">1. Submit Qualifications</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Upload your Dawra-e-Hadith / Takmeel / Kamil degrees and Tajweed certificates for administrative verification.
              </p>
            </div>

            <div className="bg-[#163C5F]/50 p-6 rounded-xl border border-[#163C5F]">
              <div className="w-9 h-9 rounded-lg bg-[#16845B] text-white flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white">2. Set Availability &amp; Rate</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Choose the hours you want to teach and set your hourly rate (typically $8–$15/hr) in your teacher dashboard.
              </p>
            </div>

            <div className="bg-[#163C5F]/50 p-6 rounded-xl border border-[#163C5F]">
              <div className="w-9 h-9 rounded-lg bg-[#16845B] text-white flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5 text-[#D9A441]" />
              </div>
              <h3 className="font-bold text-base text-white">3. Teach &amp; Earn in BDT</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Conduct online classes and receive prompt withdrawals directly to your Bangladeshi bank account or bKash wallet.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/signup?role=teacher"
              className="inline-block px-5 py-2.5 bg-[#D9A441] hover:bg-[#C49132] text-[#0F2A43] text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              Apply as a Teacher
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
