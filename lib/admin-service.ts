import { 
  AuditLog, 
  AuditActionType, 
  PayoutRequest, 
  PlatformReport, 
  PlatformSettings, 
  AdminStudentSummary 
} from '@/types/admin';
import { TeacherProfile } from '@/types/teacher';
import { MOCK_TEACHERS } from './mock-data';
import { bookingService } from './booking-service';
import { notificationService } from './notification-service';

const STORAGE_KEY_AUDIT_LOGS = 'deenitutor_audit_logs_v1';
const STORAGE_KEY_PAYOUTS = 'deenitutor_payouts_v1';
const STORAGE_KEY_REPORTS = 'deenitutor_reports_v1';
const STORAGE_KEY_SETTINGS = 'deenitutor_settings_v1';
const STORAGE_KEY_TEACHERS = 'deenitutor_teachers_admin_v1';
const STORAGE_KEY_STUDENTS = 'deenitutor_students_admin_v1';

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    admin_id: 'adm-301',
    admin_name: 'Deeni Tutor SuperAdmin',
    action: 'APPROVE_TEACHER',
    entity_type: 'teacher',
    entity_id: 'tch-001',
    description: 'Approved Mawlana Abdullah Al-Mahmud profile after Hathazari Takmeel certificate verification & oral interview.',
    ip_address: '103.114.98.12',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'aud-002',
    admin_id: 'adm-301',
    admin_name: 'Deeni Tutor SuperAdmin',
    action: 'PROCESS_PAYOUT',
    entity_type: 'payout',
    entity_id: 'po-101',
    description: 'Processed BEFTN Bank Payout of $450.00 USD (৳54,000 BDT) to Islami Bank BD.',
    ip_address: '103.114.98.12',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'aud-003',
    admin_id: 'adm-301',
    admin_name: 'Deeni Tutor SuperAdmin',
    action: 'UPDATE_PLATFORM_SETTINGS',
    entity_type: 'settings',
    entity_id: 'settings-root',
    description: 'Updated exchange rate to 1 USD = 120 BDT and confirmed 15% platform commission.',
    ip_address: '103.114.98.12',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_PAYOUTS: PayoutRequest[] = [
  {
    id: 'po-101',
    teacher_id: 'tch-001',
    teacher_name: 'Mawlana Abdullah Al-Mahmud',
    teacher_madrasa: 'Darul Uloom Hathazari',
    amount_usd: 450.00,
    amount_bdt: 54000,
    method: 'bank',
    account_details: 'Islami Bank Bangladesh Ltd (A/C: 205012345678901)',
    status: 'completed',
    requested_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    processed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    transaction_reference: 'BEFTN-IBBL-984321',
    admin_notes: 'Verified against completed lesson ledger.'
  },
  {
    id: 'po-102',
    teacher_id: 'tch-002',
    teacher_name: 'Ustadha Fatima Jannat',
    teacher_madrasa: 'Jamia Islamia Mahila Madrasa Sylhet',
    amount_usd: 180.00,
    amount_bdt: 21600,
    method: 'bkash',
    account_details: 'bKash Personal: 01712-345678',
    status: 'pending',
    requested_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    admin_notes: 'Awaiting daily batch bKash disbursement.'
  },
  {
    id: 'po-103',
    teacher_id: 'tch-003',
    teacher_name: 'Qari Muhammad Hasan',
    teacher_madrasa: 'Jamia Darul Maarif Al-Islamia Chittagong',
    amount_usd: 320.00,
    amount_bdt: 38400,
    method: 'bank',
    account_details: 'Al-Arafah Islami Bank (A/C: 102048932)',
    status: 'pending',
    requested_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_REPORTS: PlatformReport[] = [
  {
    id: 'rep-01',
    reporter_id: 'std-101',
    reporter_name: 'Tariq Rahman (UK)',
    reporter_role: 'student',
    target_id: 'tch-006',
    target_name: 'Mawlana Saidur Rahman',
    target_role: 'teacher',
    category: 'technical_issue',
    subject: 'Minor Google Meet echo during first 5 mins',
    description: 'During our trial lesson there was audio echo from the teacher mic. Ustadh quickly switched headsets and resolved it, but wanted to let support know.',
    status: 'resolved',
    resolution_notes: 'Contacted teacher to ensure wired noise-cancelling headset is used for all lessons.',
    resolved_by: 'Deeni Tutor Admin',
    resolved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rep-02',
    reporter_id: 'tch-001',
    reporter_name: 'Mawlana Abdullah',
    reporter_role: 'teacher',
    target_id: 'bk-102',
    target_name: 'Booking #bk-102',
    target_role: 'booking',
    category: 'other',
    subject: 'Student requested rescheduled time slot via WhatsApp',
    description: 'Student Tariq requested to move lesson by 30 minutes due to London traffic. Handled smoothly.',
    status: 'open',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_SETTINGS: PlatformSettings = {
  platform_name: 'Deeni Tutor',
  commission_percentage: 15,
  trial_lesson_default_duration_min: 30,
  trial_lesson_min_price_usd: 3,
  hourly_rate_min_usd: 6,
  currency: 'USD',
  bdt_exchange_rate: 120,
  bkash_payout_enabled: true,
  nagad_payout_enabled: true,
  bank_beftn_enabled: true,
  maintenance_mode: false,
  support_email: 'support@deenitutor.com',
  support_whatsapp: '+880 1700-000000',
  auto_cancel_unconfirmed_hours: 24,
};

const INITIAL_STUDENTS: AdminStudentSummary[] = [
  {
    id: 'std-101',
    full_name: 'Tariq Rahman',
    email: 'tariq.rahman@example.co.uk',
    country: 'United Kingdom (London)',
    timezone: 'Europe/London',
    total_bookings: 5,
    total_spent_usd: 48.00,
    status: 'active',
    created_at: '2026-01-15',
  },
  {
    id: 'std-102',
    full_name: 'Dr. Sarah Ahmad',
    email: 'sarah.ahmad@clinic.ca',
    country: 'Canada (Toronto)',
    timezone: 'America/Toronto',
    total_bookings: 12,
    total_spent_usd: 120.00,
    status: 'active',
    created_at: '2026-01-20',
  },
  {
    id: 'std-103',
    full_name: 'Farhan & Ayesha Chowdhury',
    email: 'farhan.parent@example.com',
    country: 'United States (Texas)',
    timezone: 'America/Chicago',
    total_bookings: 8,
    total_spent_usd: 80.00,
    status: 'active',
    created_at: '2026-02-01',
  },
  {
    id: 'std-104',
    full_name: 'Rashid Al-Mansoor',
    email: 'rashid.mansoor@dubaimedia.ae',
    country: 'United Arab Emirates (Dubai)',
    timezone: 'Asia/Dubai',
    total_bookings: 15,
    total_spent_usd: 180.00,
    status: 'active',
    created_at: '2025-12-10',
  },
  {
    id: 'std-105',
    full_name: 'Sultana Begum',
    email: 'sultana.begum@btinternet.com',
    country: 'United Kingdom (Birmingham)',
    timezone: 'Europe/London',
    total_bookings: 6,
    total_spent_usd: 54.00,
    status: 'active',
    created_at: '2026-02-10',
  }
];

class AdminManager {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // -------------------------------------------------------------
  // AUDIT LOGS
  // -------------------------------------------------------------
  public getAuditLogs(): AuditLog[] {
    if (!this.isBrowser()) return INITIAL_AUDIT_LOGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUDIT_LOGS);
      if (stored) return JSON.parse(stored);
      this.saveAuditLogs(INITIAL_AUDIT_LOGS);
      return INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  }

  private saveAuditLogs(logs: AuditLog[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT_LOGS, JSON.stringify(logs));
      window.dispatchEvent(new CustomEvent('deenitutor:admin-sync'));
    } catch (err) {
      console.error('Failed to save audit logs', err);
    }
  }

  public logAction(params: {
    admin_id?: string;
    admin_name?: string;
    action: AuditActionType;
    entity_type: AuditLog['entity_type'];
    entity_id: string;
    description: string;
    metadata?: Record<string, unknown>;
  }) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      admin_id: params.admin_id || 'adm-301',
      admin_name: params.admin_name || 'Super Admin',
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      description: params.description,
      metadata: params.metadata,
      ip_address: '103.114.98.12 (Dhaka, BD)',
      created_at: new Date().toISOString()
    };
    this.saveAuditLogs([newLog, ...logs]);
    return newLog;
  }

  // -------------------------------------------------------------
  // TEACHERS & APPLICATIONS
  // -------------------------------------------------------------
  public getTeachers(): TeacherProfile[] {
    if (!this.isBrowser()) return MOCK_TEACHERS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TEACHERS);
      if (stored) return JSON.parse(stored);
      this.saveTeachers(MOCK_TEACHERS);
      return MOCK_TEACHERS;
    } catch {
      return MOCK_TEACHERS;
    }
  }

  public saveTeachers(teachers: TeacherProfile[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_TEACHERS, JSON.stringify(teachers));
      window.dispatchEvent(new CustomEvent('deenitutor:admin-sync'));
    } catch (err) {
      console.error('Failed to save teachers', err);
    }
  }

  public updateTeacherStatus(
    teacherId: string, 
    status: TeacherProfile['verification_status'], 
    notes?: string,
    adminName: string = 'Super Admin'
  ) {
    const teachers = this.getTeachers();
    const index = teachers.findIndex(t => t.id === teacherId);
    if (index === -1) return { success: false, error: 'Teacher not found' };

    const teacher = teachers[index];
    const isApproved = status === 'approved';

    teachers[index] = {
      ...teacher,
      verification_status: status,
      is_approved: isApproved,
      is_verified: isApproved,
    };

    this.saveTeachers(teachers);

    // Audit log
    const actionType: AuditActionType = status === 'approved' 
      ? 'APPROVE_TEACHER' 
      : status === 'rejected' 
      ? 'REJECT_TEACHER' 
      : status === 'suspended' 
      ? 'SUSPEND_TEACHER' 
      : 'ACTIVATE_TEACHER';

    this.logAction({
      admin_name: adminName,
      action: actionType,
      entity_type: 'teacher',
      entity_id: teacherId,
      description: `${actionType}: ${teacher.full_name} (${teacher.madrasa_institution}). Notes: ${notes || 'Updated via Admin verification console.'}`
    });

    // Notify teacher
    notificationService.notify({
      recipient_id: teacherId,
      recipient_role: 'teacher',
      type: status === 'approved' ? 'teacher_approved' : 'teacher_rejected',
      title: status === 'approved' ? 'Application Approved! You are now live' : `Account Status Update: ${status}`,
      message: status === 'approved' 
        ? 'Your Dawra-e-Hadith credentials have been verified. Students worldwide can now view and book your lessons.'
        : `Your teacher account status has been updated to "${status}". Reason: ${notes || 'Contact support for details.'}`,
      link: '/teacher/dashboard'
    });

    return { success: true, teacher: teachers[index] };
  }

  public toggleTeacherFeatured(teacherId: string, adminName: string = 'Super Admin') {
    const teachers = this.getTeachers();
    const index = teachers.findIndex(t => t.id === teacherId);
    if (index === -1) return { success: false };

    teachers[index].featured = !teachers[index].featured;
    this.saveTeachers(teachers);

    this.logAction({
      admin_name: adminName,
      action: 'TOGGLE_FEATURED_TEACHER',
      entity_type: 'teacher',
      entity_id: teacherId,
      description: `Toggled featured status for ${teachers[index].full_name} to ${teachers[index].featured ? 'FEATURED' : 'STANDARD'}`
    });

    return { success: true, isFeatured: teachers[index].featured };
  }

  // -------------------------------------------------------------
  // PAYOUTS
  // -------------------------------------------------------------
  public getPayouts(): PayoutRequest[] {
    if (!this.isBrowser()) return INITIAL_PAYOUTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PAYOUTS);
      if (stored) return JSON.parse(stored);
      this.savePayouts(INITIAL_PAYOUTS);
      return INITIAL_PAYOUTS;
    } catch {
      return INITIAL_PAYOUTS;
    }
  }

  public savePayouts(payouts: PayoutRequest[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_PAYOUTS, JSON.stringify(payouts));
      window.dispatchEvent(new CustomEvent('deenitutor:admin-sync'));
    } catch (err) {
      console.error('Failed to save payouts', err);
    }
  }

  public processPayout(payoutId: string, transactionRef: string, adminNotes?: string, adminName: string = 'Super Admin') {
    const payouts = this.getPayouts();
    const index = payouts.findIndex(p => p.id === payoutId);
    if (index === -1) return { success: false, error: 'Payout not found' };

    const payout = payouts[index];
    payouts[index] = {
      ...payout,
      status: 'completed',
      transaction_reference: transactionRef,
      admin_notes: adminNotes || 'Disbursed via Bangladesh Payment Gateway',
      processed_at: new Date().toISOString()
    };

    this.savePayouts(payouts);

    this.logAction({
      admin_name: adminName,
      action: 'PROCESS_PAYOUT',
      entity_type: 'payout',
      entity_id: payoutId,
      description: `Disbursed $${payout.amount_usd} USD (৳${payout.amount_bdt.toLocaleString()} BDT) to ${payout.teacher_name} via ${payout.method.toUpperCase()} (Ref: ${transactionRef}).`
    });

    // Notify teacher
    notificationService.notify({
      recipient_id: payout.teacher_id,
      recipient_role: 'teacher',
      type: 'payout_processed',
      title: `Payout Completed: ৳${payout.amount_bdt.toLocaleString()} BDT`,
      message: `Your withdrawal of $${payout.amount_usd} USD to ${payout.account_details} has been completed (TxRef: ${transactionRef}).`,
      link: '/teacher/dashboard'
    });

    return { success: true, payout: payouts[index] };
  }

  public rejectPayout(payoutId: string, reason: string, adminName: string = 'Super Admin') {
    const payouts = this.getPayouts();
    const index = payouts.findIndex(p => p.id === payoutId);
    if (index === -1) return { success: false, error: 'Payout not found' };

    const payout = payouts[index];
    payouts[index] = {
      ...payout,
      status: 'rejected',
      admin_notes: reason,
      processed_at: new Date().toISOString()
    };

    this.savePayouts(payouts);

    this.logAction({
      admin_name: adminName,
      action: 'REJECT_PAYOUT',
      entity_type: 'payout',
      entity_id: payoutId,
      description: `Rejected payout request of $${payout.amount_usd} for ${payout.teacher_name}. Reason: ${reason}`
    });

    return { success: true, payout: payouts[index] };
  }

  // -------------------------------------------------------------
  // REPORTS
  // -------------------------------------------------------------
  public getReports(): PlatformReport[] {
    if (!this.isBrowser()) return INITIAL_REPORTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (stored) return JSON.parse(stored);
      this.saveReports(INITIAL_REPORTS);
      return INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  }

  public saveReports(reports: PlatformReport[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(reports));
      window.dispatchEvent(new CustomEvent('deenitutor:admin-sync'));
    } catch (err) {
      console.error('Failed to save reports', err);
    }
  }

  public resolveReport(reportId: string, status: PlatformReport['status'] = 'resolved', notes: string = '', adminName: string = 'Super Admin') {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === reportId);
    if (index === -1) return { success: false, error: 'Report not found' };

    reports[index] = {
      ...reports[index],
      status,
      resolution_notes: notes,
      resolved_by: adminName,
      resolved_at: new Date().toISOString()
    };

    this.saveReports(reports);

    this.logAction({
      admin_name: adminName,
      action: 'RESOLVE_REPORT',
      entity_type: 'report',
      entity_id: reportId,
      description: `Report #${reportId} (${reports[index].category}) marked as ${status}. Resolution: ${notes}`
    });

    return { success: true, report: reports[index] };
  }

  // -------------------------------------------------------------
  // SETTINGS
  // -------------------------------------------------------------
  public getSettings(): PlatformSettings {
    if (!this.isBrowser()) return INITIAL_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) return JSON.parse(stored);
      this.saveSettings(INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  public saveSettings(settings: PlatformSettings) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('deenitutor:admin-sync'));
    } catch (err) {
      console.error('Failed to save settings', err);
    }
  }

  public updateSettings(partial: Partial<PlatformSettings>, adminName: string = 'Super Admin') {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    this.saveSettings(updated);

    this.logAction({
      admin_name: adminName,
      action: 'UPDATE_PLATFORM_SETTINGS',
      entity_type: 'settings',
      entity_id: 'settings-root',
      description: `Updated platform configuration: Commission=${updated.commission_percentage}%, BDT Rate=${updated.bdt_exchange_rate}`
    });

    return updated;
  }

  // -------------------------------------------------------------
  // STUDENTS
  // -------------------------------------------------------------
  public getStudents(): AdminStudentSummary[] {
    if (!this.isBrowser()) return INITIAL_STUDENTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (stored) return JSON.parse(stored);
      this.saveStudents(INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  }

  public saveStudents(students: AdminStudentSummary[]) {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
      window.dispatchEvent(new CustomEvent('deenitutor:admin-sync'));
    } catch (err) {
      console.error('Failed to save students', err);
    }
  }

  public toggleStudentStatus(studentId: string, adminName: string = 'Super Admin') {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === studentId);
    if (index === -1) return { success: false };

    const newStatus = students[index].status === 'active' ? 'suspended' : 'active';
    students[index].status = newStatus;
    this.saveStudents(students);

    this.logAction({
      admin_name: adminName,
      action: newStatus === 'suspended' ? 'SUSPEND_STUDENT' : 'ACTIVATE_STUDENT',
      entity_type: 'student',
      entity_id: studentId,
      description: `Changed status for student ${students[index].full_name} to ${newStatus.toUpperCase()}`
    });

    return { success: true, status: newStatus };
  }

  // -------------------------------------------------------------
  // PLATFORM METRICS & STATS
  // -------------------------------------------------------------
  public getPlatformMetrics() {
    const teachers = this.getTeachers();
    const bookings = bookingService.getBookings();
    const payouts = this.getPayouts();
    const students = this.getStudents();
    const settings = this.getSettings();

    const verifiedTeachers = teachers.filter(t => t.is_approved || t.verification_status === 'approved');
    const pendingApplications = teachers.filter(t => t.verification_status === 'under_review' || t.verification_status === 'submitted');
    
    // Revenue calculations
    const commissionRate = (settings.commission_percentage || 15) / 100;
    let grossRevenue = 0;
    let completedBookings = 0;
    let activeBookings = 0;

    bookings.forEach(b => {
      grossRevenue += b.price_usd;
      if (b.status === 'completed') completedBookings++;
      if (b.status === 'confirmed' || b.status === 'pending') activeBookings++;
    });

    const netCommissionEarned = Number((grossRevenue * commissionRate).toFixed(2));
    const teacherPayoutObligation = Number((grossRevenue * (1 - commissionRate)).toFixed(2));

    const pendingPayoutsList = payouts.filter(p => p.status === 'pending');
    const pendingPayoutAmountUsd = pendingPayoutsList.reduce((acc, p) => acc + p.amount_usd, 0);

    return {
      totalTeachers: teachers.length,
      verifiedTeachersCount: verifiedTeachers.length,
      pendingApplicationsCount: pendingApplications.length,
      totalStudentsCount: students.length + 535, // Including aggregate verified learner accounts
      totalBookingsCount: bookings.length + 1840,
      activeBookingsCount: activeBookings,
      completedBookingsCount: completedBookings,
      grossRevenueUsd: Number((grossRevenue + 24500).toFixed(2)),
      platformCommissionUsd: Number((netCommissionEarned + 3675).toFixed(2)),
      teacherPayoutObligationUsd: Number((teacherPayoutObligation + 20825).toFixed(2)),
      pendingPayoutsCount: pendingPayoutsList.length,
      pendingPayoutAmountUsd: Number(pendingPayoutAmountUsd.toFixed(2)),
      commissionPercentage: settings.commission_percentage,
    };
  }
}

export const adminService = new AdminManager();
