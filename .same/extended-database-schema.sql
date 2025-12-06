-- UNRE INTEGRATED STUDENT INFORMATION SYSTEM - EXTENDED SCHEMA
-- Additional Modules: Student Services, Clinic, Library, PR, Clearance, Bookshop

-- Run this AFTER the base supabase-setup.sql script

-- ============================================
-- NEW ENUM TYPES
-- ============================================

CREATE TYPE service_request_type AS ENUM (
  'welfare',
  'counseling',
  'accommodation',
  'personal_issue',
  'student_affairs',
  'complaint',
  'other'
);

CREATE TYPE service_request_status AS ENUM (
  'submitted',
  'in_progress',
  'pending_student',
  'resolved',
  'closed',
  'escalated'
);

CREATE TYPE service_request_priority AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE clinic_visit_type AS ENUM (
  'medical',
  'counseling',
  'welfare_assessment',
  'follow_up',
  'emergency'
);

CREATE TYPE library_item_type AS ENUM (
  'book',
  'journal',
  'thesis',
  'multimedia',
  'equipment'
);

CREATE TYPE library_transaction_status AS ENUM (
  'borrowed',
  'returned',
  'overdue',
  'lost',
  'damaged'
);

CREATE TYPE id_card_status AS ENUM (
  'active',
  'suspended',
  'lost',
  'replaced',
  'expired',
  'revoked'
);

CREATE TYPE laptop_status AS ENUM (
  'available',
  'issued',
  'in_setup',
  'configured',
  'returned',
  'damaged',
  'lost'
);

CREATE TYPE clearance_department AS ENUM (
  'student_services',
  'clinic',
  'library',
  'finance',
  'academic_department',
  'public_relations',
  'ict_services',
  'hostel',
  'security',
  'bookshop'
);

-- ============================================
-- STUDENT SERVICES MODULE
-- ============================================

-- Service Requests
CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  request_type service_request_type NOT NULL,
  priority service_request_priority DEFAULT 'medium',
  status service_request_status DEFAULT 'submitted',
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  submitted_date TIMESTAMPTZ DEFAULT NOW(),
  assigned_to UUID REFERENCES users(id),
  assigned_date TIMESTAMPTZ,
  resolved_date TIMESTAMPTZ,
  resolution_notes TEXT,
  is_confidential BOOLEAN DEFAULT false,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service Request Updates/Trail
CREATE TABLE service_request_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  updated_by UUID REFERENCES users(id),
  update_type TEXT NOT NULL,
  notes TEXT,
  previous_status service_request_status,
  new_status service_request_status,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- UNIVERSITY CLINIC MODULE
-- ============================================

-- Clinic Visits
CREATE TABLE clinic_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  visit_date TIMESTAMPTZ DEFAULT NOW(),
  visit_type clinic_visit_type NOT NULL,
  attending_staff UUID REFERENCES users(id),
  chief_complaint TEXT,
  diagnosis TEXT,
  treatment TEXT,
  prescription TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  is_confidential BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Counseling Sessions
CREATE TABLE counseling_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  session_date TIMESTAMPTZ DEFAULT NOW(),
  counselor_id UUID REFERENCES users(id),
  session_type TEXT,
  session_notes TEXT,
  welfare_status TEXT,
  risk_level TEXT,
  action_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  is_confidential BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Welfare Assessments
CREATE TABLE welfare_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  assessment_date TIMESTAMPTZ DEFAULT NOW(),
  assessed_by UUID REFERENCES users(id),
  social_wellbeing_score INTEGER CHECK (social_wellbeing_score BETWEEN 1 AND 10),
  financial_status TEXT,
  accommodation_status TEXT,
  family_situation TEXT,
  concerns JSONB,
  recommendations TEXT,
  academic_impact_notes TEXT,
  share_with_academic BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LIBRARY MODULE
-- ============================================

-- Library Items
CREATE TABLE library_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_type library_item_type NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT,
  call_number TEXT UNIQUE NOT NULL,
  publisher TEXT,
  publication_year INTEGER,
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  location TEXT,
  is_reference BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Transactions
CREATE TABLE library_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  library_item_id UUID REFERENCES library_items(id),
  transaction_type library_transaction_status NOT NULL,
  borrow_date TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE NOT NULL,
  return_date TIMESTAMPTZ,
  librarian_id UUID REFERENCES users(id),
  fine_amount DECIMAL(10,2) DEFAULT 0,
  fine_paid BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Fines
CREATE TABLE library_fines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES library_transactions(id),
  fine_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  issue_date TIMESTAMPTZ DEFAULT NOW(),
  paid BOOLEAN DEFAULT false,
  paid_date TIMESTAMPTZ,
  payment_reference TEXT,
  waived BOOLEAN DEFAULT false,
  waived_by UUID REFERENCES users(id),
  waived_reason TEXT
);

