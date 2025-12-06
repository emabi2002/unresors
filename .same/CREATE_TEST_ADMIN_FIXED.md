# ✅ CREATE_TEST_ADMIN.sql - FIXED

## 🔧 Errors Fixed

### Error: Column "full_name" does not exist

**Problem:** Script tried to insert `full_name` into users table
**Actual Columns:** `first_name` and `last_name` (separate)
**Fix:** Changed to use `first_name` and `last_name`
**Status:** ✅ FIXED

---

## 📋 All Column Fixes Applied

### 1. Users Table
**Before:**
```sql
INSERT INTO users (id, email, role, full_name, created_at)
VALUES (..., 'Test Administrator', ...)
```

**After:**
```sql
INSERT INTO users (id, email, role, first_name, last_name, phone, created_at)
VALUES (..., 'Test', 'Administrator', '+675 7000 0001', ...)
```

✅ **Fixed:** Uses `first_name` and `last_name`

---

### 2. Students Table
**Added required base fields:**
- ✅ `date_of_birth` - '2000-01-01'
- ✅ `gender` - 'male'
- ✅ `nationality` - 'Papua New Guinean'
- ✅ `national_id` - 'TEST-ID-12345678'
- ✅ `student_type` - 'regular'

**Removed non-existent fields:**
- ❌ `current_year` (not in base schema)
- ❌ `current_semester` (not in base schema)
- ❌ `status` (not in base schema)
- ❌ `created_at` (auto-generated)

---

### 3. Student Enrollments Table
**Changed to match enrollment-registration-table.sql schema:**

**Before:**
```sql
program_id, semester_id, year_level, enrollment_type, enrollment_status
```

**After:**
```sql
academic_year, semester, program_code, level, status
```

✅ **Fixed:** Uses TEXT fields instead of UUIDs

---

### 4. Invoices Table
**Before:**
```sql
invoice_date, line_items
```

**After:**
```sql
issue_date, fee_breakdown
```

✅ **Fixed:** Matches actual schema column names

---

## 🚀 READY TO RUN

The script is now fixed and ready:

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
   ```

2. **Copy ALL of:**
   ```
   .same/CREATE_TEST_ADMIN.sql
   ```

3. **Paste and Run**

4. **Expected Success:**
   ```
   ✅ Test admin user created: admin.test@unre.ac.pg
   ✅ Test student profile created: TEST-ADMIN-001
   ✅ Test enrollment created
   ✅ Test courses registered: 6 courses (18 credits)
   ✅ Test invoice created: K 9,625.70

   ==============================================
   ✅ TEST ADMIN ACCOUNT CREATED!
   ==============================================
   ```

---

## 📊 What You'll Get

After running the fixed script:

### Test Admin User
- **UUID:** a0000000-0000-0000-0000-000000000001
- **Email:** admin.test@unre.ac.pg
- **Name:** Test Administrator
- **Role:** ict_admin

### Student Profile
- **Student ID:** TEST-ADMIN-001
- **Program:** Agriculture (AGRI-BSC)
- **DOB:** 2000-01-01 (Age: 25)
- **Gender:** Male
- **Status:** Regular student
- **Residential:** Residential (boarding)

### Enrollment Record
- **Academic Year:** 2025
- **Semester:** Semester 1
- **Level:** Year 1
- **Status:** Approved

### Course Registrations
6 courses registered (18 credits):
- AGRI101, AGRI102, AGRI103
- CHEM101, MATH101, ENG101

### Invoice
- **Invoice Number:** INV-TEST-ADMIN-001
- **Total:** K 9,625.70
- **Breakdown:**
  - Tuition: K 2,140.00
  - Compulsory: K 1,209.10
  - Boarding: K 6,276.60
- **Status:** Pending
- **Balance:** K 9,625.70 (unpaid)

---

## ✅ Verification Query

After running, verify with:

```sql
-- Check test admin exists
SELECT
    u.first_name || ' ' || u.last_name as name,
    u.email,
    u.role,
    s.student_id,
    s.date_of_birth,
    s.gender,
    p.program_code,
    p.program_name
FROM users u
JOIN students s ON u.id = s.id
LEFT JOIN programs p ON s.program_id = p.id
WHERE u.email = 'admin.test@unre.ac.pg';
```

**Expected:** 1 row showing Test Administrator, TEST-ADMIN-001, AGRI-BSC

---

## 🎯 Next Steps

After test admin is created:

1. **Test Enrollment Form:**
   ```
   http://localhost:3000/portal/student/enroll
   ```
   - Should show TEST-ADMIN-001
   - Should show real fees: K 9,625.70

2. **Test Application Form:**
   ```
   http://localhost:3000/apply
   ```
   - Should show 12 programs
   - No login required

3. **Continue Development:**
   - Update course registration
   - Build staff dashboards
   - Add Azure AD SSO

---

**👉 RUN NOW: `.same/CREATE_TEST_ADMIN.sql` (all errors fixed!)**
