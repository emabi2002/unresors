-- UNRE EXTENDED SCHEMA - PART 1: ENUM VALUES ONLY
-- Run this FIRST, then run part 2 after this completes

-- ============================================
-- ADD NEW USER ROLES TO EXISTING ENUM
-- ============================================
-- These must be committed before they can be used
-- That's why this is in a separate script!

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'student_services'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'student_services';
    RAISE NOTICE 'Added user_role: student_services';
  ELSE
    RAISE NOTICE 'user_role student_services already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'clinic_staff'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'clinic_staff';
    RAISE NOTICE 'Added user_role: clinic_staff';
  ELSE
    RAISE NOTICE 'user_role clinic_staff already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'librarian'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'librarian';
    RAISE NOTICE 'Added user_role: librarian';
  ELSE
    RAISE NOTICE 'user_role librarian already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'pr_staff'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'pr_staff';
    RAISE NOTICE 'Added user_role: pr_staff';
  ELSE
    RAISE NOTICE 'user_role pr_staff already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'bookshop_staff'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'bookshop_staff';
    RAISE NOTICE 'Added user_role: bookshop_staff';
  ELSE
    RAISE NOTICE 'user_role bookshop_staff already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'user_role' AND e.enumlabel = 'counselor'
  ) THEN
    ALTER TYPE user_role ADD VALUE 'counselor';
    RAISE NOTICE 'Added user_role: counselor';
  ELSE
    RAISE NOTICE 'user_role counselor already exists';
  END IF;
END $$;

-- ============================================
-- CREATE NEW ENUM TYPES
-- ============================================

DO $$ BEGIN
  CREATE TYPE service_request_type AS ENUM (
    'welfare', 'counseling', 'accommodation', 'personal_issue',
    'student_affairs', 'complaint', 'other'
  );
  RAISE NOTICE 'Created enum: service_request_type';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum service_request_type already exists';
END $$;

DO $$ BEGIN
  CREATE TYPE service_request_status AS ENUM (
    'submitted', 'in_progress', 'pending_student',
    'resolved', 'closed', 'escalated'
  );
  RAISE NOTICE 'Created enum: service_request_status';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum service_request_status already exists';
END $$;

DO $$ BEGIN
  CREATE TYPE service_request_priority AS ENUM ('low', 'medium', 'high', 'urgent');
  RAISE NOTICE 'Created enum: service_request_priority';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum service_request_priority already exists';
END $$;

DO $$ BEGIN
  CREATE TYPE clinic_visit_type AS ENUM (
    'medical', 'counseling', 'welfare_assessment', 'follow_up', 'emergency'
  );
  RAISE NOTICE 'Created enum: clinic_visit_type';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum clinic_visit_type already exists';
END $$;

DO $$ BEGIN
  CREATE TYPE library_item_type AS ENUM (
    'book', 'journal', 'thesis', 'multimedia', 'equipment'
  );
  RAISE NOTICE 'Created enum: library_item_type';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum library_item_type already exists';
END $$;

DO $$ BEGIN
  CREATE TYPE library_transaction_status AS ENUM (
    'borrowed', 'returned', 'overdue', 'lost', 'damaged'
  );
  RAISE NOTICE 'Created enum: library_transaction_status';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum library_transaction_status already exists';
END $$;

DO $$ BEGIN
  CREATE TYPE id_card_status AS ENUM (
    'active', 'suspended', 'lost', 'replaced', 'expired', 'revoked'
  );
  RAISE NOTICE 'Created enum: id_card_status';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum id_card_status already exists';
END $$;

DO $$ BEGIN
  CREATE TYPE laptop_status AS ENUM (
    'available', 'issued', 'in_setup', 'configured',
    'returned', 'damaged', 'lost'
  );
  RAISE NOTICE 'Created enum: laptop_status';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum laptop_status already exists';
END $$;

DO $$ BEGIN
  CREATE TYPE clearance_department AS ENUM (
    'student_services', 'clinic', 'library', 'finance',
    'academic_department', 'public_relations', 'ict_services',
    'hostel', 'security', 'bookshop'
  );
  RAISE NOTICE 'Created enum: clearance_department';
EXCEPTION WHEN duplicate_object THEN
  RAISE NOTICE 'enum clearance_department already exists';
END $$;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ PART 1 COMPLETE!';
  RAISE NOTICE '✅ Added 6 new user roles';
  RAISE NOTICE '✅ Created 9 new enum types';
  RAISE NOTICE '========================================';
  RAISE NOTICE '⏭️  NEXT: Run extended-schema-part2-tables.sql';
  RAISE NOTICE '========================================';
END $$;
