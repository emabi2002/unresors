# Azure AD / Office 365 SSO Setup Guide 🔐

This guide will help you configure Microsoft Azure AD for Office 365 Single Sign-On (SSO) in your UNRE Student Registration System.

---

## 📋 Prerequisites

You need:
- ✅ Access to **Azure Portal** (https://portal.azure.com)
- ✅ **Global Administrator** or **Application Administrator** role in Azure AD
- ✅ UNRE Office 365 tenant (e.g., `unre.edu.pg`)
- ✅ Supabase project credentials

---

## Step 1: Register Application in Azure Portal

### 1.1 Access Azure Portal

1. Go to: https://portal.azure.com
2. Sign in with your UNRE admin account
3. Navigate to **Azure Active Directory**

### 1.2 Register New Application

1. In left sidebar, click **"App registrations"**
2. Click **"+ New registration"**
3. Fill in the form:

```
Name: UNRE Student Registration System
Supported account types:
  ☑ Accounts in this organizational directory only (UNRE only - Single tenant)
Redirect URI:
  Platform: Web
  URI: https://kemnvfkdybsujxerhcqi.supabase.co/auth/v1/callback
```

4. Click **"Register"**

### 1.3 Note Important IDs

After registration, you'll see the **Overview** page. **Copy and save** these values:

```
Application (client) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Directory (tenant) ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**⚠️ You'll need these for Supabase configuration!**

---

## Step 2: Configure Authentication

### 2.1 Add Redirect URIs

1. In your app, go to **"Authentication"** (left sidebar)
2. Under **"Platform configurations"**, find **"Web"**
3. Click **"Add URI"**
4. Add these redirect URIs:

```
Production:
https://kemnvfkdybsujxerhcqi.supabase.co/auth/v1/callback

Development (optional):
http://localhost:3000/auth/callback
```

5. Scroll down to **"Implicit grant and hybrid flows"**
6. **Check** these boxes:
   - ☑ ID tokens (used for implicit and hybrid flows)
7. Click **"Save"**

### 2.2 Configure Token Configuration

1. Go to **"Token configuration"** (left sidebar)
2. Click **"+ Add optional claim"**
3. Select **"ID"** token type
4. Check these claims:
   - ☑ email
   - ☑ family_name
   - ☑ given_name
   - ☑ upn (User Principal Name)
5. Click **"Add"**

---

## Step 3: Create Client Secret

### 3.1 Generate Secret

1. Go to **"Certificates & secrets"** (left sidebar)
2. Click **"+ New client secret"**
3. Fill in:
   ```
   Description: Supabase Auth
   Expires: 24 months (or as per your policy)
   ```
4. Click **"Add"**

### 3.2 Save the Secret

**⚠️ IMPORTANT: This is shown ONLY ONCE!**

1. **Immediately copy** the **"Value"** (not the Secret ID)
2. It looks like: `xX1~aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789`
3. **Save it securely** - you'll need it for Supabase

---

## Step 4: Configure API Permissions

### 4.1 Add Required Permissions

1. Go to **"API permissions"** (left sidebar)
2. Click **"+ Add a permission"**
3. Select **"Microsoft Graph"**
4. Choose **"Delegated permissions"**
5. Add these permissions:
   - ☑ email
   - ☑ openid
   - ☑ profile
   - ☑ User.Read
6. Click **"Add permissions"**

### 4.2 Grant Admin Consent

1. Click **"Grant admin consent for [Your Organization]"**
2. Click **"Yes"** to confirm
3. All permissions should now show **"Granted for [Your Organization]"**

---

## Step 5: Configure Supabase

Now we'll add the Azure AD credentials to Supabase.

### 5.1 Access Supabase Auth Settings

1. Go to: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/providers
2. Find **"Azure"** in the provider list
3. Toggle it **ON**

### 5.2 Enter Azure AD Credentials

Fill in the form with values from Step 1:

```
Azure Tenant ID: [Your Directory/Tenant ID from Step 1.3]
Azure Client ID: [Your Application/Client ID from Step 1.3]
Azure Client Secret: [Your Client Secret from Step 3.2]
```

### 5.3 Configure Redirect URL

Make sure this matches what's in Azure:
```
Redirect URL: https://kemnvfkdybsujxerhcqi.supabase.co/auth/v1/callback
```

### 5.4 Save Configuration

Click **"Save"** at the bottom of the page.

---

## Step 6: Configure Email Domains

You may want to restrict login to UNRE email domains only.

### Option A: Restrict in Azure AD

1. In Azure Portal, go to your app registration
2. Go to **"Authentication"**
3. Under **"Supported account types"**, select:
   - ☑ Accounts in this organizational directory only

This automatically restricts to `@unre.edu.pg` and `@student.unre.edu.pg` domains.

### Option B: Validate in Application

Add email validation in your login flow (already implemented in the code).

---

## Step 7: Test the Integration

### 7.1 Test Student Login

1. **Go to:** http://localhost:3000/login
2. Click **"Student"** tab
3. Click **"Sign in with Microsoft"**
4. You should be redirected to Microsoft login page
5. Sign in with: `student@student.unre.edu.pg`
6. After authentication:
   - Should redirect back to your app
   - Should fetch user data from database
   - Should redirect to `/portal/student`

### 7.2 Test Staff Login

1. **Go to:** http://localhost:3000/login
2. Click **"Staff"** tab
3. Click **"Sign in with Microsoft"**
4. Sign in with: `staff@unre.edu.pg`
5. Should redirect to appropriate portal based on role

### 7.3 Verify Token Exchange

Check browser console and Supabase logs to ensure:
- ✅ OAuth code is exchanged for session
- ✅ User data is fetched from database
- ✅ Session is created in Supabase
- ✅ Redirect to correct portal happens

---

## Step 8: User Provisioning

### For Student Accounts

Students should be created in both:

1. **Azure AD** (for authentication)
   - Email: `student.name@student.unre.edu.pg`
   - This can be automated or done via Azure AD sync

2. **Supabase Database** (for application data)
   - Created automatically when application is approved
   - Links to Azure AD via email match

### For Staff Accounts

Staff accounts should exist in:

1. **Azure AD** (for authentication)
   - Email: `staff.name@unre.edu.pg`
   - Usually created via Active Directory sync

2. **Supabase Database** (for role assignment)
   - Manually created by ICT admin
   - Assigns role: registrar, admissions, finance, etc.

---

## 🔐 Security Best Practices

### 1. Enable Conditional Access

In Azure AD, configure Conditional Access policies:
- ✅ Require MFA for all users
- ✅ Block legacy authentication
- ✅ Require compliant devices (optional)

### 2. Monitor Sign-ins

Regularly check:
- Azure AD > Sign-in logs
- Supabase > Authentication > Logs

### 3. Rotate Secrets

- Rotate client secret every 12-24 months
- Update in Supabase when rotated

### 4. Review Permissions

- Regularly audit app permissions
- Remove unnecessary scopes

---

## 📊 Architecture Flow

```
User clicks "Sign in with Microsoft"
  ↓
Redirected to Microsoft login page
  ↓
User enters Office 365 credentials
  ↓
Azure AD authenticates user
  ↓
Azure AD redirects to Supabase callback with code
  ↓
Supabase exchanges code for tokens
  ↓
Supabase creates session
  ↓
App receives session callback
  ↓
App fetches user data from database
  ↓
App redirects to appropriate portal
```

---

## 🐛 Troubleshooting

### "Invalid redirect URI" error

**Problem:** The redirect URI doesn't match between Azure and Supabase

**Solution:**
- Check Azure app registration > Authentication > Redirect URIs
- Check Supabase > Auth > Providers > Azure
- They must match EXACTLY (including https://)

### "AADSTS50011: The reply URL specified does not match"

**Problem:** Wrong redirect URL configured

**Solution:**
- Update redirect URI in Azure to match Supabase:
  `https://kemnvfkdybsujxerhcqi.supabase.co/auth/v1/callback`

### "User not found in database"

**Problem:** User exists in Azure AD but not in Supabase database

**Solution:**
- Create user record in `users` table
- Make sure `email` in database matches Azure AD email

### "Invalid client secret"

**Problem:** Client secret is incorrect or expired

**Solution:**
- Generate new client secret in Azure
- Update in Supabase Auth settings

### "Consent required" error

**Problem:** Admin consent not granted for API permissions

**Solution:**
- Go to Azure app > API permissions
- Click "Grant admin consent"

---

## 📝 Configuration Checklist

Before going live, verify:

- [ ] Azure app registered
- [ ] Client ID and Tenant ID noted
- [ ] Client secret created and saved
- [ ] Redirect URIs configured (matches Supabase)
- [ ] API permissions added (email, openid, profile)
- [ ] Admin consent granted
- [ ] Supabase Azure provider enabled
- [ ] Credentials entered in Supabase
- [ ] Test login works for students
- [ ] Test login works for staff
- [ ] User data syncs correctly
- [ ] Role-based routing works
- [ ] Logout works correctly

---

## 📞 Support Resources

**Azure AD Documentation:**
- https://docs.microsoft.com/en-us/azure/active-directory/

**Supabase Auth Documentation:**
- https://supabase.com/docs/guides/auth/social-login/auth-azure

**Microsoft Graph API:**
- https://docs.microsoft.com/en-us/graph/

---

## 🎯 Next Steps

After Azure AD is configured:

1. ✅ Test with real Office 365 accounts
2. ✅ Create user provisioning workflow
3. ✅ Configure email templates
4. ✅ Set up user onboarding process
5. ✅ Train staff on the system

---

**Configuration Complete!** 🎉

Your UNRE students and staff can now log in with their Office 365 accounts!

**Version:** 1.0
**Last Updated:** December 4, 2025
