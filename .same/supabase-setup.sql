-- UNRE Student Registration System - Supabase Database Setup
-- Execute this script in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM (
  'student',
  'registrar',
  'finance',
  'admissions',
  'ict_admin',
  'department_head',
  'academic_advisor',
  'dean'
);

CREATE TYPE application_status AS ENUM (
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'offer_sent',
  'accepted'
);

CREATE TYPE academic_standing AS ENUM (
  'good',
  'probation',
  'suspended',
  'graduated',
  'withdrawn'
);

CREATE TYPE semester_type AS ENUM ('semester_1', 'semester_2');

CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');

CREATE TYPE student_type AS ENUM ('new', 'returning', 'transfer');

CREATE TYPE degree_level AS ENUM (
  'certificate',
  'diploma',
  'undergraduate',
  'postgraduate'
);

CREATE TYPE course_type AS ENUM ('compulsory', 'elective');

CREATE TYPE course_registration_status AS ENUM (
  'pending_advisor',
  'pending_registrar',
  'approved',
  'rejected',
  'dropped',
  'completed'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'successful',
  'failed',
  'refunded'
);

CREATE TYPE invoice_status AS ENUM (
  'pending',
  'partial',
  'paid',
  'overdue'
);

CREATE TYPE payment_method AS ENUM (
  'bsp_pay',
  'kina_bank',
  'visa',
  'mastercard',
  'cash',
  'mobile_money'
);

CREATE TYPE document_type AS ENUM (
  'grade_12_cert',
  'transcript',
  'national_id',
  'photo',
  'other'
);

CREATE TYPE clearance_type AS ENUM (
  'finance',
  'library',
  'discipline',
  'department'
);

CREATE TYPE clearance_status AS ENUM ('cleared', 'hold', 'pending');

CREATE TYPE enrollment_status AS ENUM ('enrolled', 'withdrawn', 'completed');

-- ============================================
-- CORE TABLES
-- ============================================

-- 1. Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role user_role NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- 2. Students table
CREATE TABLE students (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  student_id TEXT UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  gender gender_type NOT NULL,
  nationality TEXT NOT NULL,
  national_id TEXT NOT NULL,
  program_id UUID,
  enrollment_year INTEGER NOT NULL,
  enrollment_semester semester_type NOT NULL,
  student_type student_type NOT NULL,
  academic_standing academic_standing DEFAULT 'good',
  current_gpa DECIMAL(3,2),
  total_credits_earned INTEGER DEFAULT 0,
  photo_url TEXT,
  address JSONB,
  emergency_contact JSONB
);

-- 3. Departments table
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  department_code TEXT UNIQUE NOT NULL,
  department_name TEXT NOT NULL,
  faculty TEXT NOT NULL,
  head_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Programs table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_code TEXT UNIQUE NOT NULL,
  program_name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  degree_level degree_level NOT NULL,
  duration_years INTEGER NOT NULL,
  total_credits_required INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Add foreign key to students table
ALTER TABLE students ADD CONSTRAINT fk_program FOREIGN KEY (program_id) REFERENCES programs(id);

-- 5. Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  program_id UUID REFERENCES programs(id),
  application_date TIMESTAMPTZ DEFAULT NOW(),
  status application_status DEFAULT 'submitted',
  documents JSONB,
  current_approver_role TEXT,
  approval_chain JSONB,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Application Documents table
CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES users(id)
);

-- 7. Courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_code TEXT UNIQUE NOT NULL,
  course_name TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  credits INTEGER NOT NULL,
  course_type course_type NOT NULL,
  description TEXT,
  prerequisites JSONB,
  semester_offered TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- 8. Program Courses table
CREATE TABLE program_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  year_level INTEGER NOT NULL,
  semester semester_type NOT NULL,
  is_compulsory BOOLEAN DEFAULT true,
  UNIQUE(program_id, course_id)
);

-- 9. Semesters table
CREATE TABLE semesters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  semester semester_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  registration_start DATE NOT NULL,
  registration_end DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  UNIQUE(year, semester)
);

-- 10. Course Registrations table
CREATE TABLE course_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id),
  semester_id UUID REFERENCES semesters(id),
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  status course_registration_status DEFAULT 'pending_advisor',
  advisor_approved BOOLEAN DEFAULT false,
  advisor_id UUID REFERENCES users(id),
  advisor_approval_date TIMESTAMPTZ,
  registrar_approved BOOLEAN DEFAULT false,
  registrar_id UUID REFERENCES users(id),
  registrar_approval_date TIMESTAMPTZ,
  grade TEXT,
  grade_points DECIMAL(3,2)
);

