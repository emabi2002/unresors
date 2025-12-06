# UNRE System - Microsoft Azure AD / Office 365 Integration Guide

## 🎯 Overview

UNRE uses **Office 365 with Exchange 365 and Active Directory**. This guide configures **Single Sign-On (SSO)** using Microsoft Azure AD authentication, allowing users to log in with their existing UNRE Office 365 credentials.

## ✅ Benefits

- ✅ **Single Sign-On** - Users log in with their Office 365 credentials
- ✅ **No Separate Passwords** - One password for everything
- ✅ **Automatic User Sync** - Users from Active Directory auto-provisioned
- ✅ **Enhanced Security** - Microsoft's enterprise-grade authentication
- ✅ **Seamless Integration** - Works with existing email system
- ✅ **Easy Management** - IT manages users in Active Directory

---

## 📋 Part 1: Azure AD Application Registration

### Step 1: Access Azure Portal

1. Log in to Azure Portal:
   👉 https://portal.azure.com

2. Use your UNRE admin Office 365 credentials

### Step 2: Register New Application

1. Navigate to: **Azure Active Directory** → **App registrations**

2. Click **"New registration"**

3. Fill in the details:
   - **Name**: `UNRE Student Registration System`
   - **Supported account types**: `Accounts in this organizational directory only (UNRE only - Single tenant)`
   - **Redirect URI**:
     - Platform: `Web`
     - URL: `https://kemnvfkdybsujxerhcqi.supabase.co/auth/v1/callback`

4. Click **"Register"**

### Step 3: Note Important IDs

After registration, you'll see the **Overview** page. Copy these values:

1. **Application (client) ID**
   - Example: `12345678-1234-1234-1234-123456789abc`
   - ✅ SAVE THIS

2. **Directory (tenant) ID**
   - Example: `87654321-4321-4321-4321-cba987654321`
   - ✅ SAVE THIS

### Step 4: Create Client Secret

1. Go to **Certificates & secrets** in left menu

2. Click **"New client secret"**

3. Fill in:
   - **Description**: `UNRE Registration System Secret`
   - **Expires**: `24 months` (or as per your policy)

4. Click **"Add"**

5. **IMMEDIATELY COPY THE SECRET VALUE**
   - You can only see this ONCE!
   - Example: `abc123...xyz789`
   - ✅ SAVE THIS SECURELY

### Step 5: Configure API Permissions

1. Go to **API permissions** in left menu

2. Click **"Add a permission"**

3. Select **"Microsoft Graph"**

4. Select **"Delegated permissions"**

5. Add these permissions:
   - ✅ `openid`
   - ✅ `profile`
   - ✅ `email`
   - ✅ `User.Read`
   - ✅ `Directory.Read.All` (optional - for reading user details)

6. Click **"Add permissions"**

7. Click **"Grant admin consent for UNRE"**
   - This requires admin privileges
   - Click **"Yes"** to confirm

### Step 6: Configure Authentication Settings

1. Go to **Authentication** in left menu

2. Under **Platform configurations**, click on your Web platform

3. Add additional redirect URIs:
   ```
   http://localhost:3000/auth/callback
   https://kemnvfkdybsujxerhcqi.supabase.co/auth/v1/callback
   ```
   (Add your production URL when deploying)

4. Under **Implicit grant and hybrid flows**:
   - ✅ Check **"ID tokens"**

5. Under **Advanced settings**:
   - **Allow public client flows**: `No`

6. Click **"Save"**

---

## 🔐 Part 2: Configure Supabase for Azure AD

### Step 1: Enable Azure Provider in Supabase

1. Go to Supabase Dashboard:
   👉 https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi/auth/providers

2. Find **"Azure"** in the provider list

3. Click to expand

4. Toggle **"Enable"** to ON

5. Fill in the credentials from Azure:
   - **Azure Tenant ID**: `<your-tenant-id>`
   - **Azure Client ID**: `<your-application-client-id>`
   - **Azure Client Secret**: `<your-client-secret>`

6. Click **"Save"**

### Step 2: Configure Redirect URLs