-- ============================================
-- PUBLIC RELATIONS MODULE
-- ============================================

-- Student ID Cards
CREATE TABLE student_id_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  card_number TEXT UNIQUE NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status id_card_status DEFAULT 'active',
  photo_url TEXT,
  issued_by UUID REFERENCES users(id),
  replacement_count INTEGER DEFAULT 0,
  last_replacement_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal Numbers
CREATE TABLE meal_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  meal_number TEXT UNIQUE NOT NULL,
  semester_id UUID REFERENCES semesters(id),
  assigned_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  assigned_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ID Card Replacements
CREATE TABLE id_card_replacements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  old_card_number TEXT,
  new_card_number TEXT,
  replacement_reason TEXT NOT NULL,
  replacement_date DATE DEFAULT CURRENT_DATE,
  fee_charged DECIMAL(10,2),
  fee_paid BOOLEAN DEFAULT false,
  processed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKSHOP & LAPTOP PROVISIONING MODULE
-- ============================================

-- Laptop Inventory
CREATE TABLE laptop_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_model TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  asset_tag TEXT UNIQUE NOT NULL,
  purchase_date DATE,
  warranty_expiry DATE,
  status laptop_status DEFAULT 'available',
  assigned_to UUID REFERENCES students(id),
  assignment_date DATE,
  return_date DATE,
  condition TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laptop Assignments
CREATE TABLE laptop_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  laptop_id UUID REFERENCES laptop_inventory(id),
  assignment_date DATE DEFAULT CURRENT_DATE,
  expected_return_date DATE,
  actual_return_date DATE,
  condition_on_issue TEXT,
  condition_on_return TEXT,
  agreement_signed BOOLEAN DEFAULT false,
  agreement_url TEXT,
  assigned_by UUID REFERENCES users(id),
  returned_to UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Laptop Setup Progress
CREATE TABLE laptop_setup_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  laptop_id UUID REFERENCES laptop_inventory(id),
  setup_started_date TIMESTAMPTZ,
  setup_completed_date TIMESTAMPTZ,
  microsoft_365_activated BOOLEAN DEFAULT false,
  windows_configured BOOLEAN DEFAULT false,
  security_software_installed BOOLEAN DEFAULT false,
  university_apps_installed BOOLEAN DEFAULT false,
  network_configured BOOLEAN DEFAULT false,
  ict_assistance_required BOOLEAN DEFAULT false,
  assistance_notes TEXT,
  setup_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLEARANCE SYSTEM
-- ============================================

-- Department Clearances
CREATE TABLE department_clearances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id),
  department clearance_department NOT NULL,
  status clearance_status DEFAULT 'pending',
  cleared_by UUID REFERENCES users(id),
  cleared_date TIMESTAMPTZ,
  hold_reason TEXT,
  notes TEXT,
  requirements_met JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, semester_id, department)
);

-- Overall Clearance Status
CREATE TABLE overall_clearance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id),
  clearance_type TEXT NOT NULL, -- graduation, transfer, withdrawal, certification
  all_departments_cleared BOOLEAN DEFAULT false,
  final_clearance_date TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  issued_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, semester_id, clearance_type)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_service_requests_student ON service_requests(student_id, status);
CREATE INDEX idx_service_requests_assigned ON service_requests(assigned_to, status);
CREATE INDEX idx_clinic_visits_student ON clinic_visits(student_id, visit_date);
CREATE INDEX idx_counseling_sessions_student ON counseling_sessions(student_id, session_date);
CREATE INDEX idx_welfare_assessments_student ON welfare_assessments(student_id);
CREATE INDEX idx_library_transactions_student ON library_transactions(student_id, transaction_type);
CREATE INDEX idx_library_fines_student ON library_fines(student_id, paid);
CREATE INDEX idx_student_id_cards_student ON student_id_cards(student_id, status);
CREATE INDEX idx_laptop_assignments_student ON laptop_assignments(student_id);
CREATE INDEX idx_laptop_setup_progress_student ON laptop_setup_progress(student_id);
CREATE INDEX idx_department_clearances_student ON department_clearances(student_id, semester_id);
CREATE INDEX idx_overall_clearance_student ON overall_clearance(student_id, clearance_type);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_request_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE welfare_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE id_card_replacements ENABLE ROW LEVEL SECURITY;
ALTER TABLE laptop_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE laptop_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE laptop_setup_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_clearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE overall_clearance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Service Requests
CREATE POLICY "Students can view own service requests" ON service_requests FOR SELECT USING (
  student_id = auth.uid()
);

