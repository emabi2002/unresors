// Extended types for UNRE Integrated Student Information System

export type ServiceRequestType =
  | 'welfare'
  | 'counseling'
  | 'accommodation'
  | 'personal_issue'
  | 'student_affairs'
  | 'complaint'
  | 'other';

export type ServiceRequestStatus =
  | 'submitted'
  | 'in_progress'
  | 'pending_student'
  | 'resolved'
  | 'closed'
  | 'escalated';

export type ServiceRequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export type ClinicVisitType =
  | 'medical'
  | 'counseling'
  | 'welfare_assessment'
  | 'follow_up'
  | 'emergency';

export type LibraryItemType =
  | 'book'
  | 'journal'
  | 'thesis'
  | 'multimedia'
  | 'equipment';

export type LibraryTransactionStatus =
  | 'borrowed'
  | 'returned'
  | 'overdue'
  | 'lost'
  | 'damaged';

export type IDCardStatus =
  | 'active'
  | 'suspended'
  | 'lost'
  | 'replaced'
  | 'expired'
  | 'revoked';

export type LaptopStatus =
  | 'available'
  | 'issued'
  | 'in_setup'
  | 'configured'
  | 'returned'
  | 'damaged'
  | 'lost';

export type ClearanceDepartment =
  | 'student_services'
  | 'clinic'
  | 'library'
  | 'finance'
  | 'academic_department'
  | 'public_relations'
  | 'ict_services'
  | 'hostel'
  | 'security'
  | 'bookshop';

// Interfaces

export interface ServiceRequest {
  id: string;
  student_id: string;
  request_type: ServiceRequestType;
  priority: ServiceRequestPriority;
  status: ServiceRequestStatus;
  subject: string;
  description: string;
  submitted_date: string;
  assigned_to?: string;
  assigned_date?: string;
  resolved_date?: string;
  resolution_notes?: string;
  is_confidential: boolean;
  attachments?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ClinicVisit {
  id: string;
  student_id: string;
  visit_date: string;
  visit_type: ClinicVisitType;
  attending_staff: string;
  chief_complaint?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  is_confidential: boolean;
  created_at: string;
}

export interface CounselingSession {
  id: string;
  student_id: string;
  session_date: string;
  counselor_id: string;
  session_type?: string;
  session_notes?: string;
  welfare_status?: string;
  risk_level?: string;
  action_required: boolean;
  follow_up_date?: string;
  is_confidential: boolean;
  created_at: string;
}

export interface WelfareAssessment {
  id: string;
  student_id: string;
  assessment_date: string;
  assessed_by: string;
  social_wellbeing_score?: number;
  financial_status?: string;
  accommodation_status?: string;
  family_situation?: string;
  concerns?: Record<string, any>;
  recommendations?: string;
  academic_impact_notes?: string;
  share_with_academic: boolean;
  created_at: string;
}

export interface LibraryItem {
  id: string;
  item_type: LibraryItemType;
  title: string;
  author?: string;
  isbn?: string;
  call_number: string;
  publisher?: string;
  publication_year?: number;
  total_copies: number;
  available_copies: number;
  location?: string;
  is_reference: boolean;
  created_at: string;
}

export interface LibraryTransaction {
  id: string;
  student_id: string;
  library_item_id: string;
  transaction_type: LibraryTransactionStatus;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  librarian_id: string;
  fine_amount: number;
  fine_paid: boolean;
  notes?: string;
  created_at: string;
  item?: LibraryItem;
}

export interface LibraryFine {
  id: string;
  student_id: string;
  transaction_id: string;
  fine_type: string;
  amount: number;
  reason?: string;
  issue_date: string;
  paid: boolean;
  paid_date?: string;
  payment_reference?: string;
  waived: boolean;
  waived_by?: string;
  waived_reason?: string;
}

export interface StudentIDCard {
  id: string;
  student_id: string;
  card_number: string;
  issue_date: string;
  expiry_date: string;
  status: IDCardStatus;
  photo_url?: string;
  issued_by: string;
  replacement_count: number;
  last_replacement_date?: string;
  notes?: string;
  created_at: string;
}

export interface MealNumber {
  id: string;
  student_id: string;
  meal_number: string;
  semester_id: string;
  assigned_date: string;
  is_active: boolean;
  assigned_by: string;
  created_at: string;
}

export interface LaptopInventory {
  id: string;
  device_model: string;
  serial_number: string;
  asset_tag: string;
  purchase_date?: string;
  warranty_expiry?: string;
  status: LaptopStatus;
  assigned_to?: string;
  assignment_date?: string;
  return_date?: string;
  condition?: string;
  notes?: string;
  created_at: string;
}

export interface LaptopAssignment {
  id: string;
  student_id: string;
  laptop_id: string;
  assignment_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
  condition_on_issue?: string;
  condition_on_return?: string;
  agreement_signed: boolean;
  agreement_url?: string;
  assigned_by: string;
  returned_to?: string;
  created_at: string;
  laptop?: LaptopInventory;
}

export interface LaptopSetupProgress {
  id: string;
  student_id: string;
  laptop_id: string;
  setup_started_date?: string;
  setup_completed_date?: string;
  microsoft_365_activated: boolean;
  windows_configured: boolean;
  security_software_installed: boolean;
  university_apps_installed: boolean;
  network_configured: boolean;
  ict_assistance_required: boolean;
  assistance_notes?: string;
  setup_status: string;
  created_at: string;
  updated_at: string;
}

export interface DepartmentClearance {
  id: string;
  student_id: string;
  semester_id: string;
  department: ClearanceDepartment;
  status: 'cleared' | 'hold' | 'pending';
  cleared_by?: string;
  cleared_date?: string;
  hold_reason?: string;
  notes?: string;
  requirements_met?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OverallClearance {
  id: string;
  student_id: string;
  semester_id: string;
  clearance_type: string;
  all_departments_cleared: boolean;
  final_clearance_date?: string;
  certificate_issued: boolean;
  certificate_url?: string;
  issued_by?: string;
  created_at: string;
}
