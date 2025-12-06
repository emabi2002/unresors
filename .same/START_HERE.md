# 🚀 START HERE - Testing Setup Guide

**Status:** RLS Security ✅ | Database ✅ | Application Form ✅ | Enrollment Form ✅

---

## ✅ What's Already Done

- ✅ Database populated with 12 programs, 42 courses, 9 departments
- ✅ RLS Security enabled and working
- ✅ Fee structures created (K 9,625.70 residential)
- ✅ Application form - fetches real programs from database
- ✅ Enrollment form - fetches real fees from database
- ✅ Dev server running on http://localhost:3000

---

## 🎯 What You Need to Do (10 minutes)

### Step 1: Enable Database Security (5 min) 🔒

**Why:** Protect your data with role-based access control

**How:**
1. Open: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
2. Copy **ALL** of: `.same/RLS_SECURITY_POLICIES_FIXED.sql`
3. Paste in SQL Editor
4. Click "Run"
5. Should see: `✅ ROW LEVEL SECURITY ENABLED!`

**If errors:** Read `.same/ALL_ERRORS_FIXED.md` (all 4 errors documented and fixed)

---

### Step 2: Create Test Users (10 min) 👥

**Why:** Test the system with different user roles

**How:**
1. Open: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/users
2. Click "Add User" and create these 5 users:
   - `test.student@student.unre.ac.pg` (password: `Test123!`)
   - `registrar@unre.ac.pg` (password: `Test123!`)
   - `admissions@unre.ac.pg` (password: `Test123!`)
   - `finance@unre.ac.pg` (password: `Test123!`)
   - `ict@unre.ac.pg` (password: `Test123!`)
3. ✅ Check "Auto Confirm User" for each

---

### Step 3: Setup Test Data (5 min) 📊

**Why:** Create a complete test student with courses and invoices

**How:**
1. Go back to SQL Editor
2. Copy **ALL** of: `.same/CREATE_TEST_USERS.sql`
3. Paste and click "Run"
4. Should see: `✅ TEST USERS SETUP COMPLETE!`

---

### Step 4: Test Application Form (10 min) ✅

**Why:** Verify everything works

**How:**
1. Open: http://localhost:3000/apply
2. Check programs dropdown loads (should show 12 programs)
3. Fill out test application
4. Submit and verify success

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **`.same/RLS_FINAL_WORKING_VERSION.md`** | ⭐ **Read this if you get errors** |
| `.same/QUICK_START_CHECKLIST.md` | Detailed checklist |
| `.same/SESSION_CONTINUATION_SUMMARY.md` | Full session summary |
| `.same/NEXT_STEPS_GUIDE.md` | What to do after setup |
| `.same/RLS_ERROR_FIX.md` | Error troubleshooting |

---

## 🆘 If You Get Errors

### RLS Script Errors
**Read:** `.same/RLS_FINAL_WORKING_VERSION.md` - Section "Errors Encountered and Fixed"

**Common issues:**
- Column name mismatches (all fixed in FIXED version)
- Table doesn't exist (check if database is set up)
- Duplicate policies (script drops them first, safe to re-run)

### Test Users Script Errors
**Check:**
- Did you create the 5 users in Supabase Auth first?
- Did RLS script run successfully?
- Are you using the correct database?

### Application Form Not Working
**Check:**
- Is dev server running? (should see it in terminal)
- Open browser console (F12) for errors
- Check `.env.local` has correct Supabase credentials

---

## ✅ Success Checklist

After completing all 4 steps, verify:

- [ ] RLS script ran without errors
- [ ] 5 test users created in Supabase Auth
- [ ] Test users script ran without errors
- [ ] Application form shows programs dropdown
- [ ] Can submit test application
- [ ] No errors in browser console (F12)

**Run this verification query:**
```sql
-- Should return test student with 6 courses
SELECT
    s.student_id,
    p.program_code,
    COUNT(cr.id) as courses_registered
FROM students s
JOIN programs p ON s.program_id = p.id
LEFT JOIN course_registrations cr ON s.id = cr.student_id
WHERE s.student_id = 'STU-001234'
GROUP BY s.student_id, p.program_code;
```

**Expected:** STU-001234, AGRI-BSC, 6 courses

---

## 🎯 What's Next (After Setup)

Once setup is complete, continue with:

1. **Update Enrollment Form** - Use real fees (45 min)
2. **Update Course Registration** - Use real courses (45 min)
3. **Update Dashboards** - Use real data (1-2 hours)
4. **Testing** - End-to-end workflows (2-3 hours)
5. **Deploy** - Push to production (30 min)

**Total time to production:** 4-6 hours

---

## 📊 What You'll Have

After this 30-minute setup:

✅ **Secure database** with RLS protecting all data
✅ **5 test users** for all roles
✅ **1 complete test student** with courses, invoice, payments
✅ **Working application form** using real programs
✅ **12 programs**, 42 courses, 9 departments populated
✅ **Ready for development** of remaining features

---

## 🚀 Quick Links

- **Supabase SQL:** https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
- **Supabase Auth:** https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/users
- **Application Form:** http://localhost:3000/apply
- **Dev Server:** Terminal where you ran `bun run dev`

---

**👉 BEGIN: Step 1 - Run `.same/RLS_SECURITY_POLICIES_FIXED.sql`**

**Need help?** Read `.same/RLS_FINAL_WORKING_VERSION.md`

**Time Required:** 30 minutes

**Difficulty:** Easy (copy, paste, run)

Let's go! 🚀
