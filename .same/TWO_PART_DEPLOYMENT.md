# UNRE Extended Schema - Two-Part Deployment Guide

## 🎯 Why Two Parts?

PostgreSQL has a requirement: **new enum values must be committed in a separate transaction before they can be used.**

When we tried to add new user roles (like `student_services`, `clinic_staff`, etc.) and then immediately use them in RLS policies, we got this error:

```
ERROR: 55P04: unsafe use of new value "student_services" of enum type user_role
HINT: New enum values must be committed before they can be used.
```

**Solution:** Split the schema into 2 parts:
1. **Part 1**: Add enum values only (commit)
2. **Part 2**: Create tables, policies, functions (use the new enum values)

---

## 📋 Two-Part Deployment Process

### ✅ Step 1: Run Part 1 (Enum Values)

1. Open Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
   ```

2. Click **"New Query"**

3. In Same, open: `.same/extended-schema-part1-enums.sql`

4. Copy **ALL** content

5. Paste into Supabase SQL Editor

6. Click **"Run"**

7. Wait for success messages:
   ```
   NOTICE: Added user_role: student_services
   NOTICE: Added user_role: clinic_staff
   NOTICE: Added user_role: librarian
   NOTICE: Added user_role: pr_staff
   NOTICE: Added user_role: bookshop_staff
   NOTICE: Added user_role: counselor
   NOTICE: Created enum: service_request_type
   NOTICE: Created enum: service_request_status
   ... (and more)
   ✅ PART 1 COMPLETE!
   ✅ Added 6 new user roles
   ✅ Created 9 new enum types
   ⏭️  NEXT: Run extended-schema-part2-tables.sql
   ```

**What Part 1 Creates:**
- ✅ 6 new user roles added to `user_role` enum
- ✅ 9 new enum types created

**Time:** ~2 seconds

---

### ✅ Step 2: Run Part 2 (Tables, Policies, Functions)

**IMPORTANT:** Wait a few seconds after Part 1 completes to ensure the transaction is committed.

1. **Still in SQL Editor**, click **"New Query"**

2. In Same, open: `.same/extended-schema-part2-tables.sql`

3. Copy **ALL** content (it's a larger file)

4. Paste into Supabase SQL Editor

5. Click **"Run"**

6. Wait for success message:
   ```
   ✅ PART 2 COMPLETE!
   ✅ Created 16 new tables
   ✅ Created 12 indexes for performance
   ✅ Enabled RLS on all tables
   ✅ Created 12 RLS policies
   ✅ Created 2 helper functions
   ✅ Created 3 triggers
   🎉 DATABASE SETUP COMPLETE!
   🎉 Total tables in system: 34
   ```

**What Part 2 Creates:**
- ✅ 16 new tables (service_requests, clinic_visits, library_items, etc.)
- ✅ 12 performance indexes
- ✅ Row Level Security on all tables
- ✅ 12 RLS policies for access control
- ✅ 2 helper functions (clearance check, fine calculation)
- ✅ 3 triggers (auto-update timestamps)

**Time:** ~5-10 seconds

---

## ✅ Step 3: Verify Deployment

Run these verification queries in Supabase:

### Check Total Tables (should be 34)
```sql
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public';
```

### Check New User Roles (should show 6 new roles)
```sql
SELECT e.enumlabel as role
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'user_role'
AND e.enumlabel IN (
  'student_services', 'clinic_staff', 'librarian',
  'pr_staff', 'bookshop_staff', 'counselor'
)
ORDER BY e.enumlabel;
```

### List All New Module Tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'service_requests', 'service_request_updates',
    'clinic_visits', 'counseling_sessions', 'welfare_assessments',
    'library_items', 'library_transactions', 'library_fines',
    'student_id_cards', 'meal_numbers', 'id_card_replacements',
    'laptop_inventory', 'laptop_assignments', 'laptop_setup_progress',
    'department_clearances', 'overall_clearance'
  )
ORDER BY table_name;
```

**Expected:** Should return 16 tables

---

## 📊 What You Now Have

### **Total Database: 34 Tables**

