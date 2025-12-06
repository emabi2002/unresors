# 🔧 RLS Error Fix Guide

## ❌ Error You Encountered

```
Error: Failed to run sql query: ERROR: 42703: column "email" does not exist
```

---

## 🔍 What Happened?

The original RLS script tried to reference a column called `email` in the `applications` table, but the actual column name is **`applicant_email`**.

**In the database schema:**
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  applicant_email TEXT NOT NULL,  ← This is the correct name
  applicant_phone TEXT NOT NULL,
  ...
);
```

**What the script tried to do:**
```sql
CREATE POLICY "Students view own applications" ON applications
  FOR SELECT USING (
    auth.email() = email  ← ERROR: Column "email" doesn't exist!
  );
```

---

## ✅ The Fix

I've created a **FIXED** version of the RLS script:

**File:** `.same/RLS_SECURITY_POLICIES_FIXED.sql`

**What's different:**

1. **Uses correct column name:**
   ```sql
   CREATE POLICY "Students view own applications" ON applications
     FOR SELECT USING (
       auth.email() = applicant_email  ← FIXED: Uses correct column
     );
   ```

2. **Drops existing policies first** to prevent duplicate errors

3. **Better null checking** for approval statuses

---

## 🚀 How to Run the Fixed Script

### Step 1: Go to Supabase SQL Editor
```
https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
```

### Step 2: Copy the FIXED script
Open: `.same/RLS_SECURITY_POLICIES_FIXED.sql`

Copy **ALL** the contents (it's a long file, ~500+ lines)

### Step 3: Paste into SQL Editor
- Click in the SQL Editor text area
- Paste (Ctrl+V / Cmd+V)
- The entire script should appear

### Step 4: Run the script
- Click the **"Run"** button (or press Ctrl+Enter)
- Wait a few seconds for it to execute

### Step 5: Verify success
You should see:
```
✅ ROW LEVEL SECURITY ENABLED!
Total policies created: 60+
🔒 Your data is now protected!

Access Rules:
  ✓ Students: Can only access their own data
  ✓ Admissions: Can manage applications & students
  ✓ Registrar: Can manage enrollments & courses
  ✓ Finance: Can manage invoices & payments
  ✓ ICT Admin: Full system access
  ✓ Public: Can view programs, courses for application
```

---

## 🧪 Test That It's Working

After running the fixed script, test the policies:

### Test 1: Check policies were created
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname
LIMIT 20;
```

**Expected:** Should see policies like "Public read programs", "Students view own applications", etc.

### Test 2: Verify RLS is enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('students', 'applications', 'programs', 'courses')
ORDER BY tablename;
```

**Expected:** All tables should show `rowsecurity = true`

### Test 3: Public can read programs
```sql
-- This should work even without authentication
SELECT program_code, program_name
FROM programs
WHERE is_active = true
LIMIT 5;
```

**Expected:** Should return 5 programs (AGRI-BSC, FOR-BSC, etc.)

---

## 📊 What the Fixed Script Does

### Enables RLS on 15+ tables:
- ✅ `users`
- ✅ `students`
- ✅ `applications` ← Fixed here!
- ✅ `student_enrollments`
- ✅ `course_registrations`
- ✅ `invoices`
- ✅ `payments`
- ✅ `programs`
- ✅ `courses`
- ✅ `departments`
- ✅ `semesters`
- ✅ `fee_structures`
- ✅ `campuses`
- ✅ `provinces`
- ✅ `notifications`
- ✅ `system_settings`

### Creates 60+ security policies:
- **Public access:** Programs, courses, departments (for application form)
- **Student access:** Own data only
- **Admissions access:** Applications and student records
- **Registrar access:** Enrollments and course registrations
- **Finance access:** Invoices and payments
- **ICT Admin access:** Full system access

---

## ⚠️ Important Notes

1. **Always use the FIXED version:** `.same/RLS_SECURITY_POLICIES_FIXED.sql`
   - ❌ Don't use: `RLS_SECURITY_POLICIES.sql` (original, has error)
   - ✅ Use: `RLS_SECURITY_POLICIES_FIXED.sql` (corrected)

2. **Safe to run multiple times:** The script drops existing policies first, so you can run it again if needed

3. **No data is lost:** RLS only adds security, it doesn't delete or modify data

4. **Application form will still work:** Public can still view programs for the application form

---

## 🔄 What to Do Next

After successfully running the fixed RLS script:

1. ✅ **Step 1 Complete** - RLS is now enabled
2. **Move to Step 2:** Create test users in Supabase Auth
3. **Then Step 3:** Run `CREATE_TEST_USERS.sql`
4. **Then Step 4:** Test the application form

See: `.same/QUICK_START_CHECKLIST.md` for the complete checklist

---

## 💡 Why This Error Happened

The error occurred because I initially wrote the RLS policies based on a common naming convention (`email`), but the actual table schema uses `applicant_email`. This is now fixed in the updated script.

**Lesson learned:** Always check the actual database schema before writing policies! 📚

---

## 🆘 Still Having Issues?

If you still get errors after running the fixed script:

1. **Check the exact error message** - It will tell you which policy or table has the issue

2. **Verify your database schema:**
   ```sql
   SELECT column_name, data_type
   FROM information_schema.columns
   WHERE table_name = 'applications'
   ORDER BY ordinal_position;
   ```

3. **Check if tables exist:**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name IN ('students', 'applications', 'programs')
   ORDER BY table_name;
   ```

4. **Contact me with the specific error** and I'll help debug!

---

**✅ Ready to proceed? Run `.same/RLS_SECURITY_POLICIES_FIXED.sql` now!** 🔒
