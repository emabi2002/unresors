-- ============================================================================
-- UNRE REGISTRATION SYSTEM - ROW LEVEL SECURITY POLICIES (FIXED)
-- ============================================================================
-- Purpose: Secure all database tables with role-based access control
-- Date: December 6, 2025
-- FIXED: Column name issues resolved
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP EXISTING POLICIES (If Any)
-- ============================================================================

-- Drop policies if they exist (prevents duplicate errors)
DROP POLICY IF EXISTS "Public read programs" ON programs;
DROP POLICY IF EXISTS "Public read courses" ON courses;
DROP POLICY IF EXISTS "Public read departments" ON departments;
DROP POLICY IF EXISTS "Public read campuses" ON campuses;
DROP POLICY IF EXISTS "Public read provinces" ON provinces;
DROP POLICY IF EXISTS "Public read fee_structures" ON fee_structures;
DROP POLICY IF EXISTS "Public read semesters" ON semesters;
DROP POLICY IF EXISTS "Students view own user record" ON users;
DROP POLICY IF EXISTS "Students update own user record" ON users;
DROP POLICY IF EXISTS "Students view own student record" ON students;
DROP POLICY IF EXISTS "Students update own student record" ON students;
DROP POLICY IF EXISTS "Students view own applications" ON applications;
DROP POLICY IF EXISTS "Anyone can create applications" ON applications;
DROP POLICY IF EXISTS "Students view own enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Students create own enrollment" ON student_enrollments;
DROP POLICY IF EXISTS "Students update own enrollment" ON student_enrollments;
DROP POLICY IF EXISTS "Students view own course registrations" ON course_registrations;
DROP POLICY IF EXISTS "Students create course registrations" ON course_registrations;
DROP POLICY IF EXISTS "Students update course registrations" ON course_registrations;
DROP POLICY IF EXISTS "Students delete course registrations" ON course_registrations;
DROP POLICY IF EXISTS "Students view own invoices" ON invoices;
DROP POLICY IF EXISTS "Students view own payments" ON payments;
DROP POLICY IF EXISTS "Students view own notifications" ON notifications;
DROP POLICY IF EXISTS "Students update own notifications" ON notifications;
DROP POLICY IF EXISTS "Admissions view all applications" ON applications;
DROP POLICY IF EXISTS "Admissions update applications" ON applications;
DROP POLICY IF EXISTS "Admissions create students" ON students;
DROP POLICY IF EXISTS "Admissions view all students" ON students;
DROP POLICY IF EXISTS "Registrar view all enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Registrar update enrollments" ON student_enrollments;
DROP POLICY IF EXISTS "Registrar view course registrations" ON course_registrations;
DROP POLICY IF EXISTS "Registrar update course registrations" ON course_registrations;
DROP POLICY IF EXISTS "Registrar update students" ON students;
DROP POLICY IF EXISTS "Finance view all students" ON students;
DROP POLICY IF EXISTS "Finance view all invoices" ON invoices;
DROP POLICY IF EXISTS "Finance create invoices" ON invoices;
DROP POLICY IF EXISTS "Finance update invoices" ON invoices;
DROP POLICY IF EXISTS "Finance view all payments" ON payments;
DROP POLICY IF EXISTS "Finance create payments" ON payments;
DROP POLICY IF EXISTS "Finance update payments" ON payments;
DROP POLICY IF EXISTS "Finance update fee_structures" ON fee_structures;
DROP POLICY IF EXISTS "Finance create fee_structures" ON fee_structures;
DROP POLICY IF EXISTS "ICT Admin full access users" ON users;
DROP POLICY IF EXISTS "ICT Admin manage programs" ON programs;
DROP POLICY IF EXISTS "ICT Admin manage courses" ON courses;
DROP POLICY IF EXISTS "ICT Admin manage departments" ON departments;
DROP POLICY IF EXISTS "ICT Admin manage semesters" ON semesters;
DROP POLICY IF EXISTS "ICT Admin manage campuses" ON campuses;
DROP POLICY IF EXISTS "ICT Admin manage system_settings" ON system_settings;
DROP POLICY IF EXISTS "Staff create notifications" ON notifications;

-- ============================================================================
-- STEP 2: ENABLE RLS ON ALL TABLES
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
-- STEP 3: PUBLIC READ ACCESS (Reference Data for Application Form)
-- ============================================================================

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
-- STEP 4: STUDENT POLICIES
-- ============================================================================

-- Students can view/update their own user record
CREATE POLICY "Students view own user record" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students update own user record" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Students can view/update their own student record
CREATE POLICY "Students view own student record" ON students
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students update own student record" ON students
  FOR UPDATE USING (auth.uid() = id);

-- Students can view their own applications (using applicant_email)
CREATE POLICY "Students view own applications" ON applications
  FOR SELECT USING (auth.email() = applicant_email);

-- Anyone can create applications (for new student applications)
CREATE POLICY "Anyone can create applications" ON applications
  FOR INSERT WITH CHECK (true);

-- Students can view/create/update their own enrollments
CREATE POLICY "Students view own enrollments" ON student_enrollments
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students create own enrollment" ON student_enrollments
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students update own enrollment" ON student_enrollments
  FOR UPDATE USING (
    auth.uid() = student_id AND
    (status IS NULL OR status = 'pending_approval')
  );

-- Students can manage their own course registrations
CREATE POLICY "Students view own course registrations" ON course_registrations
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students create course registrations" ON course_registrations
  FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students update course registrations" ON course_registrations
  FOR UPDATE USING (
    auth.uid() = student_id AND
    status IN ('pending_advisor', 'pending_registrar')
  );

CREATE POLICY "Students delete course registrations" ON course_registrations
  FOR DELETE USING (
    auth.uid() = student_id AND
    status = 'pending_advisor'
  );

-- Students can view their own invoices and payments
CREATE POLICY "Students view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students view own payments" ON payments
  FOR SELECT USING (auth.uid() = student_id);

-- Students can view/update their own notifications
CREATE POLICY "Students view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- STEP 5: ADMISSIONS STAFF POLICIES
-- ============================================================================

CREATE POLICY "Admissions view all applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admissions', 'registrar', 'ict_admin')
    )
  );

CREATE POLICY "Admissions update applications" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admissions', 'registrar', 'ict_admin')
    )
  );

CREATE POLICY "Admissions create students" ON students
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admissions', 'registrar', 'ict_admin')
    )
  );

CREATE POLICY "Admissions view all students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('admissions', 'registrar', 'ict_admin')
    )
  );

-- ============================================================================
-- STEP 6: REGISTRAR POLICIES
-- ============================================================================

CREATE POLICY "Registrar view all enrollments" ON student_enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

CREATE POLICY "Registrar update enrollments" ON student_enrollments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

CREATE POLICY "Registrar view course registrations" ON course_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

CREATE POLICY "Registrar update course registrations" ON course_registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

CREATE POLICY "Registrar update students" ON students
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'ict_admin')
    )
  );

-- ============================================================================
-- STEP 7: FINANCE STAFF POLICIES
-- ============================================================================

CREATE POLICY "Finance view all students" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

CREATE POLICY "Finance view all invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

CREATE POLICY "Finance create invoices" ON invoices
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

CREATE POLICY "Finance update invoices" ON invoices
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

CREATE POLICY "Finance view all payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

CREATE POLICY "Finance create payments" ON payments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

CREATE POLICY "Finance update payments" ON payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  );

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
-- STEP 8: ICT ADMIN POLICIES (Full Access)
-- ============================================================================

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
-- STEP 9: NOTIFICATION POLICIES
-- ============================================================================

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
