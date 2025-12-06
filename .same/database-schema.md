# UNRE Student Registration System - Database Schema

## Core Tables

### 1. users
Primary user table for authentication and basic info
```sql
- id (uuid, PK)
- email (text, unique)
- phone (text)
- role (enum: student, registrar, finance, admissions, ict_admin, department_head, academic_advisor, dean)
- first_name (text)
- last_name (text)
- middle_name (text)
- created_at (timestamp)
- updated_at (timestamp)
- last_login (timestamp)
- is_active (boolean)
```

### 2. students
Extended student information
```sql
- id (uuid, PK, FK -> users.id)
- student_id (text, unique, auto-generated)
- date_of_birth (date)
- gender (enum: male, female, other)
- nationality (text)
- national_id (text)
- program_id (uuid, FK -> programs.id)
- enrollment_year (integer)
- enrollment_semester (enum: semester_1, semester_2)
- student_type (enum: new, returning, transfer)
- academic_standing (enum: good, probation, suspended, graduated, withdrawn)
- current_gpa (decimal)
- total_credits_earned (integer)
- photo_url (text)
- address (jsonb)
- emergency_contact (jsonb)
```

### 3. applications
New student applications
```sql
- id (uuid, PK)
- applicant_email (text)
- applicant_phone (text)
- first_name (text)
- last_name (text)
- middle_name (text)
- program_id (uuid, FK -> programs.id)
- application_date (timestamp)
- status (enum: submitted, under_review, approved, rejected, offer_sent, accepted)
- documents (jsonb)
- current_approver_role (text)
- approval_chain (jsonb)
- rejection_reason (text)
- created_at (timestamp)
- updated_at (timestamp)
```

### 4. application_documents
Document uploads for applications
```sql
- id (uuid, PK)
- application_id (uuid, FK -> applications.id)
- document_type (enum: grade_12_cert, transcript, national_id, photo, other)
- file_url (text)
- file_name (text)
- uploaded_at (timestamp)
- verified (boolean)
- verified_by (uuid, FK -> users.id)
```

### 5. programs
Academic programs
```sql
- id (uuid, PK)
- program_code (text, unique)
- program_name (text)
- department_id (uuid, FK -> departments.id)
- degree_level (enum: certificate, diploma, undergraduate, postgraduate)
- duration_years (integer)
- total_credits_required (integer)
- description (text)
- is_active (boolean)
```

### 6. departments
Academic departments
```sql
- id (uuid, PK)
- department_code (text, unique)
- department_name (text)
- faculty (text)
- head_id (uuid, FK -> users.id)
- created_at (timestamp)
```

### 7. courses
Course catalog
```sql
- id (uuid, PK)
- course_code (text, unique)
- course_name (text)
- department_id (uuid, FK -> departments.id)
- credits (integer)
- course_type (enum: compulsory, elective)
- description (text)
- prerequisites (jsonb[]) - array of course_ids
- semester_offered (enum: semester_1, semester_2, both)
- is_active (boolean)
```

### 8. program_courses
Courses required for each program
```sql
- id (uuid, PK)
- program_id (uuid, FK -> programs.id)
- course_id (uuid, FK -> courses.id)
- year_level (integer)
- semester (enum: semester_1, semester_2)
- is_compulsory (boolean)
```

### 9. course_registrations
Student course registrations
```sql
- id (uuid, PK)
- student_id (uuid, FK -> students.id)
- course_id (uuid, FK -> courses.id)
- semester_id (uuid, FK -> semesters.id)
- registration_date (timestamp)
- status (enum: pending_advisor, pending_registrar, approved, rejected, dropped, completed)
- advisor_approved (boolean)
- advisor_id (uuid, FK -> users.id)
- advisor_approval_date (timestamp)
- registrar_approved (boolean)
- registrar_id (uuid, FK -> users.id)
- registrar_approval_date (timestamp)
- grade (text)
- grade_points (decimal)
```

