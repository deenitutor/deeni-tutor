'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Calendar, 
  DollarSign, 
  FileText, 
  Check, 
  X, 
  CreditCard,
  Star,
  AlertTriangle,
  Settings,
  History,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';
import { useAuth } from '@/features/auth/AuthContext';
import { adminService } from '@/lib/admin-service';
import { reviewService } from '@/lib/review-service';

const MONTHLY_DATA = [
  { month: 'Mar', gross: 8400, commission: 1260, bookings: 420 },
  { month: 'Apr', gross: 11200, commission: 1680, bookings: 560 },
  { month: 'May', gross: 14500, commission: 2175, bookings: 710 },
  { month: 'Jun', gross: 18900, commission: 2835, bookings: 940 },
  { month: 'Jul', gross: 22400, commission: 3360, bookings: 1120 },
  { month: 'Aug', gross: 28320, commission: 4248, bookings: 1380 },
];

const SUBJECT_DISTRIBUTION = [
  { name: 'Quran Reading & Tajweed', value: 42, color: '#16845B' },
  { name: 'Arabic Grammar (Nahw/Sarf)', value: 28, color: '#0F2A43' },
  { name: 'Quranic Arabic & Tafseer', value: 16, color: '#D9A441' },
  { name: 'Arabic for Kids & Sisters', value: 14, color: '#6366F1' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(() => adminService.getPlatformMetrics());
  const [auditLogs, setAuditLogs] = useState(() => adminService.getAuditLogs().slice(0, 5));
  const [payouts, setPayouts] = useState(() => adminService.getPayouts().filter(p => p.status === 'pending'));
  const [pendingApps, setPendingApps] = useState(() =>
    adminService.getTeachers().filter(t => t.verification_status === 'under_review' || t.verification_status === 'submitted')
  );
  const [notification, setNotification] = useState('');

  const refreshData = () => {
    setMetrics(adminService.getPlatformMetrics());
    setAuditLogs(adminService.getAuditLogs().slice(0, 5));
    setPayouts(adminService.getPayouts().filter(p => p.status === 'pending'));
    setPendingApps(adminService.getTeachers().filter(t => t.verification_status === 'under_review' || t.verification_status === 'submitted'));
  };

  useEffect(() => {
    const handleSync = () => refreshData();
    window.addEventListener('deenitutor:admin-sync', handleSync);
    window.addEventListener('deenitutor:booking-sync', handleSync);
    return () => {
      window.removeEventListener('deenitutor:admin-sync', handleSync);
      window.removeEventListener('deenitutor:booking-sync', handleSync);
    };
  }, []);

  const handleQuickApprove = (teacherId: string, name: string) => {
    adminService.updateTeacherStatus(teacherId, 'approved', 'Quick approved via overview dashboard', user?.full_name || 'Super Admin');
    setNotification(`Teacher "${name}" has been approved and published!`);
    refreshData();
    setTimeout(() => setNotification(''), 4000);
  };

  const handleQuickReject = (teacherId: string, name: string) => {
    adminService.updateTeacherStatus(teacherId, 'rejected', 'Application rejected during preliminary screen', user?.full_name || 'Super Admin');
    setNotification(`Application for "${name}" was updated to rejected.`);
    refreshData();
    setTimeout(() => setNotification(''), 4000);
  };

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-[#0F2A43] text-white rounded-2xl p-6 sm:p-8 border border-[#1E3E5B] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16845B] animate-ping"></span>
            <span className="text-xs font-bold text-[#D9A441] tracking-wider uppercase">
              Operations Center • Live Global Traffic
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Platform Master Analytics &amp; Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Live overview of verified faculty, diaspora student bookings, escrow hold balances, and BEFTN/bKash teacher payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/applications"
            className="px-4 py-2.5 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Review Applications ({pendingApps.length})</span>
          </Link>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 8 Metric Cards (Blueprint Section 19) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Teachers</span>
            <GraduationCap className="w-4 h-4 text-[#0F2A43]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">{metrics.totalTeachers}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Faculty in database</span>
            <Link href="/admin/teachers" className="text-[#16845B] font-bold hover:underline">Manage &rarr;</Link>
          </div>
        </div>

        {/* Verified Teachers */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Verified Scholars</span>
            <ShieldCheck className="w-4 h-4 text-[#16845B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#16845B]">{metrics.verifiedTeachersCount}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Dawra/Sanad Approved</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">100% Active</span>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Apps</span>
            <FileText className="w-4 h-4 text-[#D9A441]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#D9A441]">{metrics.pendingApplicationsCount}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Awaiting NID/Sanad</span>
            <Link href="/admin/applications" className="text-[#D9A441] font-bold hover:underline">Review &rarr;</Link>
          </div>
        </div>

        {/* Students */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Learner Students</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">{metrics.totalStudentsCount}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>UK, US, Canada, UAE</span>
            <Link href="/admin/students" className="text-[#0F2A43] font-bold hover:underline">View &rarr;</Link>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Bookings</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">{metrics.totalBookingsCount}</p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Trial &amp; Regular lessons</span>
            <Link href="/admin/bookings" className="text-purple-700 font-bold hover:underline">Ledger &rarr;</Link>
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Volume</span>
            <DollarSign className="w-4 h-4 text-[#16845B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#16845B]">
            ${metrics.grossRevenueUsd.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Student payments (USD)</span>
            <Link href="/admin/payments" className="text-[#16845B] font-bold hover:underline">Escrow &rarr;</Link>
          </div>
        </div>

        {/* Platform Commission */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Platform Commission</span>
            <TrendingUp className="w-4 h-4 text-[#D9A441]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#D9A441]">
            ${metrics.platformCommissionUsd.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>{metrics.commissionPercentage}% platform margin</span>
            <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">Net Earned</span>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1 hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Payouts</span>
            <CreditCard className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-rose-600">
            ${metrics.pendingPayoutAmountUsd.toLocaleString()}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>{metrics.pendingPayoutsCount} requests queued</span>
            <Link href="/admin/payouts" className="text-rose-600 font-bold hover:underline">Disburse &rarr;</Link>
          </div>
        </div>

      </div>

      {/* Analytics Charts (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue & Commission Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F2A43]">
                Monthly Gross Volume &amp; Platform Revenue (USD)
              </h2>
              <p className="text-xs text-slate-500">
                Tracking monthly booking growth and platform margin (2026)
              </p>
            </div>
            <span className="text-xs font-bold text-[#16845B] bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +26.4% MoM
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16845B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#16845B" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D9A441" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#D9A441" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} tickFormatter={(val) => `$${val}`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    `$${Number(value).toLocaleString()}`, 
                    name === 'gross' ? 'Gross Booking Volume' : 'Platform Margin (15%)'
                  ]}
                  contentStyle={{ backgroundColor: '#0F2A43', color: '#fff', borderRadius: '12px', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="gross" stroke="#16845B" strokeWidth={2.5} fillOpacity={1} fill="url(#colorGross)" />
                <Area type="monotone" dataKey="commission" stroke="#D9A441" strokeWidth={2} fillOpacity={1} fill="url(#colorCommission)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-[#0F2A43]">
              Subject Demand Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Distribution of diaspora lesson bookings
            </p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SUBJECT_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {SUBJECT_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0F2A43', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-1">
            {SUBJECT_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700 truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-[#0F2A43]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Verification Queue & Payouts Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Verification Queue preview */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F2A43]">
                Application Review Queue ({pendingApps.length})
              </h2>
              <p className="text-xs text-slate-500">
                Madrasa scholars awaiting verification &amp; credentials screening
              </p>
            </div>
            <Link href="/admin/applications" className="text-xs font-bold text-[#16845B] hover:underline">
              View All &rarr;
            </Link>
          </div>

          {pendingApps.length === 0 ? (
            <div className="p-6 text-center bg-[#FAF9F5] rounded-xl border border-dashed border-slate-300">
              <Check className="w-6 h-6 text-[#16845B] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-[#0F2A43]">Queue is all cleared!</p>
              <p className="text-[11px] text-slate-400">All submitted applications have been processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingApps.slice(0, 3).map((app) => (
                <div key={app.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[#0F2A43] truncate">{app.full_name}</h4>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                        {app.verification_status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{app.madrasa_institution}</p>
                    <p className="text-[10px] text-[#16845B] font-semibold">
                      {app.subjects.slice(0, 2).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleQuickApprove(app.id, app.full_name)}
                      className="px-2.5 py-1.5 bg-[#16845B] hover:bg-[#126D4B] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Approve
                    </button>
                    <button
                      onClick={() => handleQuickReject(app.id, app.full_name)}
                      className="px-2 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold rounded-lg border border-rose-200 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Payouts Preview */}
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#0F2A43]">
                Pending Teacher Payouts ({payouts.length})
              </h2>
              <p className="text-xs text-slate-500">
                Completed lesson balances requested for Bangladesh bank/bKash withdrawal
              </p>
            </div>
            <Link href="/admin/payouts" className="text-xs font-bold text-rose-600 hover:underline">
              Process All &rarr;
            </Link>
          </div>

          {payouts.length === 0 ? (
            <div className="p-6 text-center bg-[#FAF9F5] rounded-xl border border-dashed border-slate-300">
              <Check className="w-6 h-6 text-[#16845B] mx-auto mb-1.5" />
              <p className="text-xs font-bold text-[#0F2A43]">No Pending Payouts</p>
              <p className="text-[11px] text-slate-400">All teacher withdrawals have been disbursed.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {payouts.map((po) => (
                <div key={po.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs text-[#0F2A43] truncate">{po.teacher_name}</h4>
                      <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded uppercase">
                        {po.method}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{po.account_details}</p>
                    <p className="text-[11px] font-bold text-[#16845B]">
                      ${po.amount_usd} USD &bull; ৳{po.amount_bdt.toLocaleString()} BDT
                    </p>
                  </div>

                  <Link
                    href="/admin/payouts"
                    className="px-3 py-1.5 bg-[#0F2A43] hover:bg-[#163C5F] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                  >
                    <span>Disburse</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Audit Action Log Ticker (Blueprint Section 19) */}
      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#0F2A43]" />
            <div>
              <h2 className="text-base font-bold text-[#0F2A43]">
                Recent Admin Audit Activity Logs
              </h2>
              <p className="text-xs text-slate-500">
                Security-tracked operations performed on teachers, payouts, reviews, and platform configuration
              </p>
            </div>
          </div>
          <Link href="/admin/audit-logs" className="text-xs font-bold text-[#0F2A43] hover:underline">
            View Full Audit History &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">
                  {log.action}
                </span>
                <div>
                  <p className="text-slate-800 font-medium">{log.description}</p>
                  <p className="text-[10px] text-slate-400">
                    By: <span className="font-semibold text-slate-600">{log.admin_name}</span> &bull; IP: {log.ip_address}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap sm:text-right flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
