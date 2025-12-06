# 🚀 Quick Start Checklist - UNRE Registration System

**Use this checklist to track your progress. Check off each item as you complete it.**

---

## ⚡ CRITICAL STEPS (Do These First!)

### 🔒 Step 1: Enable Row Level Security (5 min)
- [ ] **READ FIRST:** `.same/RLS_FINAL_WORKING_VERSION.md` - Complete guide
- [ ] Open Supabase SQL Editor
- [ ] Copy `.same/RLS_SECURITY_POLICIES_FIXED.sql` ⚠️ **USE THIS VERSION**
- [ ] Paste and run in SQL Editor
- [ ] Verify success message appears
- [ ] If errors, check `.same/RLS_FINAL_WORKING_VERSION.md`
- [ ] **Result:** ✅ ROW LEVEL SECURITY ENABLED!

---

### 👥 Step 2: Create Test Users (10 min)
- [ ] Go to Supabase Authentication > Users
- [ ] Create `test.student@student.unre.ac.pg` (password: `Test123!`)
- [ ] Create `registrar@unre.ac.pg` (password: `Test123!`)
- [ ] Create `admissions@unre.ac.pg` (password: `Test123!`)
- [ ] Create `finance@unre.ac.pg` (password: `Test123!`)
- [ ] Create `ict@unre.ac.pg` (password: `Test123!`)
- [ ] Confirm all emails (auto-confirm in Supabase)
- [ ] **Result:** 5 test users created in Supabase Auth

---

### 🎯 Step 3: Run Test Users Setup Script (5 min)
- [ ] Open Supabase SQL Editor
- [ ] Copy `.same/CREATE_TEST_USERS.sql`
- [ ] Paste and run in SQL Editor
- [ ] Verify success message appears
- [ ] **Result:** ✅ Test student has profile, courses, invoice

---

### ✅ Step 4: Test Application Form (10 min)
- [ ] Open `/apply` page
- [ ] Check programs dropdown loads (12 programs)
- [ ] Fill out test application
- [ ] Upload test documents (optional)
- [ ] Submit form
- [ ] See success page with Application ID
- [ ] Run query: `SELECT * FROM applications ORDER BY created_at DESC LIMIT 1;`
- [ ] **Result:** Application saved in database

---

## 📝 MEDIUM PRIORITY (Do These Next)

### 📄 Step 5: Update Enrollment Form (45 min)
- [ ] Open `src/app/portal/student/enroll/page.tsx`
- [ ] Add code to fetch student's program and fees
- [ ] Update fee display to show real amounts
- [ ] Calculate based on residential status
- [ ] Test with test student account
- [ ] **Result:** Enrollment form shows K 9,625.70 for residential

---

### 📚 Step 6: Update Course Registration (45 min)
- [ ] Open `src/app/portal/student/register-courses/page.tsx`
- [ ] Add code to fetch courses for student's program
- [ ] Filter by semester and year level
- [ ] Enforce credit limits (12-18)
- [ ] Test adding courses to cart
- [ ] Test submission
- [ ] **Result:** Course registration works with real courses

---

### 👔 Step 7: Update Staff Dashboards (1-2 hours)
- [ ] Update Registrar dashboard filters
- [ ] Update Admissions dashboard
- [ ] Update Finance dashboard
- [ ] Test each workflow
- [ ] **Result:** All dashboards use real data

---

## 🧪 TESTING (Do These Before Deploy)

### 🔄 Step 8: End-to-End Testing (2-3 hours)
- [ ] Test complete application flow
- [ ] Test complete enrollment flow
- [ ] Test complete course registration flow
- [ ] Test finance workflow (invoices, payments)
- [ ] Test RLS policies (student sees only own data)
- [ ] Test on mobile devices
- [ ] **Result:** All workflows tested and working

---

## 🚀 DEPLOYMENT (Final Steps)

### 🎯 Step 9: Pre-Deployment (30 min)
- [ ] Remove all testing mode code
- [ ] Remove testing banners
- [ ] Check environment variables
- [ ] Remove console.log statements
- [ ] Test one more time
- [ ] **Result:** Code ready for production

---

### 🌐 Step 10: Deploy to Production (30 min)
- [ ] Commit all changes to GitHub
- [ ] Netlify auto-deploys
- [ ] Test production URL
- [ ] Monitor for errors
- [ ] Send launch announcement
- [ ] **Result:** 🎉 System live in production!

---

## 📊 Progress Tracker

**Critical Steps Completed:** 0 / 4
**Medium Priority Completed:** 0 / 3
**Testing Completed:** 0 / 1
**Deployment Completed:** 0 / 2

**Overall Progress:** 0% → 100%

---

## 🎯 Current Status

```
[ ] Step 1: Enable RLS ← START HERE
[ ] Step 2: Create test users
[ ] Step 3: Run test users script
[ ] Step 4: Test application form
[ ] Step 5: Update enrollment form
[ ] Step 6: Update course registration
[ ] Step 7: Update dashboards
[ ] Step 8: End-to-end testing
[ ] Step 9: Pre-deployment checks
[ ] Step 10: Deploy to production
```

---

## ⏱️ Time Estimates

| Phase | Time | Status |
|-------|------|--------|
| **Critical Steps** | 30 min | ⚠️ Not started |
| **Medium Priority** | 3-4 hours | ⏳ Waiting |
| **Testing** | 2-3 hours | ⏳ Waiting |
| **Deployment** | 1 hour | ⏳ Waiting |
| **TOTAL** | 6-8 hours | 0% complete |

---

## ✅ Quick Verification Commands

After each step, run these to verify:

**Step 1 - RLS Enabled:**
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
LIMIT 10;
```

**Step 3 - Test Student Created:**
```sql
SELECT s.student_id, p.program_code, COUNT(cr.id) as courses
FROM students s
JOIN programs p ON s.program_id = p.id
LEFT JOIN course_registrations cr ON s.id = cr.student_id
WHERE s.student_id = 'STU-001234'
GROUP BY s.student_id, p.program_code;
```

**Step 4 - Application Submitted:**
```sql
SELECT application_id, first_name, last_name, application_status, created_at
FROM applications
ORDER BY created_at DESC
LIMIT 1;
```

---

## 🔗 Quick Links

- **Supabase SQL Editor:** https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
- **Supabase Auth:** https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/users
- **Full Guide:** `.same/SESSION_CONTINUATION_SUMMARY.md`
- **Detailed Steps:** `.same/NEXT_STEPS_GUIDE.md`

---

**👉 START WITH STEP 1 - ENABLE RLS (CRITICAL FOR SECURITY!)** 🔒

---

*Mark each checkbox with `[x]` as you complete items. Good luck!*
