-- ============================================================================
-- UNRE REGISTRATION SYSTEM - ROW LEVEL SECURITY POLICIES
-- ============================================================================
-- Purpose: Secure all database tables with role-based access control
-- Date: December 6, 2025
-- IMPORTANT: Run this script to protect your data immediately
-- ============================================================================

-- ============================================================================
-- STEP 1: ENABLE RLS ON ALL TABLES
-- ============================================================================

-- Core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Academic tables
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;

-- Supporting tables
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 2: PUBLIC READ ACCESS (Reference Data)
-- ============================================================================

-- Anyone can read programs, courses, departments (for application form)
CREATE POLICY "Public read programs" ON programs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read courses" ON courses
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public read departments" ON departments
  FOR SELECT USING (true);

CREATE POLICY "Public read campuses" ON campuses
  FOR SELECT USING (true);

CREATE POLICY "Public read provinces" ON provinces
  FOR SELECT USING (true);

CREATE POLICY "Public read fee_structures" ON fee_structures
  FOR SELECT USING (true);

CREATE POLICY "Public read semesters" ON semesters
  FOR SELECT USING (true);

-- ============================================================================
-- STEP 3: STUDENT POLICIES (Own Data Only)
-- ============================================================================

-- Students can view their own user record
CREATE POLICY "Students view own user record" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students update own user record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Students can view and update their own student record
CREATE POLICY "Students view own student record" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students update own student record" ON students
  FOR UPDATE USING (auth.uid() = id);

-- Students can view their own applications
CREATE POLICY "Students view own applications" ON applications
  FOR SELECT USING (
    auth.email() = applicant_email
  );

-- Students can create applications (before they have a student account)
CREATE POLICY "Anyone can create applications" ON applications
  FOR INSERT WITH CHECK (true);

-- Students can view their own enrollments
CREATE POLICY "Students view own enrollments" ON student_enrollments
  FOR SELECT USING (auth.uid() = student_id);

-- Students can create their own enrollment
CREATE POLICY "Students create own enrollment" ON student_enrollments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their own enrollment (if not yet approved)
CREATE POLICY "Students update own enrollment" ON student_enrollments
  FOR UPDATE USING (
    auth.uid() = student_id AND
    approval_status != 'approved'
  );

-- Students can view their own course registrations
CREATE POLICY "Students view own course registrations" ON course_registrations
  FOR SELECT USING (auth.uid() = student_id);

-- Students can create their own course registrations
CREATE POLICY "Students create course registrations" ON course_registrations
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Students can update their own course registrations (if not approved)
CREATE POLICY "Students update course registrations" ON course_registrations
  FOR UPDATE USING (
    auth.uid() = student_id AND
    status != 'approved'
  );

-- Students can delete their own course registrations (if not approved)
CREATE POLICY "Students delete course registrations" ON course_registrations
  FOR DELETE USING (
    auth.uid() = student_id AND
    status != 'approved'
  );

-- Students can view their own invoices
CREATE POLICY "Students view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = student_id);

-- Students can view their own payments
CREATE POLICY "Students view own payments" ON payments
  FOR SELECT USING (auth.uid() = student_id);

-- Students can view their own notifications
CREATE POLICY "Students view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 4: ADMISSIONS STAFF POLICIES
-- ============================================================================

-- Admissions can view all applications
CREATE POLICY "Admissions view all applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admissions', 'registrar', 'ict_admin')
    )
  );

-- Admissions can update applications (approve/reject)
CREATE POLICY "Admissions update applications" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admissions', 'registrar', 'ict_admin')
    )
  );

-- Admissions can create student records from approved applications
CREATE POLICY "Admissions create students" ON students
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admissions', 'registrar', 'ict_admin')
    )
  );

-- Admissions can view all students
CREATE POLICY "Admissions view all students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admissions', 'registrar', 'ict_admin')
    )
  );

-- ============================================================================
-- STEP 5: REGISTRAR POLICIES
-- ============================================================================

-- Registrar can view all enrollments
CREATE POLICY "Registrar view all enrollments" ON student_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

-- Registrar can approve/update enrollments
CREATE POLICY "Registrar update enrollments" ON student_enrollments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

-- Registrar can view all course registrations
CREATE POLICY "Registrar view course registrations" ON course_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

-- Registrar can approve course registrations
CREATE POLICY "Registrar update course registrations" ON course_registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

-- Registrar can update student records
CREATE POLICY "Registrar update students" ON students
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

-- ============================================================================
-- STEP 6: FINANCE STAFF POLICIES
-- ============================================================================

-- Finance can view all students (for billing)
CREATE POLICY "Finance view all students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

-- Finance can view all invoices
CREATE POLICY "Finance view all invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

-- Finance can create invoices
CREATE POLICY "Finance create invoices" ON invoices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

-- Finance can update invoices
CREATE POLICY "Finance update invoices" ON invoices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

-- Finance can view all payments
CREATE POLICY "Finance view all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

-- Finance can create payments
CREATE POLICY "Finance create payments" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

-- Finance can update payments
CREATE POLICY "Finance update payments" ON payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

-- Finance can manage fee structures
CREATE POLICY "Finance update fee_structures" ON fee_structures
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

CREATE POLICY "Finance create fee_structures" ON fee_structures
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

-- ============================================================================
-- STEP 7: ICT ADMIN POLICIES (Full Access)
-- ============================================================================

-- ICT Admin can do everything
CREATE POLICY "ICT Admin full access users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ict_admin'
    )
  );

CREATE POLICY "ICT Admin manage programs" ON programs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ict_admin'
    )
  );

CREATE POLICY "ICT Admin manage courses" ON courses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ict_admin'
    )
  );

CREATE POLICY "ICT Admin manage departments" ON departments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ict_admin'
    )
  );

CREATE POLICY "ICT Admin manage semesters" ON semesters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ict_admin'
    )
  );

CREATE POLICY "ICT Admin manage campuses" ON campuses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ict_admin'
    )
  );

CREATE POLICY "ICT Admin manage system_settings" ON system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'ict_admin'
    )
  );

-- ============================================================================
-- STEP 8: NOTIFICATION POLICIES
-- ============================================================================

-- Staff can create notifications for students
CREATE POLICY "Staff create notifications" ON notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'admissions', 'finance', 'ict_admin')
    )
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
    policy_count integer;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public';

    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ ROW LEVEL SECURITY ENABLED!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Total policies created: %', policy_count;
    RAISE NOTICE '==============================================';
    RAISE NOTICE '🔒 Your data is now protected!';
    RAISE NOTICE '';
    RAISE NOTICE 'Access Rules:';
    RAISE NOTICE '  ✓ Students: Can only access their own data';
    RAISE NOTICE '  ✓ Admissions: Can manage applications & students';
    RAISE NOTICE '  ✓ Registrar: Can manage enrollments & courses';
    RAISE NOTICE '  ✓ Finance: Can manage invoices & payments';
    RAISE NOTICE '  ✓ ICT Admin: Full system access';
    RAISE NOTICE '  ✓ Public: Can view programs, courses for application';
    RAISE NOTICE '==============================================';
END $$;
