# Creating Test Users in Supabase 🧪

This guide will help you create test users to verify the authentication system is working correctly.

---

## 📋 Overview

You'll create:
1. **Test Student** - To test student portal
2. **Test Staff (Registrar)** - To test staff portal
3. **Test Staff (Admissions)** - To test admissions workflow

---

## Step 1: Create Auth Users in Supabase

### Go to Supabase Dashboard
https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/users

### Create Test Student User

1. Click **"Add user"** button (top right)
2. Click **"Create new user"**
3. Fill in the form:
   ```
   Email: test.student@student.unre.edu.pg
   Password: TestStudent123!
   Auto Confirm User: ✅ YES (check this box)
   ```
4. Click **"Create user"**
5. **IMPORTANT:** Note the UUID that was created (you'll see it in the users list)
   - It looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
   - **Copy this UUID** - you'll need it for the next steps!

### Create Test Registrar User

1. Click **"Add user"** button again
2. Click **"Create new user"**
3. Fill in the form:
   ```
   Email: test.registrar@unre.edu.pg
   Password: TestRegistrar123!
   Auto Confirm User: ✅ YES (check this box)
   ```
4. Click **"Create user"**
5. **Copy the UUID** for this user too

### Create Test Admissions User

1. Click **"Add user"** button again
2. Click **"Create new user"**
3. Fill in the form:
   ```
   Email: test.admissions@unre.edu.pg
   Password: TestAdmissions123!
   Auto Confirm User: ✅ YES (check this box)
   ```
4. Click **"Create user"**
5. **Copy the UUID** for this user too

---

## Step 2: Add Users to Database

Now we need to add these users to our `users` and `students` tables.

### Go to SQL Editor
https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql

### Run This SQL (Replace UUIDs with your actual UUIDs!)

```sql
-- ============================================
-- CREATE TEST STUDENT USER
-- ============================================
-- Replace 'STUDENT-UUID-HERE' with the actual UUID from Step 1

INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  is_active
)
VALUES (
  'STUDENT-UUID-HERE',  -- ⚠️ REPLACE THIS
  'test.student@student.unre.edu.pg',
  'student',
  'Test',
  'Student',
  '+675 7123 4567',
  true
);

-- Create student record for the test student
INSERT INTO students (
  id,
  student_id,
  date_of_birth,
  gender,
  nationality,
  enrollment_year,
  enrollment_semester,
  student_type,
  academic_standing
)
VALUES (
  'STUDENT-UUID-HERE',  -- ⚠️ REPLACE THIS (same UUID as above)
  'UNRE-2025-0001',
  '2000-01-15',
  'male',
  'Papua New Guinean',
  2025,
  'semester_1',
  'new',
  'good'
);

-- ============================================
-- CREATE TEST REGISTRAR USER
-- ============================================
-- Replace 'REGISTRAR-UUID-HERE' with the actual UUID from Step 1

INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  is_active
)
VALUES (
  'REGISTRAR-UUID-HERE',  -- ⚠️ REPLACE THIS
  'test.registrar@unre.edu.pg',
  'registrar',
  'John',
  'Registrar',
  '+675 7123 4568',
  true
);

-- ============================================
-- CREATE TEST ADMISSIONS USER
-- ============================================
-- Replace 'ADMISSIONS-UUID-HERE' with the actual UUID from Step 1

INSERT INTO users (
  id,
  email,
  role,
  first_name,
  last_name,
  phone,
  is_active
)
VALUES (
  'ADMISSIONS-UUID-HERE',  -- ⚠️ REPLACE THIS
  'test.admissions@unre.edu.pg',
  'admissions',
  'Jane',
  'Admissions',
  '+675 7123 4569',
  true
);
```

**Click "Run" to execute the SQL!**

---

## Step 3: Test Login Flow

### Test Student Login

1. **Go to login page:** http://localhost:3000/login
2. Click **"Student"** tab
3. Click **"Sign in with Microsoft"**
4. **For testing without Azure AD:**
   - Since Azure AD isn't configured yet, you'll need to test with email/password
   - We'll add an email/password option for testing

5. **Expected behavior:**
   - Should redirect to student portal (`/portal/student`)
   - Should show student name: "Test Student"
   - Should show student ID: "UNRE-2025-0001"
   - Logout button should work

### Test Registrar Login

1. **Go to login page:** http://localhost:3000/login
2. Click **"Staff"** tab
3. Click **"Sign in with Microsoft"**
4. Use credentials:
   ```
   Email: test.registrar@unre.edu.pg
   Password: TestRegistrar123!
   ```
5. **Expected behavior:**
   - Should redirect to registrar portal (`/portal/registrar`)
   - Should show staff name: "John Registrar"
   - Logout button should work

### Test Admissions Login

1. **Go to login page:** http://localhost:3000/login
2. Click **"Staff"** tab
3. Sign in with:
   ```
   Email: test.admissions@unre.edu.pg
   Password: TestAdmissions123!
   ```
4. **Expected behavior:**
   - Should redirect to admissions portal (`/portal/admissions`)
   - Should show staff name: "Jane Admissions"
   - Logout button should work

---

## Step 4: Test Protected Routes

### Test Middleware Protection

1. **When NOT logged in:**
   - Try to access: http://localhost:3000/portal/student
   - **Expected:** Should redirect to `/login?redirectTo=/portal/student`

2. **After logging in:**
   - Should be redirected back to the page you were trying to access

3. **Test logout:**
   - Click "Logout" button in any portal
   - Try to access portal page again
   - **Expected:** Should redirect to login

---

## Step 5: Create Sample Data for Testing

### Add Sample Application for Test Student

```sql
-- Add a sample application
INSERT INTO applications (
  id,
  student_id,
  program_id,
  application_status,
  first_name,
  last_name,
  email,
  phone,
  date_of_birth,
  gender,
  nationality,
  province,
  district,
  village,
  postal_address,
  emergency_contact_name,
  emergency_contact_relationship,
  emergency_contact_phone,
  grade_12_school,
  grade_12_year,
  grade_12_marks
)
SELECT
  gen_random_uuid(),
  'STUDENT-UUID-HERE',  -- ⚠️ REPLACE THIS
  p.id,
  'approved',
  'Test',
  'Student',
  'test.student@student.unre.edu.pg',
  '+675 7123 4567',
  '2000-01-15',
  'male',
  'Papua New Guinean',
  'National Capital District',
  'Port Moresby',
  'Hohola',
  'PO Box 123, Port Moresby, NCD',
  'Parent Name',
  'Father',
  '+675 7123 4570',
  'Port Moresby High School',
  2024,
  85.5
FROM programs p
WHERE p.program_name LIKE '%Environmental Science%'
LIMIT 1;
```

### Add Sample Invoice for Test Student

```sql
-- Add a sample invoice
INSERT INTO invoices (
  id,
  student_id,
  invoice_number,
  academic_year,
  semester,
  total_amount,
  amount_paid,
  balance,
  due_date,
  status
)
VALUES (
  gen_random_uuid(),
  'STUDENT-UUID-HERE',  -- ⚠️ REPLACE THIS
  'INV-2025-0001',
  2025,
  'semester_1',
  4500.00,
  2000.00,
  2500.00,
  '2025-02-28',
  'partial'
);
```

### Add Sample Enrollments for Test Student

```sql
-- Enroll student in some courses
INSERT INTO enrollments (
  id,
  student_id,
  course_id,
  academic_year,
  semester,
  status
)
SELECT
  gen_random_uuid(),
  'STUDENT-UUID-HERE',  -- ⚠️ REPLACE THIS
  c.id,
  2025,
  'semester_1',
  'enrolled'
FROM courses c
WHERE c.course_code IN ('ENV101', 'BIO101', 'CHE101', 'MAT101')
LIMIT 4;
```

**Click "Run" for each SQL block!**

---

## ✅ Verification Checklist

After creating test users, verify:

- [ ] Test student can log in
- [ ] Test student sees their dashboard with real data
- [ ] Test student can see application status
- [ ] Test student can see enrolled courses
- [ ] Test student can see invoice
- [ ] Test registrar can log in
- [ ] Test registrar sees registrar dashboard
- [ ] Test admissions can log in
- [ ] Test admissions sees admissions dashboard
- [ ] Logout works from all portals
- [ ] Protected routes redirect to login when not authenticated
- [ ] After login, user is redirected back to original page

---

## 🐛 Troubleshooting

### "User not found" error
- Make sure you ran the SQL inserts with the correct UUIDs
- Check that the UUID in `users` table matches the UUID in `auth.users`

### "No student data" in portal
- Make sure you created a record in the `students` table
- Check that the student `id` matches the user `id`

### Can't log in
- Verify the user exists in Supabase > Authentication > Users
- Make sure "Auto Confirm User" was checked
- Try resetting the password in Supabase dashboard

### Redirects not working
- Clear browser cookies
- Try in incognito/private window
- Check browser console for errors

---

## 📝 Test Credentials Summary

| User Type | Email | Password | Portal |
|-----------|-------|----------|--------|
| Student | test.student@student.unre.edu.pg | TestStudent123! | /portal/student |
| Registrar | test.registrar@unre.edu.pg | TestRegistrar123! | /portal/registrar |
| Admissions | test.admissions@unre.edu.pg | TestAdmissions123! | /portal/admissions |

---

## 🔐 Security Note

**These are TEST users only!**

- Do NOT use these in production
- Delete these users before going live
- Use strong, unique passwords for real users
- Enable 2FA for production

---

**Need help?** Check the console for errors or contact ICT support!
