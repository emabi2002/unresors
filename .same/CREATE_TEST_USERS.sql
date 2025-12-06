-- ============================================================================
-- CREATE TEST USERS - UNRE Registration System
-- ============================================================================
-- Purpose: Create test user accounts for each role in the system
-- IMPORTANT: These users must first be created in Supabase Auth UI
-- Date: December 6, 2025
-- ============================================================================

-- ============================================================================
-- INSTRUCTIONS:
-- ============================================================================
-- 1. First, create these users in Supabase Dashboard > Authentication > Users:
--    - Click "Add User" for each email below
--    - Set temporary password (users will change on first login)
--    - Copy the UUID generated for each user
--
-- 2. Then run this script to assign roles and create profiles
-- ============================================================================

-- ============================================================================
-- STEP 1: UPDATE USER ROLES
-- ============================================================================
-- Replace the UUIDs below with actual UUIDs from Supabase Auth

-- Test Student
UPDATE users
SET
  role = 'student',
  full_name = 'Test Student',
  updated_at = NOW()
WHERE email = 'test.student@student.unre.ac.pg';

-- Test Registrar
UPDATE users
SET
  role = 'registrar',
  full_name = 'Registrar User',
  updated_at = NOW()
WHERE email = 'registrar@unre.ac.pg';

-- Test Admissions Officer
UPDATE users
SET
  role = 'admissions',
  full_name = 'Admissions Officer',
  updated_at = NOW()
WHERE email = 'admissions@unre.ac.pg';

-- Test Finance Officer
UPDATE users
SET
  role = 'finance',
  full_name = 'Finance Officer',
  updated_at = NOW()
WHERE email = 'finance@unre.ac.pg';

-- Test ICT Admin
UPDATE users
SET
  role = 'ict_admin',
  full_name = 'ICT Administrator',
  updated_at = NOW()
WHERE email = 'ict@unre.ac.pg';

-- ============================================================================
-- STEP 2: CREATE TEST STUDENT PROFILE
-- ============================================================================

DO $$
DECLARE
    test_student_id uuid;
    agri_program_id uuid;
    vudal_campus_id uuid;
    current_sem_id uuid;
    enb_province_id uuid;
