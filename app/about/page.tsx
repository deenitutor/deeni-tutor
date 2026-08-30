import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  ShieldCheck, 
  Heart, 
  Globe2, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles,
  Users,
  Award
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#F7F5EF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8F5EF] border border-[#16845B]/20">
            <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider">
              Our Mission &amp; Heritage
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2A43]">
            Bridging Bangladeshi Islamic Scholarship with the Global Ummah
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Deeni Tutor was founded with a singular purpose: to make authentic, rigorous Arabic &amp; Quranic education accessible, affordable, and flexible for expatriate families, adults, and children worldwide.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="bg-white rounded-xl p-8 sm:p-10 border border-[#E2E8F0] shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider">
              The Genesis of Deeni Tutor
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
              Why Bangladeshi Madrasa Scholars?
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Bangladesh is home to one of the world&apos;s most profound and dedicated networks of classical Islamic scholars. In institutions like Darul Uloom Hathazari, Jamia Rahmania, and the University of Dhaka, students spend 12 to 16 years immersing themselves in classical Arabic grammar (Nahw and Sarf), Quranic exegesis (Tafseer), Hadith sciences, and Tajweed with unbroken chains of transmission (Sanad).
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Meanwhile, millions of Muslim families living in the UK, USA, Canada, Australia, and the Middle East struggle to find qualified, punctual, and culturally empathetic tutors who can teach their children or guide adults through classical texts at fair international prices.
            </p>
            <p className="text-xs sm:text-sm text-[#16845B] font-bold">
              Deeni Tutor builds this bridge with transparency, verified credentials, and modern interactive technology.
            </p>
          </div>

          <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-xl border border-[#E2E8F0] space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-[#0F2A43] border-b border-slate-200 pb-3">
              Our 4 Pillars of Trust
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#16845B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0F2A43]">Verified Madrasa Qualifications</h4>
                  <p className="text-xs text-slate-600">Every teacher undergoes strict NID, Dawra-e-Hadith/Takmeel certificate verification and oral teaching interview.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#16845B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0F2A43]">Unmatched Affordability</h4>
                  <p className="text-xs text-slate-600">High-quality 1-on-1 tutoring starting at $8–$15/hr, enabling consistent 3-5 days/week Quranic memorization and grammar mastery.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#16845B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Globe2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0F2A43]">Global Timezone Support</h4>
                  <p className="text-xs text-slate-600">Our teachers accommodate evening and weekend time slots across North America, Europe, Australia, and the Gulf.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#16845B] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <Heart className="w-4 h-4 text-rose-300" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#0F2A43]">Direct Economic Empowerment</h4>
                  <p className="text-xs text-slate-600">80%+ of booking fees go directly to Bangladeshi teachers, empowering scholars with honorable livelihood in Bangladesh.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0F2A43] text-white rounded-xl p-8 sm:p-12 text-center space-y-6 border border-[#1E3E5B]">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Join the Deeni Tutor Community Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience authentic classical Arabic &amp; Quran recitation lessons guided by Bangladesh&apos;s most devoted scholars.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/teachers"
              className="px-5 py-2.5 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              Browse Verified Teachers
            </Link>
            <Link
              href="/signup?role=teacher"
              className="px-5 py-2.5 bg-[#D9A441] hover:bg-[#C49132] text-[#0F2A43] text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              Apply as a Teacher
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
