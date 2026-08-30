'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Building2, 
  Smartphone, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { adminService } from '@/lib/admin-service';
import { PayoutRequest } from '@/types/admin';

export default function AdminPayoutsPage() {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<PayoutRequest[]>(() => adminService.getPayouts());
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);
  const [txReference, setTxReference] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'rejected'>('all');
  const [notification, setNotification] = useState('');

  const loadPayouts = () => {
    setPayouts(adminService.getPayouts());
  };

  useEffect(() => {
    const handleSync = () => loadPayouts();
    window.addEventListener('deenitutor:admin-sync', handleSync);
    return () => window.removeEventListener('deenitutor:admin-sync', handleSync);
  }, []);

  const handleProcessPayout = (payoutId: string) => {
    if (!txReference.trim()) {
      alert('Please provide a bank transaction reference or bKash TrxID.');
      return;
    }
    const res = adminService.processPayout(payoutId, txReference.trim(), user?.full_name || 'Super Admin');
    if (res.success) {
      setNotification(`Payout #${payoutId} has been marked as disbursed via BEFTN/MFS!`);
      setSelectedPayout(null);
      setTxReference('');
      loadPayouts();
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleRejectPayout = (payoutId: string) => {
    if (!rejectReason.trim()) {
      alert('Please specify the reason for payout rejection (e.g. invalid bank routing number).');
      return;
    }
    const res = adminService.rejectPayout(payoutId, rejectReason.trim(), user?.full_name || 'Super Admin');
    if (res.success) {
      setNotification(`Payout #${payoutId} has been rejected.`);
      setSelectedPayout(null);
      setRejectReason('');
      loadPayouts();
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const filteredPayouts = payouts.filter((p) => {
    return statusFilter === 'all' || p.status === statusFilter;
  });

  const pendingTotalUsd = payouts.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount_usd, 0);
  const completedTotalUsd = payouts.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount_usd, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Bangladesh Teacher Payouts (BEFTN &amp; bKash)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process scheduled earnings disbursements to verified Madrasa teachers in Bangladesh (1 USD = ৳120 BDT).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-[#0F2A43] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs">
            <Clock className="w-4 h-4 text-[#D9A441]" />
            <span>${pendingTotalUsd} USD Pending</span>
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Pending Requests</span>
            <Clock className="w-4 h-4 text-[#D9A441]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">
            ${pendingTotalUsd} USD <span className="text-sm font-semibold text-slate-500">(৳{(pendingTotalUsd * 120).toLocaleString()} BDT)</span>
          </p>
          <p className="text-[11px] text-slate-400">Scheduled for Friday BEFTN bank batch</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Disbursed All-Time</span>
            <CheckCircle2 className="w-4 h-4 text-[#16845B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#16845B]">
            ${completedTotalUsd + 18500} USD <span className="text-sm font-semibold text-slate-500">(৳{((completedTotalUsd + 18500) * 120).toLocaleString()} BDT)</span>
          </p>
          <p className="text-[11px] text-slate-400">Successfully remitted to Bangladesh</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-1.5 text-xs">
        {(['all', 'pending', 'completed', 'rejected'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-lg font-bold capitalize transition-colors cursor-pointer ${
              statusFilter === st
                ? 'bg-[#0F2A43] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Payouts Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Payout ID &amp; Teacher</th>
                <th className="py-3 px-4">Method &amp; Account</th>
                <th className="py-3 px-4">Amount (USD &amp; BDT)</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayouts.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* ID & Teacher */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#0F2A43]">{po.id}</span>
                      <p className="font-semibold text-slate-800 text-sm">{po.teacher_name}</p>
                    </div>
                  </td>

                  {/* Method & Details */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 max-w-xs">
                      <span className="bg-slate-100 text-[#0F2A43] font-bold px-2 py-0.5 rounded uppercase text-[10px] inline-flex items-center gap-1">
                        {po.method === 'bank' ? <Building2 className="w-3 h-3 text-[#16845B]" /> : <Smartphone className="w-3 h-3 text-rose-500" />}
                        {po.method}
                      </span>
                      <p className="text-[11px] text-slate-600 font-mono">{po.account_details}</p>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <p className="font-bold text-[#16845B] text-sm">${po.amount_usd} USD</p>
                    <p className="text-[11px] font-bold text-slate-700">৳{po.amount_bdt.toLocaleString()} BDT</p>
                  </td>

                  {/* Requested Date */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(po.requested_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {po.status === 'completed' && (
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Disbursed
                      </span>
                    )}
                    {po.status === 'pending' && (
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Pending Batch
                      </span>
                    )}
                    {po.status === 'rejected' && (
                      <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                        <X className="w-3 h-3" /> Rejected
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {po.status === 'pending' ? (
                      <button
                        onClick={() => {
                          setSelectedPayout(po);
                          setTxReference(`BEFTN-${Date.now().toString().slice(-6)}`);
                        }}
                        className="px-3 py-1 bg-[#16845B] hover:bg-[#126D4B] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Process Payout
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {po.transaction_reference || 'Completed'}
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Process Payout Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#0F2A43]">
                Disburse Payout #{selectedPayout.id}
              </h3>
              <button
                onClick={() => setSelectedPayout(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p><span className="text-slate-500">Teacher:</span> <span className="font-bold text-[#0F2A43]">{selectedPayout.teacher_name}</span></p>
              <p><span className="text-slate-500">Disbursement:</span> <span className="font-bold text-[#16845B]">${selectedPayout.amount_usd} USD &bull; ৳{selectedPayout.amount_bdt.toLocaleString()} BDT</span></p>
              <p><span className="text-slate-500">Bank / MFS details:</span> <span className="font-semibold text-slate-800">{selectedPayout.account_details}</span></p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bank / bKash Transaction Reference ID
              </label>
              <input
                type="text"
                value={txReference}
                onChange={(e) => setTxReference(e.target.value)}
                placeholder="e.g. BEFTN-928472 or TrxID-9KB10"
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleRejectPayout(selectedPayout.id)}
                className="px-3.5 py-2 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors"
              >
                Reject Request
              </button>
              <button
                onClick={() => handleProcessPayout(selectedPayout.id)}
                className="px-5 py-2 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm &amp; Mark Disbursed</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
