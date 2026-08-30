'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  FileText, 
  Check, 
  X, 
  Eye, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  Calendar, 
  GraduationCap, 
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { adminService } from '@/lib/admin-service';
import { TeacherProfile } from '@/types/teacher';

export default function AdminApplicationsPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => adminService.getTeachers());
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [notification, setNotification] = useState('');
  const [docModalUrl, setDocModalUrl] = useState<{ title: string; url: string } | null>(null);

  const loadData = () => {
    const list = adminService.getTeachers();
    setTeachers(list);
  };

  useEffect(() => {
    const handleSync = () => loadData();
    window.addEventListener('deenitutor:admin-sync', handleSync);
    return () => window.removeEventListener('deenitutor:admin-sync', handleSync);
  }, []);

  const pendingTeachers = teachers.filter(
    t => t.verification_status === 'under_review' || t.verification_status === 'submitted'
  );

  const handleApprove = (teacherId: string, name: string) => {
    const res = adminService.updateTeacherStatus(
      teacherId, 
      'approved', 
      reviewerNotes || 'Verified authentic Dawra-e-Hadith credentials, NID identity, and passed oral interview.',
      user?.full_name || 'Super Admin'
    );
    if (res.success) {
      setNotification(`Mawlana/Ustadha "${name}" has been approved and is now live on the public directory!`);
      setSelectedTeacher(null);
      setReviewerNotes('');
      loadData();
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleReject = (teacherId: string, name: string) => {
    const res = adminService.updateTeacherStatus(
      teacherId, 
      'rejected', 
      reviewerNotes || 'Insufficient or unverified credentials.',
      user?.full_name || 'Super Admin'
    );
    if (res.success) {
      setNotification(`Application for "${name}" has been rejected.`);
      setSelectedTeacher(null);
      setReviewerNotes('');
      loadData();
      setTimeout(() => setNotification(''), 5000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9A441]"></span>
            <span className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
              Verification Desk
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F2A43]">
            Madrasa Teacher Applications Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            4-step verification: Government NID, Dawra-e-Hadith/Takmeel Sanad, Tajweed Ijazah, and spoken Arabic/English aptitude.
          </p>
        </div>

        <span className="px-3 py-1.5 bg-amber-100 text-amber-900 font-bold text-xs rounded-xl self-start sm:self-auto flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-700" />
          <span>{pendingTeachers.length} Applications Waiting</span>
        </span>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main List & Review Panel */}
      {pendingTeachers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-[#16845B] rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#0F2A43]">All Applications Verified!</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            There are currently no new teacher applications pending review. As soon as a madrasa graduate applies, their portfolio will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Applications list (Left 1 col) */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Candidates ({pendingTeachers.length})
            </h3>

            <div className="space-y-3">
              {pendingTeachers.map((t) => {
                const isSelected = selectedTeacher?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSelectedTeacher(t);
                      setReviewerNotes('');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected 
                        ? 'bg-[#0F2A43] text-white border-[#0F2A43] shadow-md' 
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
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
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#0F2A43]'}`}>
                          {t.full_name}
                        </h4>
                        <p className={`text-[11px] truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {t.madrasa_institution}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-100/20">
                      <span className={isSelected ? 'text-amber-300 font-semibold' : 'text-[#16845B] font-semibold'}>
                        {t.subjects[0] || 'Islamic Studies'}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.verification_status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Verification Workspace (Right 2 cols) */}
          <div className="lg:col-span-2">
            {selectedTeacher ? (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
                
                {/* Candidate Overview */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-slate-200 shadow-xs">
                      <Image
                        src={selectedTeacher.photo_url}
                        alt={selectedTeacher.full_name}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-[#0F2A43]">
                        {selectedTeacher.full_name}
                      </h2>
                      <p className="text-xs text-[#16845B] font-semibold">
                        {selectedTeacher.madrasa_institution} &bull; {selectedTeacher.city}, {selectedTeacher.country}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedTeacher.title}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-bold text-[#16845B]">
                      ${selectedTeacher.hourly_rate}/hr
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Trial: ${selectedTeacher.trial_rate ?? 4} (30m)
                    </p>
                  </div>
                </div>

                {/* Qualifications & Bio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#FAF9F5] p-4 rounded-xl space-y-2 border border-slate-200">
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#16845B]" />
                      Declared Qualifications &amp; Sanad
                    </h4>
                    <ul className="space-y-1 text-slate-700 list-disc pl-4">
                      {selectedTeacher.qualifications.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#FAF9F5] p-4 rounded-xl space-y-2 border border-slate-200">
                    <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Teaching Languages &amp; Subjects
                    </h4>
                    <div className="space-y-1 text-slate-700">
                      <p><span className="font-semibold">Languages:</span> {selectedTeacher.teaching_languages.join(', ')}</p>
                      <p><span className="font-semibold">Subjects:</span> {selectedTeacher.subjects.join(', ')}</p>
                      <p><span className="font-semibold">Experience:</span> {selectedTeacher.years_of_experience} years</p>
                    </div>
                  </div>
                </div>

                {/* Submitted Documents Section (NID, Certificates) */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-[#0F2A43] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#16845B]" />
                    Uploaded Verification Documents ({selectedTeacher.documents?.length ?? 0})
                  </h4>

                  {!selectedTeacher.documents || selectedTeacher.documents.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No document attachments uploaded.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedTeacher.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="w-4 h-4 text-[#16845B] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-[#0F2A43] truncate">{doc.title}</p>
                              <p className="text-[10px] text-slate-400 truncate">{doc.file_name || 'certificate.pdf'}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => setDocModalUrl({ title: doc.title, url: doc.file_url })}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reviewer Notes & Action Buttons */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Admin Audit Verification Notes &amp; Interview Checklist
                    </label>
                    <textarea
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      placeholder="e.g. Verified with Madrasa registrar, confirmed Hafs Tajweed sanad, and conducted 10m spoken English interview via Google Meet."
                      rows={3}
                      className="w-full text-xs p-3 bg-[#FAF9F5] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#16845B] focus:border-transparent outline-hidden"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleReject(selectedTeacher.id, selectedTeacher.full_name)}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>

                    <button
                      onClick={() => handleApprove(selectedTeacher.id, selectedTeacher.full_name)}
                      className="px-5 py-2.5 bg-[#16845B] hover:bg-[#126D4B] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve &amp; Publish Scholar Live</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs text-slate-400 space-y-2">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-sm font-bold text-[#0F2A43]">Select a candidate to review</p>
                <p className="text-xs">Click on any candidate from the queue on the left to inspect documents and take action.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Document Viewer Modal */}
      {docModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#0F2A43]">{docModalUrl.title}</h3>
              <button
                onClick={() => setDocModalUrl(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-80 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={docModalUrl.url}
                alt={docModalUrl.title}
                fill
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-500">Document certified on file</span>
              <button
                onClick={() => setDocModalUrl(null)}
                className="px-4 py-2 bg-[#0F2A43] text-white text-xs font-bold rounded-xl"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
