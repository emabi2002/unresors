-- ============================================================================
-- CREATE TEST ADMIN ACCOUNT - For System Testing
-- ============================================================================
-- Purpose: Create one test account that can access and test all features
-- No authentication required - for development testing only
-- ============================================================================

-- First, let's create a test user in the users table
-- We'll use a fixed UUID so we can reference it easily

DO $$
DECLARE
    test_admin_id uuid := 'a0000000-0000-0000-0000-000000000001'; -- Fixed UUID for testing
    agri_program_id uuid;
    vudal_campus_id uuid;
    current_sem_id uuid;
    enb_province_id uuid;
BEGIN
    -- Delete existing test admin if exists
    DELETE FROM students WHERE id = test_admin_id;
    DELETE FROM users WHERE id = test_admin_id;

    -- Create test admin user
    INSERT INTO users (
        id,
        email,
        role,
        first_name,
        last_name,
        phone,
        created_at
    ) VALUES (
        test_admin_id,
        'admin.test@unre.ac.pg',
        'ict_admin',
        'Test',
        'Administrator',
        '+675 7000 0001',
        NOW()
    );

    RAISE NOTICE '✅ Test admin user created: admin.test@unre.ac.pg';

    -- Get reference IDs
    SELECT id INTO agri_program_id FROM programs WHERE program_code = 'AGRI-BSC' LIMIT 1;
    SELECT id INTO vudal_campus_id FROM campuses WHERE campus_code = 'VUDAL' LIMIT 1;
    SELECT id INTO current_sem_id FROM semesters WHERE year = 2025 AND semester = 'semester_1' LIMIT 1;
    SELECT id INTO enb_province_id FROM provinces WHERE province_code = 'ENB' LIMIT 1;

    -- Create student profile for test admin
    INSERT INTO students (
        id,
        student_id,
        date_of_birth,
        gender,
        nationality,
        national_id,
        program_id,
        enrollment_year,
        enrollment_semester,
        student_type,
        campus_id,
        home_province_id,
        residing_province_id,
        residential_status,
        marital_status,
        religion,
        next_of_kin,
        next_of_kin_relationship,
        next_of_kin_contact,
        secondary_school
    ) VALUES (
        test_admin_id,
        'TEST-ADMIN-001',
        '2000-01-01',
        'male',
        'Papua New Guinean',
        'TEST-ID-12345678',
        agri_program_id,
        2025,
        'semester_1',
        'new',
        vudal_campus_id,
        enb_province_id,
        enb_province_id,
        'residential',
        'single',
        'christian',
        'Test Parent',
        'parent',
        '+675 7000 0001',
        'Test High School'
    );

    RAISE NOTICE '✅ Test student profile created: TEST-ADMIN-001';

    -- Create enrollment for test admin
    INSERT INTO student_enrollments (
        student_id,
        academic_year,
        semester,
        program_code,
        level,
        status,
        declaration_agreed,
        registration_date
    ) VALUES (
        test_admin_id,
        2025,
        'Semester 1',
        'AGRI-BSC',
        'Year 1',
        'approved',
        true,
        NOW()
    );

    RAISE NOTICE '✅ Test enrollment created';

    -- Register test admin for Year 1 Agriculture courses
    INSERT INTO course_registrations (student_id, course_id, semester_id, status, advisor_approved, registrar_approved)
    SELECT
        test_admin_id,
        c.id,
        current_sem_id,
        'approved',
        true,
        true
    FROM courses c
    WHERE c.course_code IN ('AGRI101', 'AGRI102', 'AGRI103', 'CHEM101', 'MATH101', 'ENG101')
    AND c.semester_offered = 'semester_1'
    ON CONFLICT DO NOTHING;

    RAISE NOTICE '✅ Test courses registered: 6 courses (18 credits)';

    -- Create invoice for test admin
    INSERT INTO invoices (
        student_id,
        semester_id,
        invoice_number,
        issue_date,
        due_date,
        total_amount,
        amount_paid,
        balance,
        status,
        fee_breakdown
    ) VALUES (
        test_admin_id,
        current_sem_id,
        'INV-TEST-ADMIN-001',
        NOW(),
        (NOW() + INTERVAL '30 days')::date,
        9625.70,
        0.00,
        9625.70,
        'pending',
        jsonb_build_object(
            'tuition', 2140.00,
            'compulsory', 1209.10,
            'boarding', 6276.60
        )
    )
    ON CONFLICT (invoice_number) DO NOTHING;

    RAISE NOTICE '✅ Test invoice created: K 9,625.70';

    RAISE NOTICE '';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ TEST ADMIN ACCOUNT CREATED!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Test Account Details:';
    RAISE NOTICE '  Email: admin.test@unre.ac.pg';
    RAISE NOTICE '  Student ID: TEST-ADMIN-001';
    RAISE NOTICE '  Program: Agriculture (AGRI-BSC)';
    RAISE NOTICE '  Role: ICT Admin (can access everything)';
    RAISE NOTICE '  UUID: a0000000-0000-0000-0000-000000000001';
    RAISE NOTICE '';
    RAISE NOTICE 'What This Account Has:';
    RAISE NOTICE '  ✓ Student profile';
    RAISE NOTICE '  ✓ Enrollment record';
    RAISE NOTICE '  ✓ 6 courses registered (18 credits)';
    RAISE NOTICE '  ✓ Invoice: K 9,625.70';
    RAISE NOTICE '';
    RAISE NOTICE 'Use This Account To Test:';
    RAISE NOTICE '  ✓ Enrollment form';
    RAISE NOTICE '  ✓ Course registration';
    RAISE NOTICE '  ✓ Payment processing';
    RAISE NOTICE '  ✓ All dashboards';
    RAISE NOTICE '==============================================';

END $$;

-- Verification queries
SELECT
    u.email,
    u.role,
    s.student_id,
    p.program_code,
    s.status as student_status
FROM users u
JOIN students s ON u.id = s.id
JOIN programs p ON s.program_id = p.id
WHERE u.email = 'admin.test@unre.ac.pg';