-- 11. Fee Structures table
CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id UUID REFERENCES programs(id),
  semester_id UUID REFERENCES semesters(id),
  tuition_fee DECIMAL(10,2) NOT NULL,
  lodging_fee DECIMAL(10,2),
  messing_fee DECIMAL(10,2),
  ict_levy DECIMAL(10,2),
  student_services_fee DECIMAL(10,2),
  other_fees JSONB,
  effective_date DATE NOT NULL
);

-- 12. Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT UNIQUE NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id),
  issue_date TIMESTAMPTZ DEFAULT NOW(),
  due_date DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  amount_paid DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) NOT NULL,
  status invoice_status DEFAULT 'pending',
  fee_breakdown JSONB,
  arrears_included DECIMAL(10,2) DEFAULT 0
);

-- 13. Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES invoices(id),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  transaction_reference TEXT UNIQUE NOT NULL,
  gateway_response JSONB,
  status payment_status DEFAULT 'pending',
  receipt_url TEXT,
  reconciled BOOLEAN DEFAULT false,
  reconciled_date TIMESTAMPTZ,
  reconciled_by UUID REFERENCES users(id)
);

-- 14. Enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id),
  enrollment_date TIMESTAMPTZ DEFAULT NOW(),
  status enrollment_status DEFAULT 'enrolled',
  payment_cleared BOOLEAN DEFAULT false,
  clearance_status JSONB,
  lms_access BOOLEAN DEFAULT false,
  library_access BOOLEAN DEFAULT false,
  exams_access BOOLEAN DEFAULT false
);

-- 15. Clearances table
CREATE TABLE clearances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  semester_id UUID REFERENCES semesters(id),
  clearance_type clearance_type NOT NULL,
  status clearance_status DEFAULT 'pending',
  reason TEXT,
  cleared_by UUID REFERENCES users(id),
  cleared_date TIMESTAMPTZ
);

-- 16. Offer Letters table
CREATE TABLE offer_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id),
  student_id UUID REFERENCES students(id),
  letter_url TEXT NOT NULL,
  generated_date TIMESTAMPTZ DEFAULT NOW(),
  expiry_date DATE NOT NULL,
  accepted BOOLEAN DEFAULT false,
  acceptance_date TIMESTAMPTZ
);

-- 17. Academic Advisors table
CREATE TABLE academic_advisors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  advisor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_date TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 18. Audit Logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_applications_email ON applications(applicant_email);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_invoices_student_semester ON invoices(student_id, semester_id);
CREATE INDEX idx_payments_reference ON payments(transaction_reference);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_course_registrations_student ON course_registrations(student_id, semester_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id, semester_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, timestamp);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Students
CREATE POLICY "Students can view own record" ON students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can update own record" ON students FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Applications
CREATE POLICY "Anyone can insert applications" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (applicant_email = auth.email());
CREATE POLICY "Staff can view all applications" ON applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('registrar', 'admissions', 'ict_admin'))
);

-- RLS Policies for Invoices
CREATE POLICY "Students can view own invoices" ON invoices FOR SELECT USING (
  student_id = auth.uid()
);
CREATE POLICY "Finance staff can view all invoices" ON invoices FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('finance', 'ict_admin'))
);

-- RLS Policies for Payments
CREATE POLICY "Students can view own payments" ON payments FOR SELECT USING (
  student_id = auth.uid()
);
CREATE POLICY "Finance staff can view all payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('finance', 'ict_admin'))
);

-- RLS Policies for Course Registrations
CREATE POLICY "Students can view own registrations" ON course_registrations FOR SELECT USING (
  student_id = auth.uid()
);
CREATE POLICY "Students can insert own registrations" ON course_registrations FOR INSERT WITH CHECK (
  student_id = auth.uid()
);

-- Public read access for reference tables
CREATE POLICY "Public read on programs" ON programs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read on courses" ON courses FOR SELECT USING (is_active = true);
CREATE POLICY "Public read on departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Public read on semesters" ON semesters FOR SELECT USING (true);

-- Audit logs - read only for ICT admins
CREATE POLICY "ICT admins can view audit logs" ON audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ict_admin')
);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate student ID
CREATE OR REPLACE FUNCTION generate_student_id(enrollment_year INTEGER)
RETURNS TEXT AS $$
DECLARE
  year_suffix TEXT;
  sequence_num TEXT;
  new_id TEXT;