**Core System (18 tables):**
- users, students, applications
- programs, departments, courses
- course_registrations, semesters
- invoices, payments, enrollments
- clearances, audit_logs
- offer_letters, academic_advisors
- application_documents, fee_structures

**Extended Modules (16 tables):**
- **Student Services (2):** service_requests, service_request_updates
- **Clinic & Wellness (3):** clinic_visits, counseling_sessions, welfare_assessments
- **Library (3):** library_items, library_transactions, library_fines
- **Public Relations (3):** student_id_cards, meal_numbers, id_card_replacements
- **Laptop Provisioning (3):** laptop_inventory, laptop_assignments, laptop_setup_progress
- **Clearance System (2):** department_clearances, overall_clearance

### **User Roles (14 total):**

**Core Roles:**
- student, registrar, finance, admissions, ict_admin
- department_head, academic_advisor, dean

**Extended Roles (NEW):**
- student_services, clinic_staff, counselor
- librarian, pr_staff, bookshop_staff

---

## 🗂️ File Reference

| File | Size | Purpose | When to Use |
|------|------|---------|-------------|
| `extended-schema-part1-enums.sql` | 3.5KB | Enum values | ⭐ Run FIRST |
| `extended-schema-part2-tables.sql` | 17KB | Tables, indexes, policies | ⭐ Run SECOND |
| `extended-schema-step-by-step.sql` | 21KB | Single file (has issues) | ❌ Don't use |
| `extended-database-schema.sql` | 20KB | Single file (has issues) | ❌ Don't use |

**Always use the two-part approach!**

---

## 🚨 Troubleshooting

### "Unsafe use of new value" error in Part 2
**Cause:** Part 1 wasn't run first, or not enough time between parts
**Solution:**
1. Make sure Part 1 completed successfully
2. Wait 5-10 seconds
3. Try Part 2 again

### "Type already exists" errors in Part 1
**Status:** ✅ NORMAL - The script handles this
**Action:** Ignore and continue

### "Relation does not exist" error in Part 2
**Cause:** Base schema not run
**Solution:** Run `supabase-setup.sql` first (the 18 core tables)

### "Function update_updated_at_column does not exist"
**Cause:** Base schema not run completely
**Solution:** Re-run `supabase-setup.sql`

---

## ✅ Deployment Checklist

Track your progress:

- [ ] **Part 1 Complete** - Enum values committed
- [ ] **Wait 5-10 seconds** - Let transaction commit
- [ ] **Part 2 Complete** - Tables and policies created
- [ ] **34 Tables Verified** - Total count is correct
- [ ] **16 New Tables Verified** - All module tables present
- [ ] **6 New Roles Verified** - All staff roles added
- [ ] **Ready for Next Steps** - Storage and auth setup

---

## ⏭️ Next Steps After Database

Once both parts are complete:

1. **Create Storage Buckets** (see `DEPLOYMENT_INSTRUCTIONS.md`)
   - `application-documents`
   - `student-photos`
   - `offer-letters`
   - `receipts`

2. **Configure Authentication**
   - Enable email provider
   - Set up email templates
   - Configure redirect URLs

3. **Test Connection**
   - Visit: http://localhost:3000/test-connection
   - Should show: ✅ Success

4. **Start Integration**
   - Connect application form
   - Build staff dashboards
   - Implement workflows

---

## 🎯 Summary

**The Two-Part Process:**
1. ✅ Run Part 1 → Adds enum values
2. ⏸️ Wait 5-10 seconds → Let commit happen
3. ✅ Run Part 2 → Creates everything else
4. 🎉 Complete! → 34 tables ready

**Total Time:** ~15-20 seconds

**Result:** Fully functional UNRE Integrated Student Information System database with all 6 modules operational!

---

**Questions?** Check other guides:
- `DATABASE_FIX_GUIDE.md` - Explains why we need two parts
- `DEPLOYMENT_INSTRUCTIONS.md` - Complete deployment walkthrough
- `QUICK_START.md` - Quick reference guide
- `INTEGRATED_MODULES_SUMMARY.md` - What you're building

---

**Current Version:** 12 - Two-Part Deployment Ready ✅