1. In Supabase, go to **Authentication** → **URL Configuration**

2. Set these URLs:
   - **Site URL**: `http://localhost:3000` (change for production)
   - **Redirect URLs** (add all):
     ```
     http://localhost:3000/auth/callback
     http://localhost:3000/portal/student
     http://localhost:3000/portal/registrar
     http://localhost:3000/portal/admissions
     http://localhost:3000/portal/finance
     http://localhost:3000/portal/admin
     ```

3. Click **"Save"**

---

## 👥 Part 3: User Provisioning Strategy

### Option 1: Manual User Creation (Recommended for Start)

Create users manually in both systems:

1. **In Active Directory/Office 365**:
   - Users already exist with their @unre.edu.pg emails

2. **In Supabase (our database)**:
   ```sql
   -- Create user profile for staff
   INSERT INTO users (id, email, role, first_name, last_name, is_active)
   VALUES (
     gen_random_uuid(), -- Or use Azure AD user ID
     'john.doe@unre.edu.pg',
     'registrar',
     'John',
     'Doe',
     true
   );
   ```

3. **First Login**:
   - User signs in with Microsoft
   - Azure AD authenticates
   - Our system looks up user in `users` table
   - Redirects based on role

### Option 2: Automatic User Provisioning (Advanced)

Use Supabase Auth webhooks to auto-create users:

```sql
-- Create function to auto-provision users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Extract domain to determine role
  IF NEW.email LIKE '%@student.unre.edu.pg' THEN
    INSERT INTO public.users (id, email, role, first_name, last_name, is_active)
    VALUES (
      NEW.id,
      NEW.email,
      'student',
      SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 1),
      SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 2),
      true
    );
  ELSIF NEW.email LIKE '%@unre.edu.pg' THEN
    -- Staff members - default to staff role
    -- Can be updated later by admin
    INSERT INTO public.users (id, email, role, first_name, last_name, is_active)
    VALUES (
      NEW.id,
      NEW.email,
      'staff', -- Update manually to specific role
      SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 1),
      SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 2),
      true
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Option 3: Azure AD Graph API Sync (Most Advanced)

Periodically sync users from Azure AD using Microsoft Graph API:
- Read users from Azure AD
- Create/update in Supabase database
- Sync role changes
- Handle user deactivation

---

## 💻 Part 4: Update Login Page

### Update Environment Variables

Add to `.env.local`:

```bash
# Azure AD Configuration
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id
```

### Updated Login Component

The login page will now show **"Sign in with Microsoft"** button:

```typescript
// Sign in with Microsoft
const handleMicrosoftSignIn = async () => {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email profile openid',
      redirectTo: `${window.location.origin}/auth/callback`,
    }
  });

  if (error) {
    toast.error('Failed to sign in with Microsoft');
  }
};
```

---

## 🔄 Part 5: Authentication Flow

### Complete Flow Diagram

```
User clicks "Sign in with Microsoft"
    ↓
Redirect to Microsoft Login (login.microsoftonline.com)
    ↓
User enters Office 365 credentials
    ↓
Microsoft verifies credentials
    ↓
Microsoft redirects back to Supabase with auth code
    ↓
Supabase exchanges code for tokens
    ↓
Supabase creates/updates user in auth.users
    ↓
Redirect to /auth/callback in our app
    ↓
App fetches user role from users table
    ↓
Redirect to appropriate dashboard
    ↓
User logged in! ✅
```

---

## 🔑 Part 6: Role Mapping

### Email Domain to Role Mapping

Configure automatic role assignment based on email:

| Email Domain | Default Role | Description |
|--------------|-------------|-------------|
| `*@student.unre.edu.pg` | `student` | Students |
| `registrar@unre.edu.pg` | `registrar` | Registrar staff |
| `admissions@unre.edu.pg` | `admissions` | Admissions staff |
| `finance@unre.edu.pg` | `finance` | Finance staff |
| `ict@unre.edu.pg` | `ict_admin` | ICT administrators |
| `*@unre.edu.pg` | `staff` | Other staff (update manually) |

### Manual Role Updates

ICT Admin can update roles:

```sql
-- Update user role
UPDATE users
SET role = 'registrar'
WHERE email = 'john.doe@unre.edu.pg';
```

---

## 🏢 Part 7: Active Directory Integration

### Recommended User Structure in AD

**Organizational Units (OUs):**
```
UNRE
├── Students
│   ├── Year 1
│   ├── Year 2
│   ├── Year 3
│   └── Year 4
└── Staff
    ├── Registrar
    ├── Admissions
    ├── Finance
    ├── ICT
    ├── Academic
    └── Administration