BEGIN
  year_suffix := RIGHT(enrollment_year::TEXT, 2);

  -- Get next sequence number for the year
  SELECT LPAD((COUNT(*) + 1)::TEXT, 3, '0') INTO sequence_num
  FROM students
  WHERE enrollment_year = $1;

  new_id := 'STU-' || enrollment_year::TEXT || '-' || sequence_num;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num TEXT;
  new_number TEXT;
BEGIN
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');

  SELECT LPAD((COUNT(*) + 1)::TEXT, 4, '0') INTO sequence_num
  FROM invoices
  WHERE EXTRACT(YEAR FROM issue_date) = EXTRACT(YEAR FROM CURRENT_DATE);

  new_number := 'INV-' || year_part || '-' || sequence_num;

  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INITIAL SEED DATA
-- ============================================

-- Insert sample departments
INSERT INTO departments (department_code, department_name, faculty) VALUES
  ('ENV', 'Environmental Science', 'Faculty of Natural Sciences'),
  ('FOR', 'Forestry', 'Faculty of Natural Sciences'),
  ('AGR', 'Agriculture', 'Faculty of Agriculture'),
  ('MAR', 'Marine Biology', 'Faculty of Marine Sciences');

-- Insert sample programs
INSERT INTO programs (program_code, program_name, department_id, degree_level, duration_years, total_credits_required, description) VALUES
  ('BENV', 'Bachelor of Environmental Science', (SELECT id FROM departments WHERE department_code = 'ENV'), 'undergraduate', 4, 120, 'Study of environmental systems and sustainability'),
  ('BFOR', 'Bachelor of Forestry', (SELECT id FROM departments WHERE department_code = 'FOR'), 'undergraduate', 4, 120, 'Forest management and conservation'),
  ('BAGR', 'Bachelor of Agriculture', (SELECT id FROM departments WHERE department_code = 'AGR'), 'undergraduate', 4, 120, 'Agricultural science and food production'),
  ('BMAR', 'Bachelor of Marine Biology', (SELECT id FROM departments WHERE department_code = 'MAR'), 'undergraduate', 4, 120, 'Marine ecosystems and biodiversity'),
  ('DNRM', 'Diploma in Natural Resource Management', (SELECT id FROM departments WHERE department_code = 'ENV'), 'diploma', 2, 60, 'Natural resource conservation and management');

-- Insert current semester
INSERT INTO semesters (year, semester, start_date, end_date, registration_start, registration_end, is_current) VALUES
  (2025, 'semester_1', '2025-02-01', '2025-06-30', '2025-01-15', '2025-02-15', true);

-- Insert sample courses
INSERT INTO courses (course_code, course_name, department_id, credits, course_type, description, semester_offered) VALUES
  ('ENV101', 'Introduction to Environmental Science', (SELECT id FROM departments WHERE department_code = 'ENV'), 3, 'compulsory', 'Fundamentals of environmental science', 'semester_1'),
  ('BIO101', 'General Biology', (SELECT id FROM departments WHERE department_code = 'ENV'), 4, 'compulsory', 'Introduction to biological sciences', 'both'),
  ('CHE101', 'General Chemistry', (SELECT id FROM departments WHERE department_code = 'ENV'), 4, 'compulsory', 'Basic chemistry principles', 'both'),
  ('MAT101', 'Mathematics I', (SELECT id FROM departments WHERE department_code = 'ENV'), 3, 'compulsory', 'Calculus and statistics', 'semester_1'),
  ('FOR101', 'Introduction to Forestry', (SELECT id FROM departments WHERE department_code = 'FOR'), 3, 'compulsory', 'Forest ecosystems and management', 'semester_1'),
  ('AGR101', 'Introduction to Agriculture', (SELECT id FROM departments WHERE department_code = 'AGR'), 3, 'compulsory', 'Agricultural systems and practices', 'semester_1'),
  ('MAR101', 'Introduction to Marine Biology', (SELECT id FROM departments WHERE department_code = 'MAR'), 3, 'compulsory', 'Marine organisms and ecosystems', 'semester_1');

-- Insert fee structure for current semester
INSERT INTO fee_structures (program_id, semester_id, tuition_fee, lodging_fee, messing_fee, ict_levy, student_services_fee, effective_date)
SELECT
  p.id,
  s.id,
  3000.00,
  800.00,
  500.00,
  100.00,
  100.00,
  '2025-01-01'
FROM programs p
CROSS JOIN semesters s
WHERE s.is_current = true;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'UNRE Database setup completed successfully!';
  RAISE NOTICE 'Created 18 tables, indexes, triggers, and RLS policies';
  RAISE NOTICE 'Inserted seed data for departments, programs, courses, and fee structures';
END $$;
