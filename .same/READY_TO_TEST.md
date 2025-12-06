# ✅ READY TO TEST - Quick Guide

**Everything is set up! Let's test the system now.**

---

## 🚀 Step 1: Create Test Admin (5 min)

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql

2. **Copy and run:** `.same/CREATE_TEST_ADMIN.sql`

3. **You'll see:**
   ```
   ✅ TEST ADMIN ACCOUNT CREATED!
   Student ID: TEST-ADMIN-001
   Program: Agriculture
   Fees: K 9,625.70
   ```

---

## 🧪 Step 2: Test The System (5 min)

### Test 1: Public Application Form (NO LOGIN)
```
http://localhost:3000/apply
```
- ✅ Shows 12 programs from database
- ✅ Can submit applications
- ✅ For NEW students

### Test 2: Enrollment Form (with real fees!)
```
http://localhost:3000/portal/student/enroll
```
- ✅ Shows TEST-ADMIN-001 student
- ✅ Real fees: **K 9,625.70**
- ✅ Breakdown:
  - Tuition: K 2,140.00
  - Compulsory: K 1,209.10
  - Boarding: K 6,276.60
- ✅ For ENROLLED students

### Test 3: Course Registration
```
http://localhost:3000/portal/student/register-courses
```
- ✅ Shows available courses
- ✅ Can register for courses
- ✅ Credit limits enforced

---

## ✅ What's Working

| Feature | Status | Uses Real Data |
|---------|--------|----------------|
| Database | ✅ Working | Yes - 12 programs, 42 courses |
| RLS Security | ✅ Enabled | Yes - all tables protected |
| Application Form | ✅ Working | Yes - fetches programs |
| Enrollment Form | ✅ Working | Yes - fetches fees (K 9,625.70) |
| Course Registration | ⏳ Needs Update | Soon - will fetch courses |
| Authentication | 🧪 Testing Mode | Bypassed for development |

---

## 🎯 What You'll See

### Enrollment Form Banner:
```
🧪 TESTING MODE - Using Test Admin Account

Testing with real database data:
• Student ID: TEST-ADMIN-001
• Program: Bachelor of Science in Sustainable Tropical Agriculture
• Fees: K 9,625.70 (from database)
✅ Form data is pre-populated from database
✅ Fee structure fetched in real-time
⚠️ Authentication bypassed for testing
```

### Fee Breakdown (Real from Database):
```
2025 Fee Structure

Tuition Fee:              K 2,140.00
Compulsory Fees:          K 1,209.10
  • Clinical Services:    K 160.50
  • Student Association:  K 53.50
  • Academic Resources:   K 321.00
  • IT Levy:              K 32.10
  • Insurance:            K 321.00
  • Repairs & Maintenance:K 321.00
Boarding & Lodging:       K 6,276.60
─────────────────────────────────
TOTAL:                    K 9,625.70
```

---

## 🎉 SUCCESS!

If you see the above, **your system is working with REAL database data!**

**What this means:**
- ✅ Database is populated correctly
- ✅ Fee structures are accurate
- ✅ Forms fetch real-time data
- ✅ Test admin can test all features
- ✅ Ready for further development

---

## 🚧 What's Next

### Immediate (1-2 hours):
1. Update Course Registration to fetch real courses
2. Build staff dashboards (Admissions, Registrar, Finance)
3. Test complete workflows

### Before Production (2-3 hours):
1. Add Azure AD SSO integration
2. End-to-end testing
3. Deploy to Netlify

**Total time to production:** ~4-6 hours

---

## 📋 Quick Verification

Run this in Supabase SQL Editor:

```sql
-- Check test admin and fees
SELECT
    s.student_id,
    p.program_name,
    f.tuition_fee + f.clinical_services_fee + f.student_association_fee +
    f.academic_resources_fee + f.ict_levy + f.insurance_fee +
    f.repairs_maintenance_fee + f.lodging_fee as total_residential
FROM students s
JOIN programs p ON s.program_id = p.id
JOIN semesters sem ON sem.is_current = true
JOIN fee_structures f ON f.program_id = p.id AND f.semester_id = sem.id
WHERE s.student_id = 'TEST-ADMIN-001';
```

**Expected:** TEST-ADMIN-001, Agriculture, K 9625.70

---

**👉 START NOW: Run `.same/CREATE_TEST_ADMIN.sql` then test the system!**

**Time:** 10 minutes total
