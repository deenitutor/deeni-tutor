'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, HelpCircle, ArrowRight } from 'lucide-react';
import { FAQS } from '@/lib/mock-data';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ '0-0': true });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E8F5EF] border border-[#16845B]/20">
            <div className="w-1.5 h-1.5 bg-[#D9A441] rotate-45"></div>
            <span className="text-xs font-bold text-[#16845B] uppercase tracking-wider">
              Knowledge Base
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0F2A43]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Find answers regarding teacher verification, trial lessons, pricing, and scheduling.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex justify-center gap-2 flex-wrap">
          {FAQS.map((category, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(idx)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === idx
                  ? 'bg-[#0F2A43] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-[#E2E8F0] hover:bg-[#FAF9F5]'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS[activeCategory].questions.map((faq, index) => {
            const key = `${activeCategory}-${index}`;
            const isOpen = Boolean(openItems[key]);
            return (
              <div
                key={index}
                className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleItem(key)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-[#0F2A43] hover:text-[#16845B] transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#16845B]' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#E2E8F0] text-center space-y-3 shadow-xs">
          <HelpCircle className="w-8 h-8 text-[#16845B] mx-auto" />
          <h3 className="text-base sm:text-lg font-bold text-[#0F2A43]">Have questions not listed here?</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Our support team is available 24/7 to assist students, parents, and teachers with scheduling and setup.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <span>Contact Deeni Tutor Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
