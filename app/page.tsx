'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Globe2, 
  DollarSign, 
  Clock, 
  HeartHandshake, 
  Users, 
  ChevronDown, 
  Star,
  PlayCircle
} from 'lucide-react';
import { MOCK_TEACHERS, POPULAR_SUBJECTS, TESTIMONIALS, FAQS } from '@/lib/mock-data';
import TeacherCard from '@/components/shared/TeacherCard';

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredTeachers = MOCK_TEACHERS.filter(t => t.featured).slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSubject) params.set('subject', selectedSubject);
    if (selectedLevel) params.set('level', selectedLevel);
    if (selectedBudget) params.set('maxPrice', selectedBudget);
    window.location.href = `/teachers?${params.toString()}`;
  };

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative bg-[#0F2A43] text-white pt-16 pb-24 overflow-hidden border-b border-[#163C5F]">
        {/* Geometric dot pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none geometric-pattern-dark" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Top Badge with Geometric diamond */}
            <div className="inline-flex items-center gap-2 bg-[#16845B]/20 text-[#D9A441] border border-[#D9A441]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-xs">
              <div className="w-2 h-2 bg-[#D9A441] rotate-45"></div>
              <span>Direct Madrasa &amp; University Arabic Scholars</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] text-white">
              Learn Arabic from qualified Bangladeshi teachers —{' '}
              <span className="text-[#D9A441]">online, affordably,</span> and flexibly.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect 1-on-1 with authentic Dawra-e-Hadith scholars, Alims, and certified Tajweed Qaris. Tailored lessons for kids, adults, and expatriate families worldwide.
            </p>

            {/* 2. Interactive Search Box (Geometric Balance) */}
            <div className="pt-4">
              <form 
                onSubmit={handleSearchSubmit}
                className="bg-white p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-2xl border border-[#D9A441]/30 text-[#16202A] max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 items-center"
              >
                {/* Subject Selector */}
                <div className="text-left px-3 py-1 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full text-sm font-semibold text-[#0F2A43] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">All Arabic &amp; Quran</option>
                    <option value="arabic-language">Arabic Language (Fusha)</option>
                    <option value="quranic-arabic">Quranic Arabic &amp; Tafseer</option>
                    <option value="quran-reading">Quran Reading (Nazira)</option>
                    <option value="tajweed">Tajweed &amp; Makharij</option>
                    <option value="nahw">Arabic Syntax (Nahw)</option>
                    <option value="sarf">Arabic Morphology (Sarf)</option>
                    <option value="islamic-studies">Islamic Studies &amp; Fiqh</option>
                    <option value="arabic-for-kids">Arabic for Kids</option>
                    <option value="arabic-conversation">Arabic Conversation</option>
                  </select>
                </div>

                {/* Level Selector */}
                <div className="text-left px-3 py-1 border-b sm:border-b-0 sm:border-r border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Student Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full text-sm font-semibold text-[#0F2A43] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">Any Level</option>
                    <option value="beginner">Beginner (Noorani Qaida)</option>
                    <option value="elementary">Elementary (A1-A2)</option>
                    <option value="intermediate">Intermediate (B1-B2)</option>
                    <option value="advanced">Advanced / Dawra</option>
                  </select>
                </div>

                {/* Budget Selector */}
                <div className="text-left px-3 py-1 sm:border-r lg:border-r border-slate-200">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Max Rate (USD)
                  </label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full text-sm font-semibold text-[#0F2A43] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="">Any Budget</option>
                    <option value="8">Under $8 / hr</option>
                    <option value="10">Under $10 / hr</option>
                    <option value="12">Under $12 / hr</option>
                    <option value="15">Under $15 / hr</option>
                  </select>
                </div>

                {/* Search Button */}
                <div className="sm:col-span-3 lg:col-span-1">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-lg sm:rounded-xl bg-[#D9A441] hover:bg-[#C49132] text-[#0F2A43] font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Teacher</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D9A441]" />
                Trial lessons from $3–$5
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D9A441]" />
                100% Background-checked
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D9A441]" />
                Flexible timezone scheduling
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Trust & Verification Stats Bar (Geometric Balance) */}
      <section className="bg-white border-b border-[#E2E8F0] py-6 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E2E8F0]">
            
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">100%</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Verified Scholars</p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-bold text-[#16845B]">$8 - $15</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg. Hourly Rate</p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">4.95 / 5.0</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Student Rating</p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <p className="text-2xl sm:text-3xl font-bold text-[#D9A441]">30+ Countries</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Expat Families</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Popular Subjects */}
      <section className="py-16 bg-[#F7F5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider block mb-1">
                Curriculum &amp; Sciences
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
                Popular Arabic &amp; Islamic Subjects
              </h2>
            </div>
            <Link
              href="/teachers"
              className="mt-3 md:mt-0 text-sm font-bold text-[#16845B] hover:text-[#126D4B] flex items-center gap-1 transition-colors"
            >
              <span>Explore all subjects</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {POPULAR_SUBJECTS.map((subj) => (
              <Link
                key={subj.id}
                href={`/teachers?subject=${subj.id}`}
                className="p-5 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#E2E8F0] hover:border-[#16845B]/50 transition-all group flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-[#F7F5EF] text-[#16845B] flex items-center justify-center mb-3 group-hover:bg-[#16845B] group-hover:text-white transition-colors border border-[#E2E8F0]">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-bold text-[#0F2A43] text-sm group-hover:text-[#16845B] transition-colors line-clamp-1">
                    {subj.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {subj.description}
                  </p>
                </div>
                <div className="mt-4 pt-2 flex items-center gap-1 text-[11px] font-bold text-[#16845B]">
                  <span>Find tutors</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Featured Teachers */}
      <section className="py-16 bg-white border-t border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider block mb-1">
                Verified Faculty
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
                Featured Bangladeshi Scholars &amp; Teachers
              </h2>
              <p className="text-sm text-slate-600 mt-1.5">
                Graduates from Darul Uloom Hathazari, Dhaka University, Jamia Rahmania, and Baitul Mukarram.
              </p>
            </div>
            <Link
              href="/teachers"
              className="mt-4 md:mt-0 px-4 py-2.5 rounded-lg bg-[#F7F5EF] border border-[#E2E8F0] text-xs font-bold text-[#0F2A43] hover:bg-slate-100 shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>View All Teachers ({MOCK_TEACHERS.length})</span>
              <ArrowRight className="w-4 h-4 text-[#16845B]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTeachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} featuredHighlight={true} />
            ))}
          </div>

        </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-20 bg-[#F7F5EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider block mb-1">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
              How Deeni Tutor Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Start learning authentic Quranic Arabic in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl border border-[#E2E8F0] shadow-xs relative">
              <div className="w-10 h-10 rounded-lg bg-[#0F2A43] text-[#D9A441] flex items-center justify-center font-bold text-base mb-6 shadow-xs">
                1
              </div>
              <h3 className="text-base font-bold text-[#0F2A43] mb-2">
                Discover Verified Teachers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Filter by subject (Nahw, Tajweed, Fusha), gender, teaching languages (Bengali/English), price, and timezone compatibility.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl border border-[#E2E8F0] shadow-xs relative">
              <div className="w-10 h-10 rounded-lg bg-[#16845B] text-white flex items-center justify-center font-bold text-base mb-6 shadow-xs">
                2
              </div>
              <h3 className="text-base font-bold text-[#0F2A43] mb-2">
                Book a Low-Cost Trial
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Schedule a 30-minute introductory lesson for just $3–$5. Assess the teacher&apos;s style, syllabus, and audio/video connection.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl border border-[#E2E8F0] shadow-xs relative">
              <div className="w-10 h-10 rounded-lg bg-[#D9A441] text-[#0F2A43] flex items-center justify-center font-bold text-base mb-6 shadow-xs">
                3
              </div>
              <h3 className="text-base font-bold text-[#0F2A43] mb-2">
                Learn 1-on-1 Online
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Join live 1-on-1 video lessons directly from your student dashboard with interactive whiteboards and direct teacher feedback.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Why Bangladeshi Teachers */}
      <section className="py-20 bg-[#0F2A43] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none geometric-pattern-dark" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D9A441] uppercase tracking-wider mb-2">
                <div className="w-2 h-2 bg-[#D9A441] rotate-45"></div>
                <span>The Bangladeshi Advantage</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold leading-tight text-white mb-6">
                Why learn from Bangladesh&apos;s Madrasa &amp; Arabic Scholars?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Bangladesh hosts one of the largest and most rigorous Dars-e-Nizami madrasa networks in the world. Teachers spend 12–16 years mastering classical Arabic grammar, Hadith, and Tajweed with unparalleled dedication.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded bg-[#16845B] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Traditional Dars-e-Nizami Rigor</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Mastery of classical Nahw (Syntax), Sarf (Morphology), and Balaghah from original foundational texts.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded bg-[#16845B] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <DollarSign className="w-4 h-4 text-[#D9A441]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">International Affordability</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Quality education at $8–$15/hr, making continuous 3-5 days/week tutoring affordable for diaspora families.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded bg-[#16845B] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Cultural Affinity &amp; Fluent Languages</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Fluent in Bengali, English, Urdu, and Arabic—ideal for Bengali expat families in UK, USA, Canada, and Gulf.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-[#163C5F]/40 p-8 rounded-2xl border border-[#163C5F] backdrop-blur-xs space-y-6">
              <div className="border-b border-[#163C5F] pb-4">
                <p className="text-xs text-[#D9A441] font-semibold uppercase tracking-wider">Institution Standards</p>
                <h3 className="text-lg font-bold text-white mt-1">Verified Credentials</h3>
              </div>

              <ul className="space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>Darul Uloom Hathazari (Takmeel / Dawra-e-Hadith)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>University of Dhaka (Department of Arabic)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>Jamia Rahmania &amp; Jamia Qurania Lalbagh</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>Baitul Mukarram National Mosque Quran Academy</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
                  <span>Certified Ijazah in 10 Qira&apos;at and Tajweed</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  href="/teachers"
                  className="w-full block text-center py-3 px-4 bg-[#D9A441] hover:bg-[#C49132] text-[#0F2A43] font-bold rounded-lg transition-all shadow-sm text-sm"
                >
                  Browse Verified Bangladeshi Teachers
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider block mb-1">
              Global Expat Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
              Trusted by Students &amp; Families Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-xl bg-[#F7F5EF] border border-[#E2E8F0] flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#D9A441] mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D9A441]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#0F2A43]">{t.author}</h4>
                    <p className="text-[11px] text-slate-500">{t.role} • {t.location}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-[#E8F5EF] text-[#16845B] px-2 py-0.5 rounded">
                    {t.subject}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. Teacher CTA Banner */}
      <section className="py-16 bg-[#16845B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-[#126D4B] p-8 sm:p-10 rounded-2xl border border-[#16845B]/60 shadow-md">
            
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#D9A441] uppercase tracking-wider">
                <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
                <span>For Bangladeshi Teachers &amp; Scholars</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Share your Quranic and Arabic knowledge with global learners.
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Set your own hourly rate, choose your weekly schedule, and receive secure direct payouts to your Bangladeshi bank account or bKash wallet.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                href="/signup?role=teacher"
                className="text-center px-6 py-3 bg-[#D9A441] hover:bg-[#C49132] text-[#0F2A43] font-bold rounded-lg shadow-sm transition-all text-xs sm:text-sm"
              >
                Apply to Teach Now
              </Link>
              <Link
                href="/how-it-works"
                className="text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg border border-white/20 transition-all text-xs sm:text-sm"
              >
                Teacher FAQs
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 10. FAQ Accordion */}
      <section className="py-20 bg-[#F7F5EF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider block mb-1">
              Common Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS[0].questions.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0F2A43] hover:text-[#16845B] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#16845B]' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="text-xs sm:text-sm font-bold text-[#16845B] hover:underline"
            >
              View all FAQs for Students &amp; Teachers →
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
