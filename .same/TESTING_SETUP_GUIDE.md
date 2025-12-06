# 🧪 Testing Setup Guide - UNRE Registration System

**Purpose:** Set up test admin account and verify the complete system works

**Time Required:** 10 minutes

---

## ✅ Step 1: Create Test Admin Account (5 min)

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
   ```

2. **Copy ENTIRE contents of:**
   ```
   .same/CREATE_TEST_ADMIN.sql
   ```

3. **Paste in SQL Editor and click "Run"**

4. **You should see:**
   ```
   ✅ Test admin user created: admin.test@unre.ac.pg
   ✅ Test student profile created: TEST-ADMIN-001
   ✅ Test enrollment created
   ✅ Test courses registered: 6 courses (18 credits)
   ✅ Test invoice created: K 9,625.70

   ==============================================
   ✅ TEST ADMIN ACCOUNT CREATED!
   ==============================================

   Test Account Details:
     Email: admin.test@unre.ac.pg
     Student ID: TEST-ADMIN-001
     Program: Agriculture (AGRI-BSC)
     Role: ICT Admin (can access everything)
     UUID: a0000000-0000-0000-0000-000000000001
   ```

---

## ✅ Step 2: Test Public Application Form (2 min)

**NO authentication required - this is for NEW students**

1. **Open:**
   ```
   http://localhost:3000/apply
   ```

2. **Verify:**
   - ✅ Page loads without login
   - ✅ Programs dropdown shows 12 programs
   - ✅ All form sections visible
   - ✅ Can fill out form
   - ✅ Can upload documents

3. **Optional: Submit test application**
   - Fill in test data
   - Select program
   - Click "Submit Registration"
   - Should see success page with Application ID

4. **Verify in database:**
   ```sql
   SELECT application_id, first_name, last_name, status
   FROM applications
   ORDER BY created_at DESC
   LIMIT 1;
   ```

**✅ If this works, your public application form is ready!**

---

## ✅ Step 3: Test Enrollment Form (2 min)

**For ENROLLED students (with Test Admin account)**

1. **Open:**
   ```
   http://localhost:3000/portal/student/enroll
   ```

2. **Verify:**
   - ✅ Blue testing mode banner shows:
     - Student ID: TEST-ADMIN-001
     - Program: Agriculture
     - Real fees from database
   - ✅ Form is pre-populated with test data
   - ✅ Fee breakdown shows:
     - Tuition: K 2,140.00
     - Compulsory: K 1,209.10
     - Boarding: K 6,276.60
     - **TOTAL: K 9,625.70**
   - ✅ All sections visible and editable

3. **Check fee calculation:**
   - Residential student: K 9,625.70
   - Change to Non-Residential: Should recalculate (no boarding)

**✅ If this works, enrollment form is using real database fees!**

---

## ✅ Step 4: Test Course Registration (2 min)

1. **Open:**
   ```
   http://localhost:3000/portal/student/register-courses
   ```

2. **Verify:**
   - ✅ Page loads
   - ✅ Shows available courses
   - ✅ Can add courses to cart
   - ✅ Credit limits enforced

---

## 🎯 What You Now Have

After completing these steps:

### ✅ Public Application Form
- Works WITHOUT authentication
- Uses real programs from database
- Can submit applications
- Perfect for NEW student applications

### ✅ Enrollment Form
- Uses Test Admin account (TEST-ADMIN-001)
- Fetches REAL fees from database:
  - Tuition: K 2,140.00
  - Compulsory: K 1,209.10
  - Boarding: K 6,276.60
  - Total: K 9,625.70
- Pre-populated with student data
- Ready for testing complete enrollment flow

### ✅ Test Admin Account
- UUID: `a0000000-0000-0000-0000-000000000001`
- Student ID: TEST-ADMIN-001
- Email: admin.test@unre.ac.pg
- Program: Agriculture (AGRI-BSC)
- Has: 6 courses, invoice, enrollment record

---

## 🧪 Testing Workflows

### Workflow 1: NEW Student Application
```
1. Go to /apply (NO login)
2. Fill application form
3. Upload documents
4. Submit
5. Verify in database (applications table)
```

### Workflow 2: Enrolled Student Registration
```
1. Go to /portal/student/enroll
2. See pre-populated form (TEST-ADMIN-001)
3. See real fees (K 9,625.70)
4. Fill remaining fields
5. Submit enrollment
6. Verify in database (student_enrollments table)
```

### Workflow 3: Course Registration
```
1. Go to /portal/student/register-courses
2. Browse available courses
3. Add courses to cart
4. Check credit limits (12-18 credits)
5. Submit registration
6. Verify in database (course_registrations table)
```

---

## 📊 Verification Queries

Run these to verify everything works:

### Check Test Admin Exists
```sql
SELECT
    u.email,
    s.student_id,
    p.program_code,
    p.program_name
