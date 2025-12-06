# Testing the Application Form Integration 🎯

## 🎉 What's Been Built

I've just completed the **full integration** of the application form! Here's what's new:

### ✅ Features Implemented

1. **Real Database Integration**
   - Form data saves to `applications` table in Supabase
   - Uses actual program data from database
   - Generates unique application IDs (format: UNRE-2025-XXXX)

2. **File Upload System**
   - Documents upload to Supabase Storage
   - Organized into folders:
     - `application-documents/grade12_certificates/`
     - `application-documents/transcripts/`
     - `application-documents/national_ids/`
     - `student-photos/applicants/`

3. **Smart UI**
   - Loading states during submission
   - Success message with application ID
   - Error handling with user-friendly messages
   - Real-time form validation

4. **Backend API**
   - `/api/applications/submit` - Handles form submission
   - `/api/programs` - Fetches active programs from database

---

## 🧪 How to Test

### Step 1: Start the Dev Server

If the dev server isn't running, start it:

```bash
cd unre-registration-system
bun run dev
```

The app should be available in your Same.new preview panel.

---

### Step 2: Navigate to Application Form

1. In the preview, go to the homepage (`/`)
2. Click **"Apply Now"** button
3. You should see the 4-step application form

---

### Step 3: Fill Out the Form

**Step 1 - Personal Information:**
- First Name: John
- Last Name: Doe
- Email: john.doe@example.com
- Phone: +675 7123 4567
- Date of Birth: 2000-01-01
- Gender: Male
- Nationality: Papua New Guinean
- National ID: A123456

**Step 2 - Contact Details:**
- Street: 123 Main Street
- City: Port Moresby
- Province: National Capital District
- Country: Papua New Guinea
- Emergency Contact Name: Jane Doe
- Relationship: Mother
- Emergency Phone: +675 7234 5678

**Step 3 - Academic Information:**
- Select a program from the dropdown (should load real programs from database!)
- Previous School: Port Moresby Grammar School
- Year Completed: 2024

**Step 4 - Documents:**
- Upload any PDF for Grade 12 Certificate
- Upload any PDF for Transcript
- Upload any image for National ID
- Upload any image for Photo

---

### Step 4: Submit the Application

1. Click **"Submit Application"** button
2. The button should show **"Submitting..."**
3. Files will upload to Supabase Storage
4. Data will save to database

---

### Step 5: Verify Success

**You should see:**
- ✅ Green success card at the top
- ✅ Your unique Application ID (e.g., UNRE-2025-1234)
- ✅ Success message with next steps
- ✅ Links to "Go to Student Portal" and "Back to Home"

---

## 🔍 Verify in Supabase

### Check Database

1. Go to Supabase Dashboard:
   👉 https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/editor

2. Open **Table Editor**

3. Select **`applications`** table

4. You should see your new application with:
   - ✅ applicant_email: john.doe@example.com
   - ✅ first_name: John
   - ✅ last_name: Doe
   - ✅ status: submitted
   - ✅ program_id: (UUID of selected program)
   - ✅ documents: JSON with file URLs

---

### Check Storage

1. Go to Supabase Storage:
   👉 https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/storage/buckets

2. Open **`application-documents`** bucket

3. You should see folders with your uploaded files:
   - `grade12_certificates/UNRE-2025-XXXX_...`
   - `transcripts/UNRE-2025-XXXX_...`
   - `national_ids/UNRE-2025-XXXX_...`

4. Open **`student-photos`** bucket

5. You should see:
   - `applicants/UNRE-2025-XXXX_...`

---

## 🎯 What to Look For

### ✅ Success Indicators

- Form submits without errors
- Application ID is displayed
- Data appears in Supabase `applications` table
- Files appear in Supabase Storage buckets
- Success message shows correct email
- Loading state shows during submission

### ❌ Common Issues & Fixes

**Issue: "Failed to submit application"**
- **Check:** Are all storage buckets created?
- **Fix:** Create the 4 buckets as per NEXT_STEPS_STORAGE.md

**Issue: "Failed to fetch programs"**
- **Check:** Is the database connection working?
- **Fix:** Verify Supabase credentials in .env.local

**Issue: "File upload failed"**
- **Check:** Are the files too large?
- **Fix:** Use smaller files (< 5MB for docs, < 2MB for photos)

**Issue: Programs dropdown is empty**
- **Check:** Are there active programs in the database?
- **Fix:** The seed data should have created programs. Check `programs` table.

---

## 🔧 Technical Details

### API Endpoints

**POST /api/applications/submit**
- Accepts: `multipart/form-data`
- Returns: `{ success, applicationId, message }`
- Files: Uploaded to Supabase Storage
- Data: Saved to `applications` table

**GET /api/programs**
- Returns: `{ programs: [{ id, name }] }`
- Fetches: Active programs from database

### Database Schema

**applications** table fields used:
- applicant_email
- applicant_phone
- first_name
- last_name
- middle_name
- program_id (foreign key to programs)
- status (defaults to 'submitted')
- documents (JSONB with file URLs)
- application_date

### File Naming Convention

Files are named: `{applicationId}_{timestamp}_{originalFilename}`

Example: `UNRE-2025-1234_1701234567890_certificate.pdf`

---

## 📊 Next Features to Build

After confirming the application form works:

1. **Staff Dashboard Integration**
   - View submitted applications
   - Approve/reject applications
   - Generate offer letters

2. **Email Notifications**
   - Send confirmation email on submission
   - Send status update emails

3. **Application Tracking**
   - Students can track application status
   - View application history

4. **Document Verification**
   - Staff can verify uploaded documents
   - Mark documents as verified/rejected

---

## 🎉 Summary

You now have a **fully functional application form** that:
- ✅ Saves data to Supabase database
- ✅ Uploads files to Supabase Storage
- ✅ Generates unique application IDs
- ✅ Provides real-time feedback
- ✅ Uses real program data
- ✅ Handles errors gracefully

**Ready to test!** Navigate to `/apply` in your preview and submit a test application! 🚀
