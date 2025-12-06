# UNRE System - Complete Deployment Instructions

## 🚀 Part 1: Database Setup (DO THIS FIRST)

### Step 1: Deploy Base Database Schema

1. Open your Supabase Dashboard:
   👉 https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql

2. Click **"New Query"**

3. Open the file: `.same/supabase-setup.sql`

4. Copy **ALL** content from the file

5. Paste into the SQL Editor

6. Click **"Run"** (or press Ctrl/Cmd + Enter)

7. Wait for success message:
   ```
   UNRE Database setup completed successfully!
   Created 18 tables, indexes, triggers, and RLS policies
   ```

**What this creates:**
- ✅ 18 core tables (users, students, applications, courses, etc.)
- ✅ All ENUM types for status fields
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Seed data (4 departments, 5 programs, 7 courses, 1 semester, fee structures)

---

### Step 2: Deploy Extended Database Schema

1. Still in SQL Editor, click **"New Query"** again

2. Open the file: `.same/extended-database-schema.sql`

3. Copy **ALL** content

4. Paste into SQL Editor

5. Click **"Run"**

6. Wait for success message:
   ```
   Extended UNRE modules setup completed successfully!
   Added: Student Services, Clinic, Library, PR, Clearance, and Bookshop modules
   ```

**What this creates:**
- ✅ 16 additional tables (service requests, clinic, library, etc.)
- ✅ Extended ENUM types
- ✅ Additional RLS policies
- ✅ Helper functions for clearances and fines

**Total System: 34 tables**

---

### Step 3: Verify Database Setup

Run this query to verify all tables were created:

```sql
-- Check all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should return 34 tables
```

Verify seed data:

```sql
-- Check departments
SELECT * FROM departments;

-- Check programs
SELECT * FROM programs;

-- Check current semester
SELECT * FROM semesters WHERE is_current = true;

-- Check fee structures
SELECT * FROM fee_structures;
```

---

## 📦 Part 2: Storage Buckets Setup

### Create 4 Storage Buckets

Go to: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/storage/buckets

Click **"Create a new bucket"** for each:

#### Bucket 1: application-documents

1. **Name**: `application-documents`
2. **Public**: ❌ No (Private)
3. **File size limit**: 5 MB
4. **Allowed MIME types**:
   - `application/pdf`
   - `image/jpeg`
   - `image/png`
   - `image/jpg`

**After creating, set up policies:**

Go to bucket → **Policies** → Click **"New Policy"**

```sql
-- Policy 1: Allow authenticated users to upload
CREATE POLICY "Users can upload application documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'application-documents' AND
  auth.role() = 'authenticated'
);

-- Policy 2: Allow users to view own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Allow staff to view all documents
CREATE POLICY "Staff can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('registrar', 'admissions', 'finance', 'ict_admin')
  )
);
```

#### Bucket 2: student-photos

1. **Name**: `student-photos`
2. **Public**: ✅ Yes (Public access)
3. **File size limit**: 2 MB
4. **Allowed MIME types**:
   - `image/jpeg`
   - `image/png`
   - `image/jpg`

**Policies:**

```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'student-photos' AND
  auth.role() = 'authenticated'
);

-- Public read access
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-photos');
```

#### Bucket 3: offer-letters

1. **Name**: `offer-letters`
2. **Public**: ❌ No (Private)
3. **File size limit**: 5 MB
4. **Allowed MIME types**: `application/pdf`

**Policies:**

```sql
-- System can create offer letters
CREATE POLICY "System can create offer letters"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'offer-letters' AND
  auth.role() = 'authenticated'
);

-- Students can view own offer letters, staff can view all
CREATE POLICY "Students can view own offer letters"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'offer-letters' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'admissions', 'ict_admin')
    )
  )
);
```

#### Bucket 4: receipts

1. **Name**: `receipts`
2. **Public**: ❌ No (Private)
3. **File size limit**: 2 MB
4. **Allowed MIME types**: `application/pdf`

**Policies:**