```

**Email Naming Convention:**
- Students: `firstname.lastname@student.unre.edu.pg`
- Staff: `firstname.lastname@unre.edu.pg`
- Departments: `registrar@unre.edu.pg`, `finance@unre.edu.pg`

### Security Groups in AD

Create security groups for role management:
- `UNRE-Students`
- `UNRE-Registrar-Staff`
- `UNRE-Admissions-Staff`
- `UNRE-Finance-Staff`
- `UNRE-ICT-Admins`
- `UNRE-Academic-Staff`

---

## 🔒 Part 8: Security Configuration

### Conditional Access Policies (Optional)

Configure in Azure AD for enhanced security:

1. **Multi-Factor Authentication (MFA)**
   - Require MFA for staff accounts
   - Optional for students

2. **Location-Based Access**
   - Allow access only from campus network
   - Or allow remote with MFA

3. **Device Compliance**
   - Require managed devices for staff
   - Allow unmanaged for students

### Session Management

Configure in Supabase:
- **Session timeout**: 8 hours (adjust as needed)
- **Refresh token rotation**: Enabled
- **Max concurrent sessions**: 3 per user

---

## ✅ Part 9: Testing Checklist

### Pre-Production Testing

- [ ] Azure AD application registered
- [ ] Client secret created and saved
- [ ] API permissions granted
- [ ] Supabase Azure provider configured
- [ ] Redirect URLs configured in both Azure and Supabase
- [ ] Test user created in Active Directory
- [ ] Test user profile created in database
- [ ] Sign in with Microsoft button works
- [ ] Redirects to Microsoft login
- [ ] Returns to app after authentication
- [ ] User role detected correctly
- [ ] Redirects to correct dashboard
- [ ] User can access their data
- [ ] User can log out
- [ ] Second login works (session persistence)

### Staff Testing

Test with each role:
- [ ] Student account
- [ ] Registrar account
- [ ] Admissions account
- [ ] Finance account
- [ ] ICT Admin account

---

## 🚨 Troubleshooting

### "AADSTS50011: Reply URL mismatch"
**Solution**: Ensure redirect URI in Azure AD matches exactly:
`https://kemnvfkdybsujxerhcqi.supabase.co/auth/v1/callback`

### "User not found in database"
**Solution**: Create user profile in `users` table:
```sql
INSERT INTO users (id, email, role, first_name, last_name)
VALUES (auth.uid(), 'user@unre.edu.pg', 'student', 'First', 'Last');
```

### "Access denied - admin consent required"
**Solution**: Admin must grant consent in Azure AD → API permissions

### "Invalid client secret"
**Solution**: Client secret may have expired. Create new one in Azure AD

---

## 📞 Support Contacts

**Microsoft/Azure Support:**
- Azure Portal: https://portal.azure.com
- Microsoft 365 Admin: https://admin.microsoft.com

**UNRE ICT:**
- Email: ict@unre.edu.pg
- Internal IT support

---

## 🎯 Summary

**What You're Implementing:**
- ✅ Single Sign-On with Office 365
- ✅ No separate passwords needed
- ✅ Seamless integration with existing email
- ✅ Enterprise-grade security
- ✅ Easy user management via Active Directory

**Next Steps:**
1. Complete Azure AD app registration
2. Configure Supabase Azure provider
3. Update login page (next step)
4. Test with pilot users
5. Roll out to all users

---

**This integration makes UNRE's system enterprise-ready with Microsoft's trusted authentication! 🚀**
