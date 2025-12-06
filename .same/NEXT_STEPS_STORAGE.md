# Next Step: Create Storage Buckets 📦

## 🎉 Congratulations!

Your database is **100% complete** with all 34 tables!

Let's verify first, then set up storage.

---

## ✅ Step 1: Verify Database (30 seconds)

Run this query in Supabase to confirm:

```sql
SELECT COUNT(*) as total_tables
FROM information_schema.tables
WHERE table_schema = 'public';
```

**Expected result:** `34`

---

## 📦 Step 2: Create Storage Buckets (5 minutes)

Storage buckets are where we'll store uploaded files (documents, photos, receipts, etc.)

### **Go to Storage:**
👉 https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/storage/buckets

### **Create 4 Buckets:**

Click **"Create a new bucket"** for each of these:

---

#### **Bucket 1: Application Documents** 📄

**Settings:**
- **Name:** `application-documents`
- **Public bucket:** ❌ **Uncheck** (keep it private)
- **File size limit:** 5 MB (optional)
- **Allowed MIME types:** Leave blank for now

Click **"Create bucket"**

**Purpose:** Stores student application files (Grade 12 certificates, transcripts, IDs, etc.)

---

#### **Bucket 2: Student Photos** 📸

**Settings:**
- **Name:** `student-photos`
- **Public bucket:** ✅ **Check** (make it public)
- **File size limit:** 2 MB (optional)
- **Allowed MIME types:** Leave blank for now

Click **"Create bucket"**

**Purpose:** Stores student profile photos (for ID cards, portal display)

---

#### **Bucket 3: Offer Letters** 📨

**Settings:**
- **Name:** `offer-letters`
- **Public bucket:** ❌ **Uncheck** (keep it private)
- **File size limit:** 5 MB (optional)
- **Allowed MIME types:** Leave blank for now

Click **"Create bucket"**

**Purpose:** Stores generated offer letters for accepted students

---

#### **Bucket 4: Payment Receipts** 🧾

**Settings:**
- **Name:** `receipts`
- **Public bucket:** ❌ **Uncheck** (keep it private)
- **File size limit:** 2 MB (optional)
- **Allowed MIME types:** Leave blank for now

Click **"Create bucket"**

**Purpose:** Stores payment receipts and transaction confirmations

---

## ✅ Step 3: Verify Buckets Created

After creating all 4, you should see them listed:

- ✅ `application-documents` (Private)
- ✅ `student-photos` (Public)
- ✅ `offer-letters` (Private)
- ✅ `receipts` (Private)

---

## 🔐 Step 4: Storage Policies (Optional - Can Do Later)

For now, we'll skip detailed storage policies. The application will use the Supabase **service role key** for uploads, which bypasses RLS.

**If you want to set up policies now**, see `.same/DEPLOYMENT_INSTRUCTIONS.md` Part 2 for detailed policy SQL.

---

## 🔑 Step 5: Enable Email Authentication (2 minutes)

### **Go to Authentication Providers:**
👉 https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/providers

1. Find **"Email"** in the list
2. Click to expand
3. Toggle **"Enable Email provider"** to **ON**
4. Settings:
   - **Enable email confirmations:** ✅ Yes
   - **Secure email change:** ✅ Yes
   - **Enable Sign Ups:** ✅ Yes
5. Click **"Save"**

---

## 🧪 Step 6: Test Connection (30 seconds)

Visit your test connection page:

👉 http://localhost:3000/test-connection

**Expected result:**
```
✅ Supabase Connection Status: Connected
✅ Can query database: Yes
✅ Database tables: 34 found
✅ All systems operational!
```

---

## 🎯 What You've Accomplished

- ✅ **Database:** 34 tables with all modules
- ✅ **Storage:** 4 buckets for file uploads
- ✅ **Authentication:** Email provider enabled
- ✅ **Connection:** Verified and working

---

## ⏭️ Next Steps After This

Once storage and auth are set up:

1. **Test the application form** - Try submitting a test application
2. **Build API routes** - Create endpoints for form submission
3. **Connect dashboards** - Replace mock data with real database queries
4. **Implement file upload** - Wire up document uploads to storage
5. **Add email notifications** - OTP codes, status updates
6. **Deploy to production** - When ready!

---

## 📚 Additional Resources

- **Storage Policies:** `.same/DEPLOYMENT_INSTRUCTIONS.md` - Part 2
- **Auth Configuration:** `.same/SUPABASE_SETUP_GUIDE.md` - Step 3
- **Azure AD / Office 365:** `.same/AZURE_AD_SETUP_GUIDE.md`
- **Full System Overview:** `.same/INTEGRATED_MODULES_SUMMARY.md`

---

**You're doing great! Just a few more quick setup steps and you'll have a fully operational backend!** 🚀
