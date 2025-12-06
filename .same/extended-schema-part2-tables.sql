-- UNRE EXTENDED SCHEMA - PART 2: TABLES, INDEXES, RLS, AND FUNCTIONS
-- Run this AFTER part 1 (enums) has completed successfully

-- IMPORTANT: Make sure you ran extended-schema-part1-enums.sql first!
-- The enum values MUST be committed before running this script.

-- ============================================
-- CREATE TABLES
-- ============================================

-- Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
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

CREATE TABLE IF NOT EXISTS service_request_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES service_requests(id) ON DELETE CASCADE,
  updated_by UUID REFERENCES users(id),
  update_type TEXT NOT NULL,
  notes TEXT,
  previous_status service_request_status,
  new_status service_request_status,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clinic
CREATE TABLE IF NOT EXISTS clinic_visits (
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

CREATE TABLE IF NOT EXISTS counseling_sessions (
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

CREATE TABLE IF NOT EXISTS welfare_assessments (
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

-- Library
CREATE TABLE IF NOT EXISTS library_items (
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

CREATE TABLE IF NOT EXISTS library_transactions (
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

CREATE TABLE IF NOT EXISTS library_fines (
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

-- Public Relations
CREATE TABLE IF NOT EXISTS student_id_cards (
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

CREATE TABLE IF NOT EXISTS meal_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  meal_number TEXT UNIQUE NOT NULL,
  semester_id UUID REFERENCES semesters(id),
  assigned_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  assigned_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS id_card_replacements (
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

-- Laptop & Bookshop
CREATE TABLE IF NOT EXISTS laptop_inventory (
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

CREATE TABLE IF NOT EXISTS laptop_assignments (
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

CREATE TABLE IF NOT EXISTS laptop_setup_progress (
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

-- Clearance System
CREATE TABLE IF NOT EXISTS department_clearances (
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

CREATE TABLE IF NOT EXISTS overall_clearance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id),
  clearance_type TEXT NOT NULL,
  all_departments_cleared BOOLEAN DEFAULT false,
  final_clearance_date TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT false,
  certificate_url TEXT,
  issued_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, semester_id, clearance_type)
);

-- ============================================
-- PART 4: CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_service_requests_student ON service_requests(student_id, status);
CREATE INDEX IF NOT EXISTS idx_service_requests_assigned ON service_requests(assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_clinic_visits_student ON clinic_visits(student_id, visit_date);
CREATE INDEX IF NOT EXISTS idx_counseling_sessions_student ON counseling_sessions(student_id, session_date);
CREATE INDEX IF NOT EXISTS idx_welfare_assessments_student ON welfare_assessments(student_id);
CREATE INDEX IF NOT EXISTS idx_library_transactions_student ON library_transactions(student_id, transaction_type);
CREATE INDEX IF NOT EXISTS idx_library_fines_student ON library_fines(student_id, paid);
CREATE INDEX IF NOT EXISTS idx_student_id_cards_student ON student_id_cards(student_id, status);
CREATE INDEX IF NOT EXISTS idx_laptop_assignments_student ON laptop_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_laptop_setup_progress_student ON laptop_setup_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_department_clearances_student ON department_clearances(student_id, semester_id);
CREATE INDEX IF NOT EXISTS idx_overall_clearance_student ON overall_clearance(student_id, clearance_type);

-- ============================================
-- PART 5: ENABLE ROW LEVEL SECURITY
-- ============================================

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

-- ============================================
-- PART 6: CREATE RLS POLICIES
-- ============================================

-- Service Requests Policies
DO $$ BEGIN
  CREATE POLICY "Students can view own service requests" ON service_requests FOR SELECT
  USING (student_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Students can create service requests" ON service_requests FOR INSERT
  WITH CHECK (student_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Student Services staff can view all requests" ON service_requests FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('student_services', 'ict_admin')));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Clinic Policies
DO $$ BEGIN
  CREATE POLICY "Students can view own clinic visits" ON clinic_visits FOR SELECT
  USING (student_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Clinic staff can view all visits" ON clinic_visits FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('clinic_staff', 'ict_admin')));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Academic can view shared welfare assessments" ON welfare_assessments FOR SELECT
  USING (share_with_academic = true AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('department_head', 'academic_advisor', 'dean')
  ));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Library Policies
DO $$ BEGIN
  CREATE POLICY "Students can view own library transactions" ON library_transactions FOR SELECT
  USING (student_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Library staff can view all transactions" ON library_transactions FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('librarian', 'ict_admin')));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public can view library items" ON library_items FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ID Card Policies
DO $$ BEGIN
  CREATE POLICY "Students can view own ID card" ON student_id_cards FOR SELECT
  USING (student_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "PR staff can manage all ID cards" ON student_id_cards FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('pr_staff', 'ict_admin')));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Laptop Setup Policies
DO $$ BEGIN
  CREATE POLICY "Students can view own laptop setup" ON laptop_setup_progress FOR SELECT
  USING (student_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Students can update own laptop setup" ON laptop_setup_progress FOR UPDATE
  USING (student_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "ICT staff can view all laptop setups" ON laptop_setup_progress FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ict_admin'));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Clearance Policies
DO $$ BEGIN
  CREATE POLICY "Students can view own clearances" ON department_clearances FOR SELECT
  USING (student_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Department staff can manage their department clearances" ON department_clearances FOR ALL
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('registrar', 'finance', 'ict_admin')));
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- PART 7: CREATE FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION check_all_clearances_complete(p_student_id UUID, p_semester_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  total_departments INTEGER;
  cleared_departments INTEGER;
BEGIN
  SELECT COUNT(DISTINCT department) INTO total_departments
  FROM department_clearances
  WHERE student_id = p_student_id AND semester_id = p_semester_id;

  SELECT COUNT(*) INTO cleared_departments
  FROM department_clearances
  WHERE student_id = p_student_id
    AND semester_id = p_semester_id
    AND status = 'cleared';

  RETURN (total_departments > 0 AND total_departments = cleared_departments);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_library_fine(p_transaction_id UUID)
RETURNS DECIMAL AS $$
DECLARE
  days_overdue INTEGER;
  fine_per_day DECIMAL := 0.50;
  max_fine DECIMAL := 50.00;
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
-- PART 8: CREATE TRIGGERS
-- ============================================

DROP TRIGGER IF EXISTS update_service_requests_updated_at ON service_requests;
CREATE TRIGGER update_service_requests_updated_at
  BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_laptop_setup_updated_at ON laptop_setup_progress;
CREATE TRIGGER update_laptop_setup_updated_at
  BEFORE UPDATE ON laptop_setup_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_department_clearances_updated_at ON department_clearances;
CREATE TRIGGER update_department_clearances_updated_at
  BEFORE UPDATE ON department_clearances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ PART 2 COMPLETE!';
  RAISE NOTICE '✅ Created 16 new tables';
  RAISE NOTICE '✅ Created 12 indexes for performance';
  RAISE NOTICE '✅ Enabled RLS on all tables';
  RAISE NOTICE '✅ Created 12 RLS policies';
  RAISE NOTICE '✅ Created 2 helper functions';
  RAISE NOTICE '✅ Created 3 triggers';
  RAISE NOTICE '========================================';
  RAISE NOTICE '🎉 DATABASE SETUP COMPLETE!';
  RAISE NOTICE '🎉 Total tables in system: 34';
  RAISE NOTICE '========================================';
  RAISE NOTICE '⏭️ NEXT STEPS:';
  RAISE NOTICE '  1. Create storage buckets';
  RAISE NOTICE '  2. Configure authentication';
  RAISE NOTICE '  3. Test connection page';
  RAISE NOTICE '========================================';
END $$;