BEGIN
    -- Get the test student user ID
    SELECT id INTO test_student_id
    FROM users
    WHERE email = 'test.student@student.unre.ac.pg';

    IF test_student_id IS NULL THEN
        RAISE NOTICE '❌ Test student user not found. Please create user in Supabase Auth first.';
        RETURN;
    END IF;

    -- Get program, campus, province, and semester IDs
    SELECT id INTO agri_program_id FROM programs WHERE program_code = 'AGRI-BSC';
    SELECT id INTO vudal_campus_id FROM campuses WHERE campus_code = 'VUDAL';
    SELECT id INTO current_sem_id FROM semesters WHERE year = 2025 AND semester = 'semester_1';
    SELECT id INTO enb_province_id FROM provinces WHERE province_code = 'ENB';

    -- Create student profile
    INSERT INTO students (
        id,
        student_id,
        program_id,
        enrollment_year,
        enrollment_semester,
        current_year,
        current_semester,
        status,
        campus_id,
        home_province_id,
        residing_province_id,
        residential_status,
        marital_status,
        religion,
        slf_number,
        next_of_kin,
        next_of_kin_relationship,
        next_of_kin_contact,
        secondary_school,
        created_at
    ) VALUES (
        test_student_id,
        'STU-001234',  -- Test student ID
        agri_program_id,
        2025,
        'semester_1',
        1,
        'semester_1',
        'active',
        vudal_campus_id,
        enb_province_id,
        enb_province_id,
        'residential',
        'single',
        'christian',
        'SLF-2025-1234',
        'John Doe Sr.',
        'father',
        '+675 7234 5678',
        'Rabaul High School',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        student_id = EXCLUDED.student_id,
        program_id = EXCLUDED.program_id,
        enrollment_year = EXCLUDED.enrollment_year,
        status = EXCLUDED.status;

    RAISE NOTICE '✅ Test student profile created: STU-001234';

    -- Create a test enrollment for the student
    INSERT INTO student_enrollments (
        student_id,
        program_id,
        semester_id,
        year_level,
        enrollment_type,
        enrollment_status,
        approval_status,
        home_province,
        secondary_school,
        created_at
    ) VALUES (
        test_student_id,
        agri_program_id,
        current_sem_id,
        1,
        'new',
        'enrolled',
        'approved',
        'East New Britain',
        'Rabaul High School',
        NOW()
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ Test enrollment created for Semester 1, 2025';

    -- Register test student for some Year 1 Agriculture courses
    INSERT INTO course_registrations (student_id, course_id, semester_id, status, advisor_approved, registrar_approved)
    SELECT
        test_student_id,
        c.id,
        current_sem_id,
        'approved',
        true,
        true
    FROM courses c
    WHERE c.course_code IN ('AGRI101', 'AGRI102', 'AGRI103', 'CHEM101', 'MATH101', 'ENG101')
    AND c.semester_offered = 'semester_1'
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ Test course registrations created (6 courses, 18 credits)';

    -- Create invoice for test student
    INSERT INTO invoices (
        student_id,
        semester_id,
        invoice_number,
        invoice_date,
        due_date,
        total_amount,
        amount_paid,
        balance,
        status,
        line_items
    ) VALUES (
        test_student_id,
        current_sem_id,
        'INV-2025-001234',
        NOW(),
        NOW() + INTERVAL '30 days',
        9625.70,  -- Full residential fees
        5000.00,  -- Partial payment made
        4625.70,  -- Balance remaining
        'partially_paid',
        jsonb_build_array(
            jsonb_build_object('description', 'Tuition Fee', 'amount', 2140.00),
            jsonb_build_object('description', 'Compulsory Fees', 'amount', 1209.10),
            jsonb_build_object('description', 'Boarding & Lodging', 'amount', 6276.60)
        )
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ Test invoice created (K 9,625.70, K 5,000 paid, K 4,625.70 balance)';

    -- Create a payment record
    INSERT INTO payments (
        student_id,
        invoice_id,
        payment_date,
        amount,
        payment_method,
        reference_number,
        receipt_number,
        status
    )
    SELECT
        test_student_id,
        i.id,
        NOW() - INTERVAL '7 days',
        5000.00,
        'bank_transfer',
        'BSP-2025-12345',
        'REC-2025-001234',
        'confirmed'
    FROM invoices i
    WHERE i.invoice_number = 'INV-2025-001234'
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ Test payment created (K 5,000 bank transfer)';

    -- Create welcome notification
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        is_read,
        created_at
    ) VALUES (
        test_student_id,
        'Welcome to UNRE!',
        'Your student account has been created. Student ID: STU-001234. Please complete your enrollment for Semester 1, 2025.',
        'info',
        false,
        NOW()
    ),
    (
        test_student_id,
        'Course Registration Approved',
        'Your course registration for Semester 1 has been approved. You are registered for 6 courses (18 credits).',
        'success',
        false,
        NOW() - INTERVAL '1 day'
    ),
    (
        test_student_id,
        'Payment Received',
        'Thank you! We have received your payment of K 5,000.00. Remaining balance: K 4,625.70.',
        'info',
        true,
        NOW() - INTERVAL '7 days'
    )
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ Test notifications created (3 notifications)';

END $$;

-- ============================================================================
-- STEP 3: VERIFICATION
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ TEST USERS SETUP COMPLETE!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Test Accounts Created:';
    RAISE NOTICE '';
    RAISE NOTICE '👤 STUDENT:';
    RAISE NOTICE '   Email: test.student@student.unre.ac.pg';
    RAISE NOTICE '   Student ID: STU-001234';
    RAISE NOTICE '   Program: Agriculture (AGRI-BSC)';
    RAISE NOTICE '   Courses: 6 registered (18 credits)';
    RAISE NOTICE '   Fees: K 9,625.70 (K 5,000 paid, K 4,625.70 balance)';
    RAISE NOTICE '';
    RAISE NOTICE '👔 REGISTRAR:';
    RAISE NOTICE '   Email: registrar@unre.ac.pg';
    RAISE NOTICE '   Access: Enrollments, Course Registrations';
    RAISE NOTICE '';
    RAISE NOTICE '📋 ADMISSIONS:';
    RAISE NOTICE '   Email: admissions@unre.ac.pg';
    RAISE NOTICE '   Access: Applications, Student Records';
    RAISE NOTICE '';
    RAISE NOTICE '💰 FINANCE:';
    RAISE NOTICE '   Email: finance@unre.ac.pg';
    RAISE NOTICE '   Access: Invoices, Payments, Fee Structures';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 ICT ADMIN:';
    RAISE NOTICE '   Email: ict@unre.ac.pg';
    RAISE NOTICE '   Access: Full System Administration';
    RAISE NOTICE '';
    RAISE NOTICE '==============================================';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Log in with each test account';
    RAISE NOTICE '2. Test workflows in each portal';
    RAISE NOTICE '3. Verify RLS policies are working';
    RAISE NOTICE '==============================================';
END $$;

-- ============================================================================
-- QUICK VERIFICATION QUERIES
-- ============================================================================

-- Check test student profile
SELECT
    u.email,
    u.role,
    s.student_id,
    p.program_code,
    p.program_name,
    s.status,
    s.residential_status
FROM users u
JOIN students s ON u.id = s.id
JOIN programs p ON s.program_id = p.id
WHERE u.email = 'test.student@student.unre.ac.pg';

-- Check test student courses
SELECT
    c.course_code,
    c.course_name,
    cr.credits,
    cr.status
FROM course_registrations cr
JOIN courses c ON cr.course_id = c.id
JOIN users u ON cr.student_id = u.id
WHERE u.email = 'test.student@student.unre.ac.pg';

-- Check test student invoice
SELECT
    i.invoice_number,
    i.total_amount,
    i.amount_paid,
    i.balance,
    i.status
FROM invoices i
JOIN users u ON i.student_id = u.id
WHERE u.email = 'test.student@student.unre.ac.pg';

-- Check all staff accounts
SELECT
    email,
    role,
    full_name,
    created_at
FROM users
WHERE role IN ('registrar', 'admissions', 'finance', 'ict_admin')
ORDER BY role;
