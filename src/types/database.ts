export type UserRole =
  | 'student'
  | 'registrar'
  | 'finance'
  | 'admissions'
  | 'ict_admin'
  | 'department_head'
  | 'academic_advisor'
  | 'dean';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'offer_sent'
  | 'accepted';

export type AcademicStanding =
  | 'good'
  | 'probation'
  | 'suspended'
  | 'graduated'
  | 'withdrawn';

export type CourseRegistrationStatus =
  | 'pending_advisor'
  | 'pending_registrar'
  | 'approved'
  | 'rejected'
  | 'dropped'
  | 'completed';

export type PaymentStatus =
  | 'pending'
  | 'successful'
  | 'failed'
  | 'refunded';

export type InvoiceStatus =
  | 'pending'
  | 'partial'
  | 'paid'
  | 'overdue';

export type PaymentMethod =
  | 'bsp_pay'
  | 'kina_bank'
  | 'visa'
  | 'mastercard'
  | 'cash'
  | 'mobile_money';

export type DocumentType =
  | 'grade_12_cert'
  | 'transcript'
  | 'national_id'
  | 'photo'
  | 'other';

export type Semester = 'semester_1' | 'semester_2';

export type Gender = 'male' | 'female' | 'other';

export type StudentType = 'new' | 'returning' | 'transfer';

export type DegreeLevel =
  | 'certificate'
  | 'diploma'
  | 'undergraduate'
  | 'postgraduate';

export type CourseType = 'compulsory' | 'elective';

export type ClearanceType =
  | 'finance'
  | 'library'
  | 'discipline'
  | 'department';

export type ClearanceStatus = 'cleared' | 'hold' | 'pending';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  middle_name?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface Student {
  id: string;
  student_id: string;
  date_of_birth: string;
  gender: Gender;
  nationality: string;
  national_id: string;
  program_id: string;
  enrollment_year: number;
  enrollment_semester: Semester;
  student_type: StudentType;
  academic_standing: AcademicStanding;
  current_gpa?: number;
  total_credits_earned: number;
  photo_url?: string;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    country?: string;
  };
  emergency_contact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
}

export interface Application {
  id: string;
  applicant_email: string;
  applicant_phone: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  program_id: string;
  application_date: string;
  status: ApplicationStatus;
  documents?: Record<string, any>;
  current_approver_role?: string;
  approval_chain?: Array<{
    role: string;
    approved: boolean;
    date?: string;
    approver_id?: string;
  }>;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  program_code: string;
  program_name: string;
  department_id: string;
  degree_level: DegreeLevel;
  duration_years: number;
  total_credits_required: number;
  description?: string;
  is_active: boolean;
}

export interface Department {
  id: string;
  department_code: string;
  department_name: string;
  faculty: string;
  head_id?: string;
  created_at: string;
}

export interface Course {
  id: string;
  course_code: string;
  course_name: string;
  department_id: string;
  credits: number;
  course_type: CourseType;
  description?: string;
  prerequisites?: string[];
  semester_offered: Semester | 'both';
  is_active: boolean;
}

export interface CourseRegistration {
  id: string;
  student_id: string;
  course_id: string;
  semester_id: string;
  registration_date: string;
  status: CourseRegistrationStatus;
  advisor_approved: boolean;
  advisor_id?: string;
  advisor_approval_date?: string;
  registrar_approved: boolean;
  registrar_id?: string;
  registrar_approval_date?: string;
  grade?: string;
  grade_points?: number;
}

export interface SemesterInfo {
  id: string;
  year: number;
  semester: Semester;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  is_current: boolean;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  student_id: string;
  semester_id: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  amount_paid: number;
  balance: number;
  status: InvoiceStatus;
  fee_breakdown?: {
    tuition_fee?: number;
    lodging_fee?: number;
    messing_fee?: number;
    ict_levy?: number;
    student_services_fee?: number;
    other_fees?: Record<string, number>;
  };
  arrears_included: number;
}

export interface Payment {
  id: string;
  invoice_id: string;
  student_id: string;
  payment_date: string;
  amount: number;
  payment_method: PaymentMethod;
  transaction_reference: string;
  gateway_response?: Record<string, any>;
  status: PaymentStatus;
  receipt_url?: string;
  reconciled: boolean;
  reconciled_date?: string;
  reconciled_by?: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  semester_id: string;
  enrollment_date: string;
  status: 'enrolled' | 'withdrawn' | 'completed';
  payment_cleared: boolean;
  clearance_status?: {
    finance?: boolean;
    library?: boolean;
    discipline?: boolean;
  };
  lms_access: boolean;
  library_access: boolean;
  exams_access: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}
