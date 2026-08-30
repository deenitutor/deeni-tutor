'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  BookOpen, 
  DollarSign, 
  Clock, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  AlertCircle,
  Video,
  Languages,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { POPULAR_SUBJECTS } from '@/lib/mock-data';
import { Gender, TeacherDocumentType } from '@/types/teacher';

const BD_DISTRICTS = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 
  'Rangpur', 'Mymensingh', 'Comilla', 'Brahmanbaria', 'Gazipur', 
  'Narayanganj', 'Bogura', 'Cox\'s Bazar', 'Jessore', 'Feni', 'Other'
];

const TEACHING_LANGUAGES_LIST = ['Bengali', 'English', 'Arabic', 'Urdu', 'Sylheti', 'Chittagonian', 'Hindi'];

const DEFAULT_LEVELS = [
  'Beginner (Noorani Qaida / Alphabet)',
  'Elementary (A1-A2)',
  'Intermediate (B1-B2)',
  'Advanced / Dawra-e-Hadith'
];

export default function TeacherRegisterPage() {
  const router = useRouter();
  const { signUp, user } = useAuth();

  // Form states
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gender, setGender] = useState<Gender>('male');
  const [city, setCity] = useState('Dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [institution, setInstitution] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400');
  const [bio, setBio] = useState('');
  const [aboutTeaching, setAboutTeaching] = useState('');
  const [yearsOfExp, setYearsOfExp] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(10);
  const [trialRate, setTrialRate] = useState(4);
  const [timezone, setTimezone] = useState('Asia/Dhaka (GMT+6)');
  const [introVideoUrl, setIntroVideoUrl] = useState('');

  // Multi-item fields
  const [qualifications, setQualifications] = useState<string[]>([
    'Dawra-e-Hadith (Takmeel) - 1st Division',
    'Sanad in Tajweed (Hafs an Asim)'
  ]);
  const [newQual, setNewQual] = useState('');

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Arabic Language (Fusha)',
    'Quranic Arabic & Tafseer',
    'Tajweed & Makharij',
    'Nahw'
  ]);

  const [selectedLevels, setSelectedLevels] = useState<string[]>([
    'Beginner (Noorani Qaida / Alphabet)',
    'Elementary (A1-A2)',
    'Intermediate (B1-B2)'
  ]);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    'Bengali',
    'English',
    'Arabic'
  ]);

  // Documents
  const [documents, setDocuments] = useState<{
    type: TeacherDocumentType;
    title: string;
    fileName: string;
    fileUrl: string;
  }[]>([
    {
      type: 'identity_document',
      title: 'National NID / Passport',
      fileName: 'nid_card_copy.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600'
    },
    {
      type: 'madrasa_certificate',
      title: 'Dawra-e-Hadith Sanad / Takmeel Certificate',
      fileName: 'takmeel_sanad.pdf',
      fileUrl: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&q=80&w=600'
    }
  ]);

  const [newDocType, setNewDocType] = useState<TeacherDocumentType>('teaching_certificate');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFileName, setNewDocFileName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handlers
  const handleAddQualification = () => {
    if (newQual.trim()) {
      setQualifications([...qualifications, newQual.trim()]);
      setNewQual('');
    }
  };

  const handleRemoveQualification = (index: number) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  const toggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== subjectName));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

  const toggleLevel = (lvl: string) => {
    if (selectedLevels.includes(lvl)) {
      if (selectedLevels.length > 1) {
        setSelectedLevels(selectedLevels.filter(l => l !== lvl));
      }
    } else {
      setSelectedLevels([...selectedLevels, lvl]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      if (selectedLanguages.length > 1) {
        setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
      }
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setDocuments([
      ...documents,
      {
        type: newDocType,
        title: newDocTitle.trim(),
        fileName: newDocFileName.trim() || `${newDocType}_uploaded.pdf`,
        fileUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600'
      }
    ]);
    setNewDocTitle('');
    setNewDocFileName('');
  };

  const handleRemoveDoc = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!institution.trim()) {
      setErrorMsg('Please enter your Madrasa or Academic Institution.');
      return;
    }

    if (selectedSubjects.length === 0) {
      setErrorMsg('Please select at least one teaching subject.');
      return;
    }

    if (qualifications.length === 0) {
      setErrorMsg('Please add at least one qualification or degree.');
      return;
    }

    setIsSubmitting(true);

    try {
      // If user not signed in, create auth account
      if (!user && password) {
        await signUp(email, password, fullName, 'teacher');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'An error occurred during submission. Please try again.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-[#F7F5EF] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm text-center space-y-6">
          <div className="w-16 h-16 bg-[#E8F5EF] text-[#16845B] rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-[#D9A441]/15 text-[#9E6E16] px-3 py-1 rounded-full uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" /> Application Under Review
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
              JazakAllahu Khair, {fullName}!
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Your teacher application and verification documents have been submitted to the Deeni Tutor Academic Review Board.
            </p>
          </div>

          {/* Verification Timeline Card */}
          <div className="bg-[#FAF9F5] p-6 rounded-xl border border-slate-200 text-left space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F2A43] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16845B]" />
              What Happens Next? (24–48 Hours)
            </h3>
            
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#16845B] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <span className="font-bold text-[#0F2A43]">Document &amp; Sanad Verification:</span> Our admin team reviews your NID and Madrasa Takmeel/Sanad records.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#16845B] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <span className="font-bold text-[#0F2A43]">Quick Aptitude &amp; Audio Call:</span> A 10-minute briefing on Zoom/Meet regarding curriculum and student communication.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#16845B] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <span className="font-bold text-[#0F2A43]">Public Marketplace Activation:</span> Once approved, your profile becomes visible on the public directory for international students.
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/teacher/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0F2A43] hover:bg-[#163C5F] text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Go to Teacher Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/teachers"
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F2A43] text-xs font-bold rounded-lg transition-colors"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-[#0F2A43] text-white rounded-2xl p-6 sm:p-10 shadow-xs border border-[#1E3E5B]">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#16845B] text-white px-2.5 py-0.5 rounded uppercase tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" /> Teacher Application
              </span>
              <span className="text-xs text-[#D9A441] font-semibold">Section 2 &amp; 10 Verified Onboarding</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Teach Quran &amp; Arabic to Diaspora Students
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join Deeni Tutor as a verified scholar. Set your own schedule, connect with eager students across the UK, USA, and Canada, and earn in USD with secure Bangladesh payouts.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitApplication} className="space-y-8">
          
          {/* 1. Basic Personal Info */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#0F2A43] pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-[#16845B]" />
              <span>1. Personal &amp; Account Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name (with title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mawlana Tariqul Islam / Ustadha Fatima"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                />
              </div>

              {!user && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password (for login) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs px-3.5 pr-10 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gender *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-2 text-xs font-bold rounded-lg border capitalize cursor-pointer transition-all ${
                        gender === g
                          ? 'bg-[#16845B] text-white border-[#16845B]'
                          : 'bg-[#FAF9F5] text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {g} Teacher
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City / Upazila *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mirpur, Dhaka or Hathazari, Chittagong"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  District (Bangladesh) *
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                >
                  {BD_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Profile Photo URL *
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                    <Image
                      src={photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'}
                      alt="Profile Preview"
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://... or photo link"
                    className="flex-1 text-xs px-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Academic & Madrasa Qualifications */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#0F2A43] pb-2 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#16845B]" />
              <span>2. Academic Background &amp; Madrasa Credentials</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Madrasa / University Institution *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Darul Uloom Hathazari / Jamia Rahmania Arabia / University of Dhaka"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Qualifications &amp; Sanads (Add all that apply) *
                </label>
                <div className="space-y-2 mb-3">
                  {qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F5] border border-slate-200 text-xs">
                      <span className="font-semibold text-[#0F2A43]">{q}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQualification(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Takmeel (Dawra-e-Hadith), Kamil Hadith, Ijazah in Tajweed, BA Arabic..."
                    value={newQual}
                    onChange={(e) => setNewQual(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddQualification(); } }}
                    className="flex-1 text-xs px-3.5 py-2 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43]"
                  />
                  <button
                    type="button"
                    onClick={handleAddQualification}
                    className="px-4 py-2 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Years of Teaching Experience *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={yearsOfExp}
                    onChange={(e) => setYearsOfExp(Number(e.target.value))}
                    className="w-full text-xs px-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Intro Video Link (YouTube / Google Drive)
                  </label>
                  <input
                    type="text"
                    placeholder="https://youtu.be/..."
                    value={introVideoUrl}
                    onChange={(e) => setIntroVideoUrl(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  About Me / Teacher Bio *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Introduce yourself to prospective international students and parents. Mention your madrasa background and teaching passion."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs p-3.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Teaching Methodology &amp; Lesson Structure
                </label>
                <textarea
                  rows={2}
                  placeholder="How do you structure your lessons? (e.g. whiteboard breakdown for Nahw, live articulation correction for Tajweed)."
                  value={aboutTeaching}
                  onChange={(e) => setAboutTeaching(e.target.value)}
                  className="w-full text-xs p-3.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B]"
                />
              </div>
            </div>
          </div>

          {/* 3. Subjects & Teaching Specialties */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#0F2A43] pb-2 border-b border-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#16845B]" />
              <span>3. Subjects, Levels &amp; Spoken Languages</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Subjects You Teach *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {POPULAR_SUBJECTS.map((subj) => {
                    const isSelected = selectedSubjects.includes(subj.name);
                    return (
                      <button
                        type="button"
                        key={subj.id}
                        onClick={() => toggleSubject(subj.name)}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#E8F5EF] border-[#16845B] text-[#0F2A43] font-bold'
                            : 'bg-[#FAF9F5] border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="truncate">{subj.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B] shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Student Proficiency Levels You Accept *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DEFAULT_LEVELS.map((lvl) => {
                    const isSelected = selectedLevels.includes(lvl);
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => toggleLevel(lvl)}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#E8F5EF] border-[#16845B] text-[#0F2A43] font-bold'
                            : 'bg-[#FAF9F5] border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span>{lvl}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Teaching Languages Spoken *
                </label>
                <div className="flex flex-wrap gap-2">
                  {TEACHING_LANGUAGES_LIST.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        type="button"
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F2A43] border-[#0F2A43] text-white font-bold'
                            : 'bg-[#FAF9F5] border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Rates & Timezone Settings */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            <h2 className="text-base font-bold text-[#0F2A43] pb-2 border-b border-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#16845B]" />
              <span>4. Rates &amp; Timezone</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Hourly Rate ($USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full text-xs pl-7 pr-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Platform standard: $8 – $15/hr</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Trial Lesson Price (30m) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={trialRate}
                    onChange={(e) => setTrialRate(Number(e.target.value))}
                    className="w-full text-xs pl-7 pr-3.5 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-[#0F2A43] font-bold"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Recommended: $3 – $5 to attract students</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Timezone *
                </label>
                <input
                  type="text"
                  disabled
                  value={timezone}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-semibold cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Converted automatically for students</span>
              </div>
            </div>
          </div>

          {/* 5. Document Uploads for Admin Verification (Section 10) */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F2A43] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#16845B]" />
                <span>5. Verification Documents (Section 10)</span>
              </h2>
              <span className="text-[10px] font-bold bg-[#E8F5EF] text-[#16845B] px-2 py-0.5 rounded uppercase">
                Private &amp; Secure Storage
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your National NID, Madrasa Takmeel / Dawra-e-Hadith certificate, and any teaching Ijazahs. These files are stored in private encrypted storage and only accessible to Deeni Tutor reviewers.
            </p>

            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#FAF9F5] border border-slate-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#16845B] shrink-0" />
                    <div>
                      <div className="font-bold text-xs text-[#0F2A43]">{doc.title}</div>
                      <div className="text-[10px] text-slate-500">{doc.fileName} • Type: {doc.type}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Document Row */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-[#FAF9F5] space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Attach Additional Certificate or Document</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as TeacherDocumentType)}
                  className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-[#0F2A43]"
                >
                  <option value="identity_document">Identity (NID / Passport)</option>
                  <option value="madrasa_certificate">Madrasa Sanad (Takmeel/Fazilat)</option>
                  <option value="academic_qualification">University / Academic Degree</option>
                  <option value="teaching_certificate">Teaching Certificate / Ijazah</option>
                  <option value="other_proof">Other Proof</option>
                </select>

                <input
                  type="text"
                  placeholder="Document Title (e.g. Fazil Sanad)"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg text-[#0F2A43]"
                />

                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="px-4 py-2 bg-[#0F2A43] hover:bg-[#163C5F] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Attach File
                </button>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="p-6 bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              By submitting, you confirm that all entered educational credentials and sanads are authentic.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application for Review'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
