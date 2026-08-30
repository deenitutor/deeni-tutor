'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, CheckCircle2, MessageSquare, Clock, Globe } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8F5EF] border border-[#16845B]/20">
            <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider">
              We&apos;re Here to Help
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2A43]">
            Contact Deeni Tutor Support
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Have questions about finding a teacher, booking a trial lesson, or applying as an Arabic educator? Reach out to our dedicated team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Info Card */}
          <div className="lg:col-span-1 space-y-6 bg-[#0F2A43] text-white p-8 rounded-xl shadow-xs border border-[#1E3E5B]">
            <div>
              <span className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">Direct Reach</span>
              <h2 className="text-xl font-bold text-white mt-1">Get in Touch</h2>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Our support team responds to all inquiries within 12 hours.
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-200">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Email Us:</span>
                  <a href="mailto:support@deenitutor.com" className="hover:underline text-slate-300">
                    support@deenitutor.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Office Hours:</span>
                  <span>7 Days a week (9:00 AM – 11:00 PM Asia/Dhaka)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Location:</span>
                  <span>Dhanmondi, Dhaka-1205, Bangladesh</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">Global Communities:</span>
                  <span>UK, USA, Canada, UAE, Australia, Malaysia</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#163C5F]/60 border border-[#163C5F] text-xs space-y-1">
              <span className="font-bold text-[#D9A441] block">Looking to teach?</span>
              <p className="text-slate-300">
                You can start your madrasa teacher application online in just 5 minutes.
              </p>
              <Link href="/signup?role=teacher" className="text-[#D9A441] font-bold hover:underline inline-block pt-1">
                Apply to Teach →
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 sm:p-10 rounded-xl border border-[#E2E8F0] shadow-xs">
            {submitted ? (
              <div className="p-10 text-center space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#E8F5EF] text-[#16845B] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-[#0F2A43]">Message Received!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Jazakallah Khair for reaching out. One of our student advisors will review your message and respond to <span className="font-bold text-[#0F2A43]">{formData.email}</span> within a few hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General Question', message: '' }); }}
                  className="px-4 py-2 bg-[#0F2A43] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-[#0F2A43]">
                  Send a Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Farhan Chowdhury"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Teacher Verification">Teacher Verification &amp; Application</option>
                    <option value="Trial Lesson Help">Trial Lesson Booking Inquiry</option>
                    <option value="Payment / Refund">Payment / Refund Assistance</option>
                    <option value="Parent Multiple Children">Parent Account Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-lg text-xs sm:text-sm text-[#0F2A43] focus:outline-none focus:ring-1 focus:ring-[#16845B] focus:border-[#16845B]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
