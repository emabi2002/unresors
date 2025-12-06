# Deploy to GitHub - Step by Step Instructions

## 🎯 Goal
Deploy all the enrollment registration form code to: https://github.com/emabi2002/unresors.git

---

## 📦 What's Ready to Deploy

All code has been committed locally in Same.new:
- ✅ **Commit SHA**: bc3757e
- ✅ **73 files** ready to push
- ✅ **17,000+ lines** of code
- ✅ **All documentation** included

**All changes include:**
1. Complete enrollment registration form (matches manual form 100%)
2. Course registration system
3. Authentication system with Office 365 SSO
4. Protected routes middleware
5. Student dashboard with real data
6. All 4 staff portals
7. Application submission form
8. Complete documentation

---

## 🚀 Deployment Options

### **Option 1: Download & Push from Your Computer** (Recommended)

#### Step 1: Download Project
1. In Same.new, click the project name at the top
2. Select "Download Project" or use the menu
3. Save the ZIP file to your computer
4. Extract the ZIP file

#### Step 2: Push to GitHub
Open terminal/command prompt in the extracted folder:

```bash
# Navigate to the project folder
cd unre-registration-system

# Initialize git (if not already)
git init
git branch -M main

# Add remote repository
git remote add origin https://github.com/emabi2002/unresors.git

# Add all files
git add -A

# Commit with message
git commit -m "Add comprehensive enrollment registration form matching manual form

Complete online registration system with:
- Enrollment form (4 sections, 50+ fields)
- Course registration
- Authentication & login
- Student & staff portals
- Database schemas & RLS policies
- Complete documentation

Matches manual REGISTRATION OF ENROLLMENT form exactly!

🤖 Generated with Same (https://same.new)
Co-Authored-By: Same <noreply@same.new>"

# Push to GitHub (force push to ensure clean state)
git push -u origin main --force
```

#### Step 3: Enter Credentials
When prompted:
- **Username**: emabi2002
- **Password**: Your GitHub Personal Access Token (NOT your GitHub password)

**Don't have a token?** Create one:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "UNRE Deployment"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

---

### **Option 2: Use GitHub Desktop** (Easiest for Non-Technical Users)

#### Step 1: Install GitHub Desktop
Download from: https://desktop.github.com

#### Step 2: Sign in to GitHub
Open GitHub Desktop and sign in with your GitHub account

#### Step 3: Clone Repository
1. File → Clone Repository
2. URL: `https://github.com/emabi2002/unresors.git`
3. Choose a folder on your computer
4. Click "Clone"

#### Step 4: Copy Files
1. Download the project from Same.new (as ZIP)
2. Extract the ZIP
3. Copy ALL files from `unre-registration-system` folder
4. Paste into the cloned repository folder
5. **Replace** all existing files

#### Step 5: Commit and Push
1. In GitHub Desktop, you'll see all changes
2. Write commit message: "Add enrollment registration form"
3. Click "Commit to main"
4. Click "Push origin"
5. Done! ✅

---

### **Option 3: Use Same.new Integration** (If Available)

If Same.new has GitHub integration enabled:
1. Click "Deployed" panel at top right
2. Look for "Connect to GitHub" option
3. Authorize Same.new to access your GitHub
4. Select repository: emabi2002/unresors
5. Click "Deploy"

---

## ✅ Verify Deployment

After pushing, verify:

1. **Check GitHub Repository**
   - Go to: https://github.com/emabi2002/unresors
   - Verify you see all files
   - Check latest commit message

2. **Check File Count**
   - Should have 73+ files
   - Look for `src/app/portal/student/enroll/page.tsx`
   - Verify `.same/` folder exists with documentation

3. **Verify Key Files**
   - ✅ `src/app/portal/student/enroll/page.tsx` (enrollment form)
   - ✅ `src/middleware.ts` (protected routes)
   - ✅ `.same/enrollment-registration-table.sql` (database)
   - ✅ `netlify.toml` (deployment config)

---

## 🌐 After GitHub Deploy: Redeploy on Netlify

Once code is on GitHub:

### Step 1: Go to Netlify
https://app.netlify.com

### Step 2: Find Your Site
Look for: **same-r0vlmzkaklc-latest**

### Step 3: Trigger Deploy
1. Go to "Deploys" tab
2. Click "Trigger deploy"
3. Select "Deploy site"
4. Wait 2-3 minutes for build

### Step 4: Verify Live Site
Visit: https://same-r0vlmzkaklc-latest.netlify.app

**Test these URLs:**
- `/` - Homepage ✅
- `/login` - Login page ✅
- `/apply` - Application form ✅
- `/portal/student` - Student dashboard (after login) ✅
- `/portal/student/enroll` - **NEW enrollment form** ✅

---

## 🗄️ Don't Forget the Database!

After deploying code, you MUST run the SQL script:

### Step 1: Go to Supabase
https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/sql

### Step 2: Run SQL Script
1. Open file: `.same/enrollment-registration-table.sql`
2. Copy ALL contents (entire file)
3. Paste into Supabase SQL Editor
4. Click "Run"
5. Wait for success message

**This creates:**
- `student_enrollments` table
- RLS policies for security
- Additional student fields
- Indexes for performance

---

## 🐛 Troubleshooting

### Error: "Authentication failed"
**Solution**: You need a Personal Access Token, not your GitHub password
- Create token at: https://github.com/settings/tokens
- Use token as password when pushing

### Error: "Repository not found"
**Solution**: Check repository URL spelling
- Correct: `https://github.com/emabi2002/unresors.git`
- Verify you have access to this repository

### Error: "Permission denied"
**Solution**: Make sure you're logged in as emabi2002
- Check with: `git config user.name`
- Set with: `git config user.name "emabi2002"`

### Push is slow or stuck
**Solution**: Large file size is normal for first push
- Project is ~17,000 lines of code
- May take 2-5 minutes
- Don't cancel, just wait

---

## 📋 Deployment Checklist

Before deploying:
- [ ] Downloaded project from Same.new
- [ ] Extracted ZIP file
- [ ] Have GitHub credentials ready
- [ ] Have Personal Access Token (if using terminal)

After deploying:
- [ ] Verified files on GitHub
- [ ] Triggered Netlify redeploy
- [ ] Ran SQL script in Supabase
- [ ] Tested enrollment form works
- [ ] Checked all URLs load correctly

---

## 📞 Need Help?

### GitHub Issues:
- Personal Access Token: https://github.com/settings/tokens
- GitHub Support: https://support.github.com

### Netlify Issues:
- Dashboard: https://app.netlify.com
- Docs: https://docs.netlify.com

### Supabase Issues:
- Dashboard: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi
- SQL Editor: Add `/sql` to end of dashboard URL

---

## 🎯 Quick Commands Reference

```bash
# Clone repository
git clone https://github.com/emabi2002/unresors.git

# Check status
git status

# Add all files
git add -A

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push origin main

# Force push (if needed)
git push origin main --force

# View commit history
git log --oneline

# Check remote URL
git remote -v
```

---

## ✅ Success Indicators

You'll know it worked when:
1. ✅ GitHub shows latest commit with your message
2. ✅ All 73+ files visible on GitHub
3. ✅ Netlify build succeeds (green checkmark)
4. ✅ Website loads at Netlify URL
5. ✅ Enrollment form accessible at `/portal/student/enroll`
6. ✅ Database table created in Supabase

---

**Ready to deploy!** Choose your preferred method above and follow the steps.

If you run into any issues, check the troubleshooting section or try a different deployment method.

**Good luck! 🚀**