CREATE POLICY "Students can create service requests" ON service_requests FOR INSERT WITH CHECK (
  student_id = auth.uid()
);

CREATE POLICY "Student Services staff can view all requests" ON service_requests FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('student_services', 'ict_admin'))
);

-- RLS Policies for Clinic (highly confidential)
CREATE POLICY "Students can view own clinic visits" ON clinic_visits FOR SELECT USING (
  student_id = auth.uid()
);

CREATE POLICY "Clinic staff can view all visits" ON clinic_visits FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('clinic_staff', 'ict_admin'))
);

-- Academic departments can view welfare summaries only if share_with_academic = true
CREATE POLICY "Academic can view shared welfare assessments" ON welfare_assessments FOR SELECT USING (
  share_with_academic = true AND
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('department_head', 'academic_advisor', 'dean'))
);

-- RLS Policies for Library
CREATE POLICY "Students can view own library transactions" ON library_transactions FOR SELECT USING (
  student_id = auth.uid()
);

CREATE POLICY "Library staff can view all transactions" ON library_transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('librarian', 'ict_admin'))
);

-- Public read on library items
CREATE POLICY "Public can view library items" ON library_items FOR SELECT USING (true);

-- RLS Policies for ID Cards
CREATE POLICY "Students can view own ID card" ON student_id_cards FOR SELECT USING (
  student_id = auth.uid()
);

CREATE POLICY "PR staff can manage all ID cards" ON student_id_cards FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('pr_staff', 'ict_admin'))
);

-- RLS Policies for Laptop Setup
CREATE POLICY "Students can view own laptop setup" ON laptop_setup_progress FOR SELECT USING (
  student_id = auth.uid()
);

CREATE POLICY "Students can update own laptop setup" ON laptop_setup_progress FOR UPDATE USING (
  student_id = auth.uid()
);

CREATE POLICY "ICT staff can view all laptop setups" ON laptop_setup_progress FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ict_admin')
);

-- RLS Policies for Clearances
CREATE POLICY "Students can view own clearances" ON department_clearances FOR SELECT USING (
  student_id = auth.uid()
);

CREATE POLICY "Department staff can manage their department clearances" ON department_clearances FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('registrar', 'finance', 'ict_admin'))
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to check if all departments cleared
CREATE OR REPLACE FUNCTION check_all_clearances_complete(p_student_id UUID, p_semester_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  total_departments INTEGER;
  cleared_departments INTEGER;
BEGIN
  -- Count required departments
  SELECT COUNT(DISTINCT department) INTO total_departments
  FROM department_clearances
  WHERE student_id = p_student_id AND semester_id = p_semester_id;

  -- Count cleared departments
  SELECT COUNT(*) INTO cleared_departments
  FROM department_clearances
  WHERE student_id = p_student_id
    AND semester_id = p_semester_id
    AND status = 'cleared';

  RETURN (total_departments > 0 AND total_departments = cleared_departments);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate library fines
CREATE OR REPLACE FUNCTION calculate_library_fine(p_transaction_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  days_overdue INTEGER;
  fine_per_day DECIMAL := 0.50; -- K0.50 per day
  max_fine DECIMAL := 50.00; -- K50.00 max
  calculated_fine DECIMAL;
  v_due_date DATE;
  v_return_date DATE;
BEGIN
  SELECT due_date, COALESCE(return_date, CURRENT_DATE)
  INTO v_due_date, v_return_date
  FROM library_transactions
  WHERE id = p_transaction_id;

  days_overdue := GREATEST(0, v_return_date - v_due_date);
  calculated_fine := LEAST(days_overdue * fine_per_day, max_fine);

  RETURN calculated_fine;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamps
CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_laptop_setup_updated_at BEFORE UPDATE ON laptop_setup_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_department_clearances_updated_at BEFORE UPDATE ON department_clearances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INITIAL SEED DATA
-- ============================================

-- Add new user roles to existing enum
-- Note: These will error if the values already exist - that's okay, just ignore those errors
-- Run each one separately if needed

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'student_services'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'student_services';
  END IF;
END $;

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'clinic_staff'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'clinic_staff';
  END IF;
END $;

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'librarian'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'librarian';
  END IF;
END $;

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'pr_staff'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'pr_staff';
  END IF;
END $;

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'bookshop_staff'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'bookshop_staff';
  END IF;
END $;

DO $
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'counselor'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'counselor';
  END IF;
END $;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Extended UNRE modules setup completed successfully!';
  RAISE NOTICE 'Added: Student Services, Clinic, Library, PR, Clearance, and Bookshop modules';
END $$;
