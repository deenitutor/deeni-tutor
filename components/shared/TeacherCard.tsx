'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  Languages, 
  GraduationCap, 
  MapPin, 
  Calendar, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TeacherProfile } from '@/types/teacher';

interface TeacherCardProps {
  teacher: TeacherProfile;
  featuredHighlight?: boolean;
}

export default function TeacherCard({ teacher, featuredHighlight = false }: TeacherCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group ${
        featuredHighlight 
          ? 'border-[#16845B]/40 shadow-sm ring-1 ring-[#16845B]/15 hover:shadow-md' 
          : 'border-[#E2E8F0] shadow-xs hover:border-[#16845B]/40 hover:shadow-md'
      }`}
    >
      <div>
        {/* Top Header Card Info */}
        <div className="p-5 pb-4">
          <div className="flex items-start gap-4">
            
            {/* Teacher Avatar with Geometric Frame */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-[#FAF9F5] relative border-2 border-[#16845B]/30 shadow-xs">
                <Image
                  src={teacher.photo_url}
                  alt={teacher.full_name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              {teacher.is_verified && (
                <div 
                  className="absolute -bottom-1 -right-1 bg-[#16845B] text-white p-1 rounded-full shadow-xs"
                  title="Verified Scholar"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link 
                  href={`/teachers/${teacher.slug}`}
                  className="font-bold text-[#0F2A43] hover:text-[#16845B] text-base sm:text-lg transition-colors truncate block"
                >
                  {teacher.full_name}
                </Link>
              </div>

              <p className="text-xs text-[#16845B] font-medium mt-0.5 line-clamp-1">
                {teacher.madrasa_institution}
              </p>

              {/* Rating & Lessons */}
              <div className="flex items-center gap-3 text-xs mt-2 text-slate-600">
                <div className="flex items-center gap-1 font-semibold text-[#0F2A43]">
                  <Star className="w-3.5 h-3.5 text-[#D9A441] fill-[#D9A441]" />
                  <span>{teacher.rating.toFixed(2)}</span>
                  <span className="text-slate-400 font-normal">({teacher.review_count})</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1 text-slate-600">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.years_of_experience}y exp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Headline / Bio snippet */}
          <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
            {teacher.bio}
          </p>

          {/* Subjects badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {teacher.subjects.slice(0, 3).map((subj) => (
              <span
                key={subj}
                className="inline-block text-[11px] font-medium bg-[#F7F5EF] text-[#0F2A43] px-2 py-0.5 rounded-md border border-[#E2E8F0]"
              >
                {subj}
              </span>
            ))}
            {teacher.subjects.length > 3 && (
              <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-md">
                +{teacher.subjects.length - 3} more
              </span>
            )}
          </div>

          {/* Languages & Location */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1 truncate max-w-[65%]">
              <Languages className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{teacher.teaching_languages.join(', ')}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-slate-500">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>{teacher.city}, BD</span>
            </div>
          </div>
        </div>

        {/* Pricing Banner */}
        <div className="bg-[#FAF9F5] px-5 py-3 border-t border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Regular Rate</span>
            <span className="text-base font-bold text-[#16845B]">
              ${teacher.hourly_rate}
              <span className="text-xs font-normal text-slate-500">/hr</span>
            </span>
          </div>

          {teacher.trial_available && (
            <div className="text-right">
              <span className="text-[10px] text-[#0F2A43] font-semibold uppercase tracking-wider block">
                Trial Lesson (30m)
              </span>
              <span className="text-sm font-bold text-[#0F2A43]">
                ${teacher.trial_rate}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 pt-3 bg-white grid grid-cols-2 gap-2">
        <Link
          href={`/teachers/${teacher.slug}`}
          className="w-full text-center py-2 px-3 text-xs font-semibold text-[#0F2A43] hover:bg-[#F7F5EF] border border-[#E2E8F0] rounded-lg transition-colors"
        >
          View Profile
        </Link>
        <Link
          href={`/teachers/${teacher.slug}?book=trial`}
          className="w-full text-center py-2 px-3 text-xs font-bold text-white bg-[#16845B] hover:bg-[#126D4B] rounded-lg shadow-xs transition-all flex items-center justify-center gap-1"
        >
          <span>Book Trial</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
