'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Ban, 
  Calendar, 
  DollarSign, 
  Globe, 
  Clock, 
  Check 
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { adminService } from '@/lib/admin-service';
import { AdminStudentSummary } from '@/types/admin';

export default function AdminStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<AdminStudentSummary[]>(() => adminService.getStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [notification, setNotification] = useState('');

  const loadStudents = () => {
    setStudents(adminService.getStudents());
  };

  useEffect(() => {
    const handleSync = () => loadStudents();
    window.addEventListener('deenitutor:admin-sync', handleSync);
    return () => window.removeEventListener('deenitutor:admin-sync', handleSync);
  }, []);

  const handleToggleStatus = (studentId: string, name: string) => {
    const res = adminService.toggleStudentStatus(studentId, user?.full_name || 'Super Admin');
    if (res.success) {
      setNotification(`Student "${name}" account status updated to: ${res.status?.toUpperCase()}`);
      loadStudents();
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Student &amp; Parent Learner Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee international Muslim diaspora students enrolled in Quran, Arabic &amp; Tajweed programs.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-[#0F2A43] text-white text-xs font-bold rounded-xl self-start sm:self-auto flex items-center gap-1.5 shadow-xs">
          <Users className="w-4 h-4 text-[#D9A441]" />
          <span>{students.length} Registered Student Accounts</span>
        </span>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, or country (UK, USA, Canada, UAE)..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'active', 'suspended'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#0F2A43] text-white shadow-xs'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Student &amp; Email</th>
                <th className="py-3 px-4">Country &amp; Timezone</th>
                <th className="py-3 px-4">Bookings Count</th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Name & Email */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <p className="font-bold text-[#0F2A43] text-sm">{s.full_name}</p>
                      <p className="text-slate-400 text-[11px]">{s.email}</p>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-700 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-[#16845B]" />
                        {s.country}
                      </p>
                      <p className="text-[10px] text-slate-400">{s.timezone}</p>
                    </div>
                  </td>

                  {/* Bookings */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#0F2A43] bg-slate-100 px-2 py-0.5 rounded">
                      {s.total_bookings} lessons
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#16845B]">
                      ${s.total_spent_usd.toFixed(2)} USD
                    </span>
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {s.created_at}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {s.status === 'active' ? (
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <Ban className="w-3 h-3" /> Suspended
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(s.id, s.full_name)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                        s.status === 'active'
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {s.status === 'active' ? 'Suspend' : 'Reactivate'}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