FROM users u
JOIN students s ON u.id = s.id
JOIN programs p ON s.program_id = p.id
WHERE u.email = 'admin.test@unre.ac.pg';
```
**Expected:** 1 row with TEST-ADMIN-001, AGRI-BSC

### Check Test Admin's Courses
```sql
SELECT
    c.course_code,
    c.course_name,
    c.credits
FROM course_registrations cr
JOIN courses c ON cr.course_id = c.id
JOIN students s ON cr.student_id = s.id
WHERE s.student_id = 'TEST-ADMIN-001';
```
**Expected:** 6 courses (18 credits total)

### Check Test Admin's Invoice
```sql
SELECT
    invoice_number,
    total_amount,
    balance,
    status
FROM invoices i
JOIN students s ON i.student_id = s.id
WHERE s.student_id = 'TEST-ADMIN-001';
```
**Expected:** K 9,625.70 total

### Check Fee Structure
```sql
SELECT
    p.program_code,
    f.tuition_fee,
    f.lodging_fee,
    f.clinical_services_fee + f.student_association_fee +
    f.academic_resources_fee + f.ict_levy +
    f.insurance_fee + f.repairs_maintenance_fee as compulsory_fees
FROM fee_structures f
JOIN programs p ON f.program_id = p.id
WHERE p.program_code = 'AGRI-BSC'
LIMIT 1;
```
**Expected:** Tuition 2140, Lodging 6276.60, Compulsory 1209.10

---

## ✅ Success Checklist

- [ ] Test admin account created (TEST-ADMIN-001)
- [ ] Application form loads without login
- [ ] Application form shows 12 programs
- [ ] Can submit test application
- [ ] Enrollment form loads with test admin data
- [ ] Enrollment form shows real fees (K 9,625.70)
- [ ] Fee breakdown displays correctly
- [ ] Course registration page loads
- [ ] All verification queries return expected data

---

## 🎯 What's Next

After completing testing setup:

### Option 1: Continue Building Features
- ✅ Application form (DONE)
- ✅ Enrollment form (DONE - real fees)
- ⏳ **Course registration** (update to use real courses)
- ⏳ **Staff dashboards** (admissions, registrar, finance)
- ⏳ **Payment processing**

### Option 2: Add Azure AD Integration
- Set up Azure AD app registration
- Configure SSO
- Test with real university accounts
- Map AD groups to roles

---

## 🆘 Troubleshooting

### Test Admin Not Created
**Check:**
```sql
SELECT * FROM users WHERE email = 'admin.test@unre.ac.pg';
```
**If empty:** Re-run CREATE_TEST_ADMIN.sql

### Fees Not Showing
**Check:**
```sql
SELECT COUNT(*) FROM fee_structures;
```
**If 0:** Re-run COMPLETE_SETUP_ALL_IN_ONE.sql

### Courses Not Loading
**Check:**
```sql
SELECT COUNT(*) FROM courses;
```
**If 0:** Re-run database population scripts

---

## 📞 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Check Supabase logs
3. Run verification queries above
4. Check that dev server is running

---

**🚀 Ready to test? Run `.same/CREATE_TEST_ADMIN.sql` now!**

**Time:** 10 minutes total
**Result:** Complete testing environment with real data