```sql
-- System can create receipts
CREATE POLICY "System can create receipts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'receipts' AND
  auth.role() = 'authenticated'
);

-- Students can view own receipts
CREATE POLICY "Students can view own receipts"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'receipts' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('finance', 'ict_admin')
    )
  )
);
```

---

## 🔐 Part 3: Authentication Configuration

### Enable Email Provider

Go to: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/providers

1. Click on **"Email"**
2. Toggle **ON**
3. **Enable email confirmations**: ✅ Yes
4. **Secure email change**: ✅ Yes
5. **Enable Sign Ups**: ✅ Yes

### Configure Email Templates

Go to: **Authentication** → **Email Templates**

#### Magic Link Template (for OTP):

Subject: `Sign in to UNRE Student Portal`

Body:
```html
<h2>Sign in to UNRE Student Portal</h2>
<p>Hello,</p>
<p>Use this code to sign in:</p>
<h1 style="font-size: 32px; font-weight: bold; text-align: center; background: #059669; color: white; padding: 20px; border-radius: 8px;">
  {{ .Token }}
</h1>
<p>This code expires in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
<br>
<p style="color: #666;">
  University of Natural Resources and Environment<br>
  Student Registration System
</p>
```

### Configure URL Settings

Go to: **Authentication** → **URL Configuration**

**Site URL**: `http://localhost:3000`
(Change to production URL when deploying)

**Redirect URLs** (add all):
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/portal/student`
- `http://localhost:3000/portal/registrar`
- `http://localhost:3000/portal/admissions`
- `http://localhost:3000/portal/finance`
- `http://localhost:3000/portal/admin`

When deploying to production, add your production URLs.

---

## 👤 Part 4: Create First Admin User

### Option 1: Via Dashboard

1. Go to: **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. **Email**: your-email@unre.edu.pg
4. **Password**: Create a strong password
5. **Auto Confirm User**: ✅ Yes
6. Click **"Create user"**

### Option 2: Via SQL (After creating via dashboard)

```sql
-- Update user role to ICT Admin
UPDATE public.users
SET role = 'ict_admin'
WHERE email = 'your-email@unre.edu.pg';
```

---

## ✅ Part 5: Verify Everything Works

### Test 1: Database Connection

Visit: http://localhost:3000/test-connection

Should show: ✅ **"Supabase fully connected and database is set up!"**

### Test 2: Authentication

1. Visit: http://localhost:3000/login
2. Enter your email
3. Check email for OTP code
4. Enter code and sign in
5. Should redirect to appropriate portal

### Test 3: Storage Upload

Try uploading a file in the application form:
1. Visit: http://localhost:3000/apply
2. Complete form and upload documents
3. Check Supabase Storage to see files

---

## 🎯 Checklist

Before moving to next phase, confirm:

- [ ] Base SQL schema executed successfully (18 tables)
- [ ] Extended SQL schema executed successfully (16 tables)
- [ ] All 34 tables visible in database
- [ ] Seed data present (departments, programs, courses)
- [ ] 4 storage buckets created
- [ ] Storage policies configured
- [ ] Email provider enabled
- [ ] Email templates configured
- [ ] URL configuration set
- [ ] First admin user created
- [ ] User role updated to ict_admin
- [ ] Test connection page shows success
- [ ] Can log in with OTP
- [ ] Can upload files to storage

---

## 🚨 Troubleshooting

### "relation does not exist" error
→ SQL script not run completely. Re-run the scripts.

### "RLS policy violation"
→ User not authenticated or wrong role. Check user record.

### Storage upload fails
→ Check storage policies are created correctly.

### Email not sending
→ For production, configure SMTP settings in Authentication → Settings

### OTP not working
→ Check email template is configured and email provider is enabled.

---

## 📞 Need Help?

- Check `.same/SUPABASE_SETUP_GUIDE.md` for detailed setup
- Review `.same/INTEGRATED_MODULES_SUMMARY.md` for module overview
- Contact UNRE ICT Services

---

**Once all checkboxes are checked, your database is ready and authentication is configured! The application code will now work with real data.** ✅
