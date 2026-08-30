'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  Download, 
  User, 
  Terminal,
  Activity
} from 'lucide-react';
import { adminService } from '@/lib/admin-service';
import { AuditLog } from '@/types/admin';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(() => adminService.getAuditLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const loadLogs = () => {
    setLogs(adminService.getAuditLogs());
  };

  useEffect(() => {
    const handleSync = () => loadLogs();
    window.addEventListener('deenitutor:admin-sync', handleSync);
    return () => window.removeEventListener('deenitutor:admin-sync', handleSync);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.admin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes('APPROVED') || action.includes('DISBURSED') || action.includes('RESTORED') || action.includes('RESOLVED')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('REJECTED') || action.includes('SUSPENDED') || action.includes('DELETED') || action.includes('HIDDEN')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (action.includes('SETTINGS') || action.includes('FEATURED')) {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Security &amp; Administrative Action Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of all faculty verifications, status suspensions, payout disbursements, and system overrides.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting complete audit trail (JSON/CSV)...')}
          className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-[#0F2A43] text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by admin name, entity ID, or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-hidden"
            >
              <option value="all">All Action Types</option>
              <option value="TEACHER_STATUS_UPDATE">Teacher Status Update</option>
              <option value="PAYOUT_DISBURSED">Payout Disbursed</option>
              <option value="REVIEW_MODERATION">Review Moderation</option>
              <option value="REPORT_RESOLVED">Report Resolved</option>
              <option value="UPDATE_PLATFORM_SETTINGS">Settings Update</option>
              <option value="OVERRIDE_BOOKING_STATUS">Booking Override</option>
            </select>
          </div>

        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Admin Operator</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Description &amp; Notes</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  </td>

                  {/* Admin */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#0F2A43] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#D9A441]" />
                      {log.admin_name}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getActionBadgeColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>

                  {/* Target Entity */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-600">
                    <span className="bg-slate-100 px-1.5 py-0.2 rounded font-sans uppercase text-[10px] text-slate-500 mr-1.5">{log.entity_type}</span>
                    #{log.entity_id}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 text-slate-700 max-w-md">
                    <p className="leading-snug">{log.description}</p>
                  </td>

                  {/* IP */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {log.ip_address}
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
