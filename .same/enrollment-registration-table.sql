-- Create student_enrollments table for Registration of Enrollment form
-- This table stores the comprehensive enrollment registration data

CREATE TABLE IF NOT EXISTS student_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Academic Information
  academic_year INTEGER NOT NULL,
  semester TEXT NOT NULL,
  program_code TEXT,
  level TEXT,
  strand TEXT,

  -- Courses (stored as arrays)
  first_semester_courses TEXT[] DEFAULT '{}',
  second_semester_courses TEXT[] DEFAULT '{}',

  -- Financial Information
  amount_paid DECIMAL(10, 2) DEFAULT 0,
  receipt_number TEXT,
  library_number TEXT,
  meal_number TEXT,
  compulsory_fees_paid BOOLEAN DEFAULT false,
  boarding_fees_paid BOOLEAN DEFAULT false,

  -- Declaration
  declaration_agreed BOOLEAN DEFAULT false,
  signature TEXT,
  witness TEXT,
  registration_date DATE,

  -- Status and Approval
  status TEXT DEFAULT 'pending_approval', -- pending_approval, approved, rejected
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(student_id, academic_year, semester)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_academic_year ON student_enrollments(academic_year, semester);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_status ON student_enrollments(status);

-- Add RLS policies
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;

-- Policy: Students can view their own enrollments
CREATE POLICY "Students can view own enrollments"
  ON student_enrollments
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Policy: Students can insert their own enrollments
CREATE POLICY "Students can create own enrollments"
  ON student_enrollments
  FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Policy: Students can update their own pending enrollments
CREATE POLICY "Students can update own pending enrollments"
  ON student_enrollments
  FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid() AND status = 'pending_approval')
  WITH CHECK (student_id = auth.uid() AND status = 'pending_approval');

-- Policy: Registrar and staff can view all enrollments
CREATE POLICY "Staff can view all enrollments"
  ON student_enrollments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('registrar', 'ict_admin', 'admissions')
    )
  );

-- Policy: Registrar can approve/reject enrollments
CREATE POLICY "Registrar can update enrollments"
  ON student_enrollments
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('registrar', 'ict_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('registrar', 'ict_admin')
    )
  );

-- Add columns to students table to store additional registration info
-- (if they don't already exist)

DO $$
BEGIN
  -- Personal Information
  ALTER TABLE students ADD COLUMN IF NOT EXISTS marital_status TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS id_number TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS slf_number TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS religion TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS home_province TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS residing_district TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS home_address TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS residing_province TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS next_of_kin TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS next_of_kin_relationship TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS next_of_kin_contact TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS nearest_airport TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS secondary_school TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS matriculation_centre TEXT;

  -- Financial/Accommodation Information
  ALTER TABLE students ADD COLUMN IF NOT EXISTS resident_type TEXT DEFAULT 'resident';
  ALTER TABLE students ADD COLUMN IF NOT EXISTS sponsor TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS dormitory TEXT;
  ALTER TABLE students ADD COLUMN IF NOT EXISTS room_number TEXT;

EXCEPTION
  WHEN duplicate_column THEN
    NULL;
END $$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_student_enrollments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_student_enrollments_timestamp
  BEFORE UPDATE ON student_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_student_enrollments_updated_at();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Student enrollments table created successfully!';
  RAISE NOTICE 'RLS policies configured for students and staff';
  RAISE NOTICE 'Additional student fields added for registration data';
END $$;
