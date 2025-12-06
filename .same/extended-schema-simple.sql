-- SIMPLIFIED VERSION: UNRE Extended Database Schema
-- Run this if the main extended-database-schema.sql has enum issues

-- STEP 1: Add new enum values to user_role (run these one at a time if needed)
-- Skip if value already exists (will show error if exists, that's okay)

ALTER TYPE user_role ADD VALUE 'student_services';
ALTER TYPE user_role ADD VALUE 'clinic_staff';
ALTER TYPE user_role ADD VALUE 'librarian';
ALTER TYPE user_role ADD VALUE 'pr_staff';
ALTER TYPE user_role ADD VALUE 'bookshop_staff';
ALTER TYPE user_role ADD VALUE 'counselor';

-- STEP 2: Create all other enum types

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

-- Continue with rest of the schema from extended-database-schema.sql...
-- Copy the table creation sections from the main file

-- If you see "already exists" errors, that's normal - it means it's already created
-- Just continue with the next statement
