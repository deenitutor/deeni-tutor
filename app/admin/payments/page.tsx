'use client';

import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  Filter, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ShieldCheck,
  TrendingUp,
  Download,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Payment } from '@/types/booking';

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay-001',
    booking_id: 'bk-101',
    student_id: 'std-001',
    teacher_id: 'tch-001',
    provider: 'stripe',
    provider_transaction_id: 'pi_3MtwBwLkdIwHu7ix0snM1V8Y',
    gross_amount: 10.00,
    platform_fee: 1.50,
    teacher_amount: 8.50,
    currency: 'USD',
    status: 'succeeded',
    paid_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pay-002',
    booking_id: 'bk-102',
    student_id: 'std-001',
    teacher_id: 'tch-002',
    provider: 'stripe',
    provider_transaction_id: 'pi_3MtwKkLkdIwHu7ix0plQ9B2A',
    gross_amount: 4.00,
    platform_fee: 0.60,
    teacher_amount: 3.40,
    currency: 'USD',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pay-003',
    booking_id: 'bk-099',
    student_id: 'std-001',
    teacher_id: 'tch-001',
    provider: 'stripe',
    provider_transaction_id: 'pi_3MtgAALkdIwHu7ix0zzK4X7P',
    gross_amount: 10.00,
    platform_fee: 1.50,
    teacher_amount: 8.50,
    currency: 'USD',
    status: 'succeeded',
    paid_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pay-004',
    booking_id: 'bk-088',
    student_id: 'std-002',
    teacher_id: 'tch-001',
    provider: 'stripe',
    provider_transaction_id: 'pi_3Mtx78LkdIwHu7ix0mmT1L9C',
    gross_amount: 12.00,
    platform_fee: 1.80,
    teacher_amount: 10.20,
    currency: 'USD',
    status: 'succeeded',
    paid_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pay-005',
    booking_id: 'bk-077',
    student_id: 'std-003',
    teacher_id: 'tch-002',
    provider: 'stripe',
    provider_transaction_id: 'pi_3Mtq45LkdIwHu7ix0rrJ7E4V',
    gross_amount: 9.00,
    platform_fee: 1.35,
    teacher_amount: 7.65,
    currency: 'USD',
    status: 'succeeded',
    paid_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'succeeded' | 'pending' | 'refunded'>('all');

  const totalGross = payments.reduce((acc, p) => acc + p.gross_amount, 0) + 24500;
  const totalCommission = payments.reduce((acc, p) => acc + p.platform_fee, 0) + 3675;
  const totalEscrow = payments.filter(p => p.status === 'succeeded').reduce((acc, p) => acc + p.teacher_amount, 0) + 20825;

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.booking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.provider_transaction_id && p.provider_transaction_id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Payments, Escrow &amp; Commission Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            15% platform fee split with Stripe international processing and Bangladesh teacher escrow holdings.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting platform financial ledger CSV...')}
          className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-[#0F2A43] text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Volume (USD)</span>
            <DollarSign className="w-4 h-4 text-[#16845B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">${totalGross.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Total payments processed by Stripe</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">15% Platform Margin</span>
            <TrendingUp className="w-4 h-4 text-[#D9A441]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#D9A441]">${totalCommission.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Deeni Tutor net revenue</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Escrow / Faculty Share</span>
            <Lock className="w-4 h-4 text-[#0F2A43]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#0F2A43]">${totalEscrow.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">85% allocated to verified teachers</p>
        </div>
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
              placeholder="Search by payment ID (#pay-...), booking ID, or Stripe Tx ID..."
              className="w-full pl-9 pr-4 py-2 bg-[#FAF9F5] border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'succeeded', 'pending', 'refunded'] as const).map((st) => (
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

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF9F5] border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID &amp; Booking</th>
                <th className="py-3 px-4">Gateway</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Platform Fee (15%)</th>
                <th className="py-3 px-4">Teacher Share (85%)</th>
                <th className="py-3 px-4">Paid Date</th>
                <th className="py-3 px-4 text-right">Escrow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  
                  {/* Tx & Booking */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#0F2A43]">{p.id}</span>
                      <p className="text-[10px] text-slate-400 font-mono">Booking: #{p.booking_id}</p>
                      {p.provider_transaction_id && (
                        <p className="text-[9px] text-slate-400 truncate max-w-xs font-mono">{p.provider_transaction_id}</p>
                      )}
                    </div>
                  </td>

                  {/* Gateway */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold uppercase text-[10px]">
                      {p.provider}
                    </span>
                  </td>

                  {/* Gross */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#0F2A43]">
                    ${p.gross_amount.toFixed(2)} USD
                  </td>

                  {/* Platform fee */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#D9A441]">
                    +${p.platform_fee.toFixed(2)}
                  </td>

                  {/* Teacher share */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-[#16845B]">
                    ${p.teacher_amount.toFixed(2)}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                    {p.paid_at ? new Date(p.paid_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
                  </td>

                  {/* Escrow Status */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {p.status === 'succeeded' ? (
                      <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Settled / Paid
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Escrow Hold
                      </span>
                    )}
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