### 10. semesters
Academic semesters
```sql
- id (uuid, PK)
- year (integer)
- semester (enum: semester_1, semester_2)
- start_date (date)
- end_date (date)
- registration_start (date)
- registration_end (date)
- is_current (boolean)
```

### 11. fee_structures
Fee configurations
```sql
- id (uuid, PK)
- program_id (uuid, FK -> programs.id)
- semester_id (uuid, FK -> semesters.id)
- tuition_fee (decimal)
- lodging_fee (decimal)
- messing_fee (decimal)
- ict_levy (decimal)
- student_services_fee (decimal)
- other_fees (jsonb)
- effective_date (date)
```

### 12. invoices
Student invoices
```sql
- id (uuid, PK)
- invoice_number (text, unique, auto-generated)
- student_id (uuid, FK -> students.id)
- semester_id (uuid, FK -> semesters.id)
- issue_date (timestamp)
- due_date (date)
- total_amount (decimal)
- amount_paid (decimal)
- balance (decimal)
- status (enum: pending, partial, paid, overdue)
- fee_breakdown (jsonb)
- arrears_included (decimal)
```

### 13. payments
Payment transactions
```sql
- id (uuid, PK)
- invoice_id (uuid, FK -> invoices.id)
- student_id (uuid, FK -> students.id)
- payment_date (timestamp)
- amount (decimal)
- payment_method (enum: bsp_pay, kina_bank, visa, mastercard, cash, mobile_money)
- transaction_reference (text, unique)
- gateway_response (jsonb)
- status (enum: pending, successful, failed, refunded)
- receipt_url (text)
- reconciled (boolean)
- reconciled_date (timestamp)
- reconciled_by (uuid, FK -> users.id)
```

### 14. enrollments
Student enrollment records
```sql
- id (uuid, PK)
- student_id (uuid, FK -> students.id)
- semester_id (uuid, FK -> semesters.id)
- enrollment_date (timestamp)
- status (enum: enrolled, withdrawn, completed)
- payment_cleared (boolean)
- clearance_status (jsonb) - finance, library, discipline
- lms_access (boolean)
- library_access (boolean)
- exams_access (boolean)
```

### 15. clearances
Student clearance records
```sql
- id (uuid, PK)
- student_id (uuid, FK -> students.id)
- semester_id (uuid, FK -> semesters.id)
- clearance_type (enum: finance, library, discipline, department)
- status (enum: cleared, hold, pending)
- reason (text)
- cleared_by (uuid, FK -> users.id)
- cleared_date (timestamp)
```

### 16. audit_logs
System audit trail
```sql
- id (uuid, PK)
- user_id (uuid, FK -> users.id)
- action (text)
- entity_type (text)
- entity_id (uuid)
- old_values (jsonb)
- new_values (jsonb)
- ip_address (text)
- user_agent (text)
- timestamp (timestamp)
- metadata (jsonb)
```

### 17. offer_letters
Generated offer letters
```sql
- id (uuid, PK)
- application_id (uuid, FK -> applications.id)
- student_id (uuid, FK -> students.id)
- letter_url (text)
- generated_date (timestamp)
- expiry_date (date)
- accepted (boolean)
- acceptance_date (timestamp)
```

### 18. academic_advisors
Student-advisor assignments
```sql
- id (uuid, PK)
- student_id (uuid, FK -> students.id)
- advisor_id (uuid, FK -> users.id)
- assigned_date (timestamp)
- is_active (boolean)
```

## Row Level Security (RLS) Policies

Each table will have RLS policies to ensure:
- Students can only view their own data
- Staff can view data based on their role
- Audit logs are read-only for all except ICT admins
- Financial data is restricted to finance and ICT roles
- Application data is restricted based on approval workflow

## Indexes

Key indexes for performance:
- students.student_id
- applications.applicant_email
- invoices.student_id, semester_id
- payments.transaction_reference
- course_registrations.student_id, semester_id
- audit_logs.user_id, timestamp
- enrollments.student_id, semester_id
