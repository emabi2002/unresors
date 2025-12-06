# UNRE System - Quick Start Guide 🚀

## ✅ What Just Happened

I fixed the database schema error you encountered! The issue was with the syntax for adding new user roles to the PostgreSQL enum type.

**Error you saw:**
```
ERROR: 22P02: invalid input value for enum user_role: "student_services"
```

**What I did:**
1. ✅ Fixed the original `extended-database-schema.sql` file
2. ✅ Created a NEW step-by-step script that's much more robust
3. ✅ Added comprehensive error handling
4. ✅ Created this quick start guide

---

## 🎯 Next Steps (Do This Now!)

### Step 1: Run the Extended Database Schema (TWO PARTS!)

You already ran the **base schema** (18 tables). Now run the **extended schema** (16 more tables).

**IMPORTANT:** Due to PostgreSQL enum limitations, this must be done in **TWO PARTS**:

#### Part 1: Add Enum Values (2 seconds)

1. Open Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
   ```

2. Click **"New Query"**

3. Open this file in Same: `.same/extended-schema-part1-enums.sql`

4. **Copy ALL the content**

5. **Paste** into the Supabase SQL Editor

6. Click **"Run"**

7. Wait for success message:
   ```
   ✅ PART 1 COMPLETE!
   ✅ Added 6 new user roles
   ✅ Created 9 new enum types
   ```

#### Part 2: Create Tables and Policies (10 seconds)

**Wait 5-10 seconds after Part 1 completes!**

1. Click **"New Query"** again

2. Open this file in Same: `.same/extended-schema-part2-tables.sql`

3. **Copy ALL the content** (it's larger)

4. **Paste** into the Supabase SQL Editor

5. Click **"Run"**

6. Wait for success message:
   ```
   ✅ PART 2 COMPLETE!
   🎉 DATABASE SETUP COMPLETE!
   🎉 Total tables in system: 34
   ```

**Full details:** See `.same/TWO_PART_DEPLOYMENT.md`

### Step 2: Verify It Worked

Run this query in Supabase to verify:

```sql
-- Count tables (should be 34 total)
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public';

-- List all new module tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'service_requests', 'clinic_visits', 'library_items',
    'library_transactions', 'student_id_cards', 'meal_numbers',
    'laptop_inventory', 'laptop_assignments', 'laptop_setup_progress',
    'department_clearances', 'overall_clearance'
  )
