'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  GraduationCap, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import { MOCK_TEACHERS, POPULAR_SUBJECTS } from '@/lib/mock-data';
import TeacherCard from '@/components/shared/TeacherCard';

function TeacherDirectoryContent() {
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get('subject') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice ? Number(initialMaxPrice) : 25);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'price_low' | 'price_high' | 'experience'>('recommended');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredTeachers = useMemo(() => {
    return MOCK_TEACHERS.filter((teacher) => {
      // Must be approved for public directory
      if (!teacher.is_approved) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = teacher.full_name.toLowerCase().includes(query);
        const matchesMadrasa = teacher.madrasa_institution.toLowerCase().includes(query);
        const matchesBio = teacher.bio.toLowerCase().includes(query);
        const matchesSubjects = teacher.subjects.some(s => s.toLowerCase().includes(query));
        const matchesCity = teacher.city.toLowerCase().includes(query) || teacher.district.toLowerCase().includes(query);
        if (!matchesName && !matchesMadrasa && !matchesBio && !matchesSubjects && !matchesCity) {
          return false;
        }
      }

      // Subject Filter
      if (selectedSubject) {
        const subjectObj = POPULAR_SUBJECTS.find(s => s.id === selectedSubject);
        const targetName = subjectObj ? subjectObj.name.toLowerCase() : selectedSubject.toLowerCase();
        const hasSubject = teacher.subjects.some(s => 
          s.toLowerCase().includes(targetName) || targetName.includes(s.toLowerCase())
        );
        if (!hasSubject) return false;
      }

      // Level Filter
      if (selectedLevel !== 'all') {
        const hasLevel = teacher.levels.some(l => 
          l.toLowerCase().includes(selectedLevel.toLowerCase()) || 
          selectedLevel.toLowerCase().includes(l.toLowerCase())
        );
        if (!hasLevel) return false;
      }

      // City / District Filter
      if (selectedCity !== 'all') {
        const matchesLocation = teacher.city.toLowerCase() === selectedCity.toLowerCase() || 
          teacher.district.toLowerCase() === selectedCity.toLowerCase();
        if (!matchesLocation) return false;
      }

      // Gender Filter
      if (selectedGender !== 'all' && teacher.gender !== selectedGender) {
        return false;
      }

      // Max Hourly Price Filter
      if (teacher.hourly_rate > maxPrice) {
        return false;
      }

      // Language Filter
      if (selectedLanguage !== 'all') {
        const hasLang = teacher.teaching_languages.some(l => l.toLowerCase() === selectedLanguage.toLowerCase());
        if (!hasLang) return false;
      }

      // Verified only
      if (verifiedOnly && !teacher.is_verified) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.hourly_rate - b.hourly_rate;
      if (sortBy === 'price_high') return b.hourly_rate - a.hourly_rate;
      if (sortBy === 'experience') return b.years_of_experience - a.years_of_experience;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); // Recommended
    });
  }, [searchQuery, selectedSubject, selectedLevel, selectedCity, selectedGender, maxPrice, selectedLanguage, verifiedOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('');
    setSelectedLevel('all');
    setSelectedCity('all');
    setSelectedGender('all');
    setMaxPrice(25);
    setSelectedLanguage('all');
    setVerifiedOnly(false);
    setSortBy('recommended');
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[#16845B] uppercase tracking-wider mb-1">
            <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
            <span>Verified Bangladesh Faculty</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2A43]">
            Find Your Arabic &amp; Quran Teacher
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl">
            Browse verified madrasa scholars and experienced Arabic educators. Book a trial lesson to experience personalized 1-on-1 teaching.
          </p>
        </div>

        {/* Top Quick Search Bar */}
        <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs mb-8 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by teacher name, madrasa (e.g. Hathazari), or topic (e.g. Nahw, Tajweed)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF9F5] border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold text-[#0F2A43] bg-white border border-slate-200 py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#16845B]"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-[#0F2A43] text-white text-xs font-bold rounded-lg"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filter (Desktop) */}
          <aside className={`md:block ${mobileFilterOpen ? 'block' : 'hidden'} md:col-span-1 space-y-6 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs h-fit`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-bold text-sm text-[#0F2A43]">
                <SlidersHorizontal className="w-4 h-4 text-[#16845B]" />
                <span>Filters</span>
              </div>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-400 hover:text-[#16845B] transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs font-medium text-[#0F2A43] bg-[#FAF9F5] border border-slate-200 py-2 px-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#16845B]"
              >
                <option value="">All Subjects</option>
                {POPULAR_SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Proficiency Level
              </label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full text-xs font-medium text-[#0F2A43] bg-[#FAF9F5] border border-slate-200 py-2 px-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#16845B]"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner (Noorani Qaida / Alphabet)</option>
                <option value="Elementary">Elementary (A1-A2)</option>
                <option value="Intermediate">Intermediate (B1-B2)</option>
                <option value="Advanced">Advanced / Takmeel</option>
              </select>
            </div>

            {/* City / District Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Location (Bangladesh)
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full text-xs font-medium text-[#0F2A43] bg-[#FAF9F5] border border-slate-200 py-2 px-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#16845B]"
              >
                <option value="all">All Locations</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chattogram</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Brahmanbaria">Brahmanbaria</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Teacher Gender
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-slate-200">
                {(['all', 'male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                      selectedGender === g
                        ? 'bg-white text-[#0F2A43] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Hourly Rate Filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 uppercase tracking-wider">
                  Max Price / hr
                </label>
                <span className="font-bold text-[#16845B]">${maxPrice}/hr</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#16845B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>$5/hr</span>
                <span>$15/hr</span>
                <span>$25/hr</span>
              </div>
            </div>

            {/* Language Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Teaching Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full text-xs font-medium text-[#0F2A43] bg-[#FAF9F5] border border-slate-200 py-2 px-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#16845B]"
              >
                <option value="all">All Languages</option>
                <option value="English">English</option>
                <option value="Bengali">Bengali</option>
                <option value="Arabic">Arabic</option>
                <option value="Urdu">Urdu</option>
                <option value="Sylheti">Sylheti</option>
              </select>
            </div>

            {/* Verified Badge Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 text-xs text-[#0F2A43] font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-[#16845B] focus:ring-[#16845B] w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                  Verified Scholars Only
                </span>
              </label>
            </div>
          </aside>

          {/* Right Teachers Grid */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Showing {filteredTeachers.length} available teachers</span>
              {(selectedSubject || selectedGender !== 'all' || maxPrice < 25 || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="text-[#16845B] hover:underline flex items-center gap-1"
                >
                  Clear active filters
                </button>
              )}
            </div>

            {filteredTeachers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#F7F5EF] text-[#0F2A43] mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-[#0F2A43] font-serif">No teachers matched your criteria</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Try broadening your search or adjusting your price and subject filters to view more teachers.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#16845B] text-white text-xs font-semibold rounded-xl hover:bg-[#126D4B] transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTeachers.map((teacher) => (
                  <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default function TeachersDirectoryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading teacher directory...</div>}>
      <TeacherDirectoryContent />
    </Suspense>
  );
}
