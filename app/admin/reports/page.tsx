'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  X, 
  MessageSquare, 
  ShieldAlert, 
  Check,
  User
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { adminService } from '@/lib/admin-service';
import { PlatformReport } from '@/types/admin';

export default function AdminReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<PlatformReport[]>(() => adminService.getReports());
  const [selectedReport, setSelectedReport] = useState<PlatformReport | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'resolved' | 'dismissed'>('all');
  const [notification, setNotification] = useState('');

  const loadReports = () => {
    setReports(adminService.getReports());
  };

  useEffect(() => {
    const handleSync = () => loadReports();
    window.addEventListener('deenitutor:admin-sync', handleSync);
    return () => window.removeEventListener('deenitutor:admin-sync', handleSync);
  }, []);

  const handleResolve = (reportId: string, status: 'resolved' | 'dismissed') => {
    if (!resolutionNotes.trim()) {
      alert('Please provide a resolution note.');
      return;
    }
    const res = adminService.resolveReport(reportId, status, resolutionNotes.trim(), user?.full_name || 'Super Admin');
    if (res.success) {
      setNotification(`Report #${reportId} updated to ${status.toUpperCase()}!`);
      setSelectedReport(null);
      setResolutionNotes('');
      loadReports();
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const filteredReports = reports.filter((r) => {
    return statusFilter === 'all' || r.status === statusFilter;
  });

  const getStatusBadge = (status: PlatformReport['status']) => {
    switch (status) {
      case 'resolved':
        return <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'open':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Open Case</span>;
      case 'investigating':
        return <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" /> Investigating</span>;
      case 'dismissed':
        return <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[11px]">Dismissed</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Reports &amp; Dispute Resolution Desk
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Handle teacher no-shows, technical audio/video disputes, student refund appeals, and safety reports.
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>{reports.filter(r => r.status === 'open').length} Open Tickets</span>
        </span>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-1.5 text-xs">
        {(['all', 'open', 'investigating', 'resolved', 'dismissed'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
              statusFilter === st
                ? 'bg-[#0F2A43] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st === 'investigating' ? 'Investigating' : st}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 mx-auto text-[#16845B]" />
            <p className="text-sm font-bold text-[#0F2A43]">No active disputes found</p>
            <p className="text-xs">The platform is running smoothly with no unresolved user complaints.</p>
          </div>
        ) : (
          filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F2A43] text-sm">#{rep.id}</span>
                    <span className="font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded capitalize">
                      {rep.category.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {rep.subject}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Reported by: <span className="font-semibold text-slate-700">{rep.reporter_name}</span> ({rep.reporter_role}) &bull; Target: <span className="font-semibold text-slate-700">{rep.target_name}</span> ({rep.target_role})
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {getStatusBadge(rep.status)}
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {rep.description}
              </div>

              {rep.resolution_notes && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-0.5">
                  <span className="font-bold text-emerald-800 uppercase text-[10px]">Admin Resolution Note:</span>
                  <p>{rep.resolution_notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-400">
                  Logged on {new Date(rep.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>

                {rep.status === 'open' && (
                  <button
                    onClick={() => {
                      setSelectedReport(rep);
                      setResolutionNotes('');
                    }}
                    className="px-3.5 py-1.5 bg-[#0F2A43] hover:bg-[#163C5F] text-white font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Investigate &amp; Resolve
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#0F2A43]">
                Resolve Dispute #{selectedReport.id}
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF9F5] p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <p><span className="text-slate-500">Category:</span> <span className="font-bold text-[#0F2A43] capitalize">{selectedReport.category.replace('_', ' ')}</span></p>
              <p><span className="text-slate-500">Subject:</span> <span className="font-bold text-slate-800">{selectedReport.subject}</span></p>
              <p><span className="text-slate-500">Complaint:</span> <span className="text-slate-700">{selectedReport.description}</span></p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Resolution Verdict &amp; Notification to Parties
              </label>
              <textarea
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="e.g. Conducted inquiry, refunded 1 credit to student, and issued formal punctuality warning to the instructor."
                rows={3}
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => handleResolve(selectedReport.id, 'dismissed')}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl"
              >
                Dismiss Case
              </button>
              <button
                onClick={() => handleResolve(selectedReport.id, 'resolved')}
                className="px-4 py-2 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Resolved</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
