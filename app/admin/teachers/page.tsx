'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  ShieldCheck, 
  Check, 
  X, 
  Ban, 
  Star, 
  ExternalLink, 
  AlertCircle,
  FileText,
  Clock,
  MoreVertical,
  CheckCircle2,
  DollarSign,
  Award
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { adminService } from '@/lib/admin-service';
import { TeacherProfile, TeacherVerificationStatus } from '@/types/teacher';

export default function AdminTeachersPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => adminService.getTeachers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TeacherVerificationStatus>('all');
  const [notification, setNotification] = useState('');

  const loadTeachers = () => {
    setTeachers(adminService.getTeachers());
  };

  useEffect(() => {
    const handleSync = () => loadTeachers();
    window.addEventListener('deenitutor:admin-sync', handleSync);
    return () => window.removeEventListener('deenitutor:admin-sync', handleSync);
  }, []);

  const handleStatusChange = (teacherId: string, status: TeacherVerificationStatus, name: string) => {
    const res = adminService.updateTeacherStatus(teacherId, status, `Admin updated status to ${status}`, user?.full_name || 'Admin');
    if (res.success) {
      setNotification(`Teacher "${name}" status updated to: ${status.toUpperCase()}`);
      loadTeachers();
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleToggleFeatured = (teacherId: string, name: string) => {
    const res = adminService.toggleTeacherFeatured(teacherId, user?.full_name || 'Admin');
    if (res.success) {
      setNotification(`Featured status for "${name}" updated.`);
      loadTeachers();
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = 
      t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.madrasa_institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || t.verification_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TeacherVerificationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Live &amp; Verified</span>;
      case 'under_review':
      case 'submitted':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" /> Under Review</span>;
      case 'suspended':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><Ban className="w-3 h-3" /> Suspended</span>;
      case 'rejected':
        return <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px]">Rejected</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px]">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Madrasa Faculty Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee, verify, suspend, and feature Islamic scholars and Arabic instructors.
          </p>
        </div>

        <Link
          href="/admin/applications"
          className="px-4 py-2 bg-[#0F2A43] hover:bg-[#163C5F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <FileText className="w-4 h-4 text-[#D9A441]" />
          <span>Pending Applications</span>
        </Link>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, madrasa (Hathazari, Baridhara...), subjects, or city..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
            {(['all', 'approved', 'under_review', 'suspended', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer shrink-0 ${
                  statusFilter === st
                    ? 'bg-[#0F2A43] text-white shadow-xs'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {st === 'under_review' ? 'Under Review' : st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Teachers Table / List */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {filteredTeachers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <GraduationCap className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-[#0F2A43]">No teachers found</p>
            <p className="text-xs">Try adjusting your search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Scholar &amp; Madrasa</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Subjects &amp; Levels</th>
                  <th className="py-3 px-4">Rating &amp; Lessons</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Scholar & Madrasa */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                          <Image
                            src={t.photo_url}
                            alt={t.full_name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-[#0F2A43]">{t.full_name}</span>
                            {t.featured && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1 rounded flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{t.madrasa_institution}</p>
                          <p className="text-[10px] text-slate-400">{t.city}, {t.country}</p>
                        </div>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-bold text-[#16845B]">${t.hourly_rate}/hr</p>
                      <p className="text-[10px] text-slate-400">Trial: ${t.trial_rate ?? 4} (30m)</p>
                    </td>

                    {/* Subjects */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {t.subjects.slice(0, 3).map((sub, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                            {sub}
                          </span>
                        ))}
                        {t.subjects.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{t.subjects.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Rating & Lessons */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-slate-700">
                        <Star className="w-3.5 h-3.5 fill-[#D9A441] text-[#D9A441]" />
                        <span>{t.rating.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({t.review_count})</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{t.total_lessons} lessons taught</p>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(t.verification_status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        <Link
                          href={`/teachers/${t.slug}`}
                          target="_blank"
                          title="View Public Profile"
                          className="p-1.5 text-slate-500 hover:text-[#0F2A43] hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleToggleFeatured(t.id, t.full_name)}
                          title={t.featured ? 'Unfeature from home' : 'Feature on homepage'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            t.featured ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${t.featured ? 'fill-amber-500' : ''}`} />
                        </button>

                        {t.verification_status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(t.id, 'approved', t.full_name)}
                            title="Approve and Publish Live"
                            className="px-2.5 py-1 bg-[#16845B] hover:bg-[#126D4B] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> Approve
                          </button>
                        )}

                        {t.verification_status === 'approved' && (
                          <button
                            onClick={() => handleStatusChange(t.id, 'suspended', t.full_name)}
                            title="Suspend Teacher"
                            className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Ban className="w-3 h-3" /> Suspend
                          </button>
                        )}

                        {t.verification_status === 'suspended' && (
                          <button
                            onClick={() => handleStatusChange(t.id, 'approved', t.full_name)}
                            title="Re-activate Teacher"
                            className="px-2.5 py-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Reactivate
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
