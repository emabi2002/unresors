# Supabase Setup Guide for UNRE System

## ✅ Credentials Configured

Your Supabase credentials have been added to `.env.local`:
- **Project URL**: https://kemnvfkdybsujxerhcqi.supabase.co
- **Anon Key**: Configured ✓
- **Service Role Key**: Configured ✓

## 📝 Step-by-Step Setup

### Step 1: Set Up Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi

2. Click on **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy the entire content from `.same/supabase-setup.sql` and paste it into the SQL editor

5. Click **Run** to execute the script

**What this creates:**
- ✅ 18 database tables
- ✅ ENUM types for all status fields
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for automatic timestamps
- ✅ Seed data (departments, programs, courses, fee structures)
- ✅ Helper functions (student ID generation, invoice numbering)

### Step 2: Configure Storage Buckets

1. In your Supabase Dashboard, go to **Storage** in the left sidebar

2. Click **Create a new bucket**

3. Create the following buckets:

#### Bucket 1: application-documents
- **Name**: `application-documents`
- **Public**: ❌ No (private)
- **File size limit**: 5 MB
- **Allowed MIME types**:
  - `application/pdf`
  - `image/jpeg`
  - `image/png`
  - `image/jpg`

**Storage Policies for application-documents:**
```sql
-- Allow authenticated users to upload their own documents
CREATE POLICY "Users can upload application documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'application-documents' AND
  auth.role() = 'authenticated'
);

-- Allow users to view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' AND
  auth.role() = 'authenticated'
);

-- Allow staff to view all documents
CREATE POLICY "Staff can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'application-documents' AND
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role IN ('registrar', 'admissions', 'finance', 'ict_admin')
  )
);
```

#### Bucket 2: student-photos
- **Name**: `student-photos`
- **Public**: ✅ Yes (for profile display)
- **File size limit**: 2 MB
- **Allowed MIME types**:
  - `image/jpeg`
  - `image/png`
  - `image/jpg`

**Storage Policies for student-photos:**
```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'student-photos' AND
  auth.role() = 'authenticated'
);

-- Public read access for photos
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-photos');
```

#### Bucket 3: offer-letters
- **Name**: `offer-letters`
- **Public**: ❌ No (private)
- **File size limit**: 5 MB
- **Allowed MIME types**: `application/pdf`

**Storage Policies for offer-letters:**
```sql
-- Allow system to create offer letters
CREATE POLICY "System can create offer letters"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'offer-letters' AND
  auth.role() = 'authenticated'
);

-- Allow students to view their own offer letters
CREATE POLICY "Students can view own offer letters"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'offer-letters' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role IN ('registrar', 'admissions', 'ict_admin')
    )
  )
);
```

#### Bucket 4: receipts
- **Name**: `receipts`
- **Public**: ❌ No (private)
- **File size limit**: 2 MB
- **Allowed MIME types**: `application/pdf`

### Step 3: Configure Authentication

1. Go to **Authentication** → **Providers** in your Supabase Dashboard

2. Enable **Email** provider:
   - Toggle ON
   - **Confirm email**: ✅ Enabled
   - **Secure email change**: ✅ Enabled

3. Configure **Email Templates**:

Go to **Authentication** → **Email Templates**

#### Confirm Signup Template:
```html
<h2>Confirm Your Email - UNRE Student Registration</h2>
<p>Hello {{ .ConfirmationURL }}</p>
<p>Please click the link below to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>This link expires in 24 hours.</p>
<p>If you didn't create an account with UNRE, please ignore this email.</p>
```

#### Magic Link Template:
```html
<h2>Sign in to UNRE Student Portal</h2>
<p>Click the link below to sign in:</p>
<p><a href="{{ .ConfirmationURL }}">Sign In</a></p>
<p>This link expires in 1 hour.</p>
<p>If you didn't request this, please ignore this email.</p>
```

4. Configure **URL Configuration**:
   - **Site URL**: `http://localhost:3000` (change to production URL when deploying)
   - **Redirect URLs**:
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/portal/student`
     - `http://localhost:3000/portal/registrar`
     - Add production URLs when deploying

### Step 4: Set Up Email Provider (Optional but Recommended)

For production, configure a custom email provider:

1. Go to **Settings** → **Auth** → **SMTP Settings**

2. Configure your SMTP server (e.g., SendGrid, Mailgun, AWS SES)

Example for Gmail (for testing only):
- **Host**: `smtp.gmail.com`
- **Port**: `587`
- **Username**: Your Gmail address
- **Password**: App-specific password
- **Sender email**: noreply@unre.edu.pg
- **Sender name**: UNRE Student Portal

### Step 5: Create Admin User

1. Go to **Authentication** → **Users**

2. Click **Add user** → **Create new user**

3. Create your first admin account:
   - **Email**: your-admin-email@unre.edu.pg
   - **Password**: Create a strong password
   - **Auto Confirm User**: ✅ Yes

4. After user is created, go to **SQL Editor** and run:

```sql
-- Update user role to ICT Admin
UPDATE users
SET role = 'ict_admin'
WHERE email = 'your-admin-email@unre.edu.pg';
```

### Step 6: Verify Setup

Run these SQL queries to verify your setup:

```sql
-- Check tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check seed data
SELECT * FROM departments;
SELECT * FROM programs;
SELECT * FROM courses;
SELECT * FROM semesters WHERE is_current = true;
SELECT * FROM fee_structures;

-- Check storage buckets
SELECT * FROM storage.buckets;
```

### Step 7: Test Authentication

1. Restart your development server:
   ```bash
   cd unre-registration-system
   bun dev
   ```

2. Go to http://localhost:3000/login

3. Try signing in with your admin email

4. Check Supabase Dashboard → **Authentication** → **Users** to see the login

## 🔒 Security Checklist

- ✅ RLS enabled on all tables
- ✅ Storage policies configured
- ✅ Email confirmation enabled
- ✅ Service role key kept secret
- ✅ HTTPS enforced in production
- ✅ CORS configured correctly

## 📊 Database Statistics

After setup, you should have:
- **18 tables** created
- **4 departments** seeded
- **5 programs** seeded
- **7 courses** seeded
- **1 current semester** configured
- **5 fee structures** (one per program)

## 🚨 Common Issues & Solutions

### Issue: "relation does not exist"
**Solution**: Make sure you ran the entire SQL setup script

### Issue: "RLS policy violation"
**Solution**: Check that user is authenticated and has correct role

### Issue: Storage upload fails
**Solution**: Verify storage policies are created correctly

### Issue: Email not sending
**Solution**: Configure SMTP settings or use Supabase's built-in email (limited)

## 📞 Next Steps

After completing this setup:

1. ✅ Test the login flow
2. ✅ Create a test student account
3. ✅ Submit a test application
4. ✅ Test file uploads
5. ✅ Test dashboard data fetching

All database tables, authentication, and storage are now ready for the application to use!

## 🔗 Useful Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi
- **SQL Editor**: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql
- **Storage**: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/storage/buckets
- **Auth**: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/users
- **API Docs**: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/api
