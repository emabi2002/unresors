-- ============================================================================
-- SIMPLE TEST ADMIN - Works with actual schema
-- ============================================================================

DO $$
DECLARE
    test_id uuid := 'a0000000-0000-0000-0000-000000000001';
    agri_id uuid;
    vudal_id uuid;
    sem_id uuid;
    enb_id uuid;
BEGIN
    -- Get IDs
    SELECT id INTO agri_id FROM programs WHERE program_code = 'AGRI-BSC' LIMIT 1;
    SELECT id INTO vudal_id FROM campuses WHERE campus_code = 'VUDAL' LIMIT 1;
    SELECT id INTO sem_id FROM semesters WHERE year = 2025 AND semester = 'semester_1' LIMIT 1;
    SELECT id INTO enb_id FROM provinces WHERE province_code = 'ENB' LIMIT 1;

    -- Delete if exists
    DELETE FROM students WHERE id = test_id;
    DELETE FROM users WHERE id = test_id;

    -- Create user in public.users table
    INSERT INTO users (id, email, role, first_name, last_name, phone)
    VALUES (test_id, 'admin.test@unre.ac.pg', 'ict_admin', 'Test', 'Admin', '+675 7000 0001');

    -- Create student
    INSERT INTO students (
        id, student_id, date_of_birth, gender, nationality, national_id,
        program_id, enrollment_year, enrollment_semester, student_type
    ) VALUES (
        test_id, 'TEST-ADMIN-001', '2000-01-01', 'male', 'Papua New Guinean',
        'TEST-12345', agri_id, 2025, 'semester_1', 'new'
    );

    -- Create enrollment
    INSERT INTO student_enrollments (
        student_id, academic_year, semester, program_code, level, status
    ) VALUES (
        test_id, 2025, 'Semester 1', 'AGRI-BSC', 'Year 1', 'approved'
    );

    -- Create courses
    INSERT INTO course_registrations (student_id, course_id, semester_id, status, advisor_approved, registrar_approved)
    SELECT test_id, c.id, sem_id, 'approved', true, true
    FROM courses c
    WHERE c.course_code IN ('AGRI101', 'AGRI102', 'AGRI103', 'CHEM101', 'MATH101', 'ENG101')
    AND c.semester_offered = 'semester_1';

    -- Create invoice
    INSERT INTO invoices (
        student_id, semester_id, invoice_number, issue_date, due_date,
        total_amount, amount_paid, balance, status, fee_breakdown
    ) VALUES (
        test_id, sem_id, 'INV-TEST-001', NOW(), (NOW() + INTERVAL '30 days')::date,
        9625.70, 0, 9625.70, 'pending',
        '{"tuition": 2140, "compulsory": 1209.10, "boarding": 6276.60}'::jsonb
    );

    RAISE NOTICE '✅ TEST ADMIN CREATED: TEST-ADMIN-001';
    RAISE NOTICE '✅ Email: admin.test@unre.ac.pg';
    RAISE NOTICE '✅ Fees: K 9,625.70';

END $$;