ORDER BY table_name;
```

**Expected result:** Should show 11+ tables from the new modules.

### Step 3: Create Storage Buckets

Follow the detailed guide in `.same/DEPLOYMENT_INSTRUCTIONS.md` Section "Part 2: Storage Buckets Setup"

Or quick version:

1. Go to: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/storage/buckets
2. Create 4 buckets:
   - `application-documents` (private)
   - `student-photos` (public)
   - `offer-letters` (private)
   - `receipts` (private)

3. Set up storage policies (see deployment guide for exact SQL)

### Step 4: Test Connection

Visit: http://localhost:3000/test-connection

Should show:
```
✅ Supabase fully connected and database is set up!
```

---

## 📚 Available Scripts

You now have **3 different schema scripts** to choose from:

| File | Purpose | When to Use |
|------|---------|-------------|
| `supabase-setup.sql` | Base 18 tables | ✅ Run this FIRST (already done) |
| `extended-schema-step-by-step.sql` | Extended 16 tables | ⭐ **USE THIS NOW** (most robust) |
| `extended-database-schema.sql` | Extended 16 tables | Alternative (fixed but less error-tolerant) |

**IMPORTANT:** Always use `extended-schema-step-by-step.sql` - it handles errors better!

---

## 🔍 What's Different in the New Script?

The **step-by-step** script is better because:

1. ✅ **Better error handling** - Uses `CREATE IF NOT EXISTS`
2. ✅ **Graceful duplicate handling** - Won't fail if things already exist
3. ✅ **Can run multiple times** - Safe to re-run if needed
4. ✅ **Clear sections** - Organized into 8 parts for easier debugging
5. ✅ **Better messages** - Shows exactly what was created

---

## 🎓 What You're Building

After the extended schema is deployed, you'll have:

### **34 Total Database Tables:**

**Core System (18 tables):**
- users, students, applications
- programs, departments, courses
- course_registrations, semesters
- invoices, payments, enrollments
- clearances, audit_logs
- offer_letters, academic_advisors
- application_documents, fee_structures

**Extended Modules (16 tables):**
- **Student Services:** service_requests, service_request_updates
- **Clinic:** clinic_visits, counseling_sessions, welfare_assessments
- **Library:** library_items, library_transactions, library_fines
- **Public Relations:** student_id_cards, meal_numbers, id_card_replacements
- **Laptop Provisioning:** laptop_inventory, laptop_assignments, laptop_setup_progress
- **Clearance:** department_clearances, overall_clearance

### **User Roles:**
- student, registrar, finance, admissions, ict_admin
- department_head, academic_advisor, dean
- **NEW:** student_services, clinic_staff, counselor, librarian, pr_staff, bookshop_staff

---

## 🛠️ Troubleshooting

### "Duplicate object" errors
**Status:** ✅ NORMAL - Means it already exists
**Action:** Ignore and continue

### "Type already exists" errors
**Status:** ✅ NORMAL - Enum type already created
**Action:** Ignore and continue

### "Function does not exist" errors
**Status:** ⚠️ Check if base schema was run
**Action:** Run `supabase-setup.sql` first

### "Cannot find table" errors
**Status:** ⚠️ Schema incomplete
**Action:** Re-run the script or run in parts

---

## 📖 Documentation Files

I've created several guides to help you:

| File | Purpose |
|------|---------|
| `DATABASE_FIX_GUIDE.md` | Explains the error and fix in detail |
| `DEPLOYMENT_INSTRUCTIONS.md` | Complete deployment walkthrough |
| `SUPABASE_SETUP_GUIDE.md` | Detailed Supabase configuration |
| `AZURE_AD_SETUP_GUIDE.md` | Office 365 / Azure AD integration |
| `INTEGRATED_MODULES_SUMMARY.md` | Overview of all modules |
| `todos.md` | Development progress tracker |
| `QUICK_START.md` | This file! |

---

## ✅ Deployment Checklist

Use this to track your progress:

- [x] **Base Schema Deployed** - 18 core tables
- [ ] **Extended Schema Deployed** - 16 module tables ⬅️ **DO THIS NOW**
- [ ] **Storage Buckets Created** - 4 buckets
- [ ] **Storage Policies Set** - Upload and access policies
- [ ] **Email Auth Configured** - Email provider enabled
- [ ] **Test Connection Passed** - Connection page shows success
- [ ] **First Admin User Created** - ICT admin account
- [ ] **Ready for Integration** - Start building features!

---

## 🚀 After Database Setup

Once the database is complete, we'll move on to:

1. **Connect Application Form** - Save submissions to database
2. **Implement Real Authentication** - Replace mock login with real auth
3. **Build Staff Dashboards** - Functional dashboards for all roles
4. **Payment Integration** - BSP Pay, Kina Bank, etc.
5. **Email Notifications** - OTP, status updates, etc.
6. **File Upload System** - Document management
7. **Reporting & Analytics** - Dashboard metrics

---

## 🎯 Summary

**What you need to do RIGHT NOW:**

1. ✅ Open Supabase SQL Editor
2. ✅ Copy content from `.same/extended-schema-step-by-step.sql`
3. ✅ Paste and run in Supabase
4. ✅ Verify 34 tables exist
5. ✅ Create 4 storage buckets
6. ✅ Test connection page

**Time estimate:** 10-15 minutes

**After this:** Your database will be 100% complete and ready for the application to use! 🎉

---

**Need help?** Check the other documentation files or contact ICT Services.

**Current Version:** 12 - Database Schema Error Fixed ✅
