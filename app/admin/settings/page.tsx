'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  DollarSign, 
  Clock, 
  ShieldCheck, 
  Percent, 
  Check,
  Mail,
  Phone,
  Power,
  CreditCard,
  Sliders
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { adminService } from '@/lib/admin-service';
import { PlatformSettings } from '@/types/admin';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PlatformSettings>(() => adminService.getSettings());
  const [notification, setNotification] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const handleSync = () => setSettings(adminService.getSettings());
    window.addEventListener('deenitutor:admin-sync', handleSync);
    return () => window.removeEventListener('deenitutor:admin-sync', handleSync);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    adminService.updateSettings(settings, user?.full_name || 'Super Admin');
    setIsSaved(true);
    setNotification('Platform global configuration successfully saved and applied!');
    setTimeout(() => {
      setNotification('');
      setIsSaved(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Platform Global Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure financial commissions, USD-to-BDT exchange rates, payout channels, and trial lesson rules.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Financial & Commission Settings */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <DollarSign className="w-5 h-5 text-[#16845B]" />
            <div>
              <h2 className="text-base font-bold text-[#0F2A43]">Financial &amp; Revenue Settings</h2>
              <p className="text-xs text-slate-500">Platform commissions and currency conversion for Bangladesh faculty</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Commission Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Platform Commission Fee (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  value={settings.commission_percentage}
                  onChange={(e) => setSettings({ ...settings, commission_percentage: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-3 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-bold text-[#0F2A43]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
              </div>
              <p className="text-[11px] text-slate-400">Current platform deduction on student bookings (Standard: 15%)</p>
            </div>

            {/* USD to BDT Exchange Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                USD to BDT Conversion Rate (৳ / $1 USD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="50"
                  max="200"
                  value={settings.bdt_exchange_rate}
                  onChange={(e) => setSettings({ ...settings, bdt_exchange_rate: parseFloat(e.target.value) || 0 })}
                  className="w-full text-xs p-3 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-bold text-[#16845B]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">BDT</span>
              </div>
              <p className="text-[11px] text-slate-400">Calculated on BEFTN bank transfers &amp; bKash remittances</p>
            </div>

            {/* Minimum Hourly Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Minimum Hourly Rate Floor ($USD)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="4"
                  max="50"
                  value={settings.hourly_rate_min_usd}
                  onChange={(e) => setSettings({ ...settings, hourly_rate_min_usd: parseFloat(e.target.value) || 6 })}
                  className="w-full text-xs p-3 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-bold text-[#0F2A43]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">USD</span>
              </div>
              <p className="text-[11px] text-slate-400">Minimum allowed hourly rate when teachers set pricing</p>
            </div>

            {/* Auto-Cancel Unconfirmed Hours */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Auto-Cancel Unconfirmed Requests (Hours)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="6"
                  max="72"
                  value={settings.auto_cancel_unconfirmed_hours}
                  onChange={(e) => setSettings({ ...settings, auto_cancel_unconfirmed_hours: parseInt(e.target.value) || 24 })}
                  className="w-full text-xs p-3 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-bold text-[#0F2A43]"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Hours</span>
              </div>
              <p className="text-[11px] text-slate-400">Automatic release and refund window if teacher doesn&apos;t confirm</p>
            </div>

          </div>
        </div>

        {/* Trial Lessons & Booking Controls */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <Clock className="w-5 h-5 text-[#D9A441]" />
            <div>
              <h2 className="text-base font-bold text-[#0F2A43]">Trial Lessons &amp; Booking Rules</h2>
              <p className="text-xs text-slate-500">Manage low-friction introduction lessons for new diaspora families</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Trial Lesson Duration (Minutes)
              </label>
              <input
                type="number"
                min="15"
                max="60"
                step="5"
                value={settings.trial_lesson_default_duration_min}
                onChange={(e) => setSettings({ ...settings, trial_lesson_default_duration_min: parseInt(e.target.value) || 30 })}
                className="w-full text-xs p-3 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Trial Lesson Minimum Price ($USD)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                step="0.5"
                value={settings.trial_lesson_min_price_usd}
                onChange={(e) => setSettings({ ...settings, trial_lesson_min_price_usd: parseFloat(e.target.value) || 3 })}
                className="w-full text-xs p-3 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-bold"
              />
            </div>

          </div>
        </div>

        {/* Payout Channels & Support Contacts */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <CreditCard className="w-5 h-5 text-[#0F2A43]" />
            <div>
              <h2 className="text-base font-bold text-[#0F2A43]">Payment Channels &amp; Support Configuration</h2>
              <p className="text-xs text-slate-500">Enable/disable disbursement methods and update support information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100">
            
            <label className="flex items-center justify-between p-4 bg-[#FAF9F5] border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-xs font-bold text-[#0F2A43]">bKash Merchant Payouts</p>
                <p className="text-[11px] text-slate-400">Direct mobile wallet transfer</p>
              </div>
              <input
                type="checkbox"
                checked={settings.bkash_payout_enabled}
                onChange={(e) => setSettings({ ...settings, bkash_payout_enabled: e.target.checked })}
                className="w-4 h-4 text-[#16845B] rounded focus:ring-[#16845B]"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-[#FAF9F5] border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-xs font-bold text-[#0F2A43]">Nagad Disbursements</p>
                <p className="text-[11px] text-slate-400">Postal financial service</p>
              </div>
              <input
                type="checkbox"
                checked={settings.nagad_payout_enabled}
                onChange={(e) => setSettings({ ...settings, nagad_payout_enabled: e.target.checked })}
                className="w-4 h-4 text-[#16845B] rounded focus:ring-[#16845B]"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-[#FAF9F5] border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-xs font-bold text-[#0F2A43]">BEFTN Bank Routing</p>
                <p className="text-[11px] text-slate-400">All 50+ Bangladesh banks</p>
              </div>
              <input
                type="checkbox"
                checked={settings.bank_beftn_enabled}
                onChange={(e) => setSettings({ ...settings, bank_beftn_enabled: e.target.checked })}
                className="w-4 h-4 text-[#16845B] rounded focus:ring-[#16845B]"
              />
            </label>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Support Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={settings.support_email}
                  onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Support WhatsApp (BD / UK / US)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.support_whatsapp}
                  onChange={(e) => setSettings({ ...settings, support_whatsapp: e.target.value })}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Apply Live Platform Configuration</span>
          </button>
        </div>

      </form>

    </div>
  );
}
