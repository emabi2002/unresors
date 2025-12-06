# UNRE Student Registration System

**University of Natural Resources and Environment**
Online Student Registration & Management System

**Status:** ✅ Deployed to GitHub
**Repository:** https://github.com/emabi2002/unresors
**Branch:** main

---

## 🎓 About

A comprehensive web-based student registration system for the University of Natural Resources and Environment (UNRE), Papua New Guinea. This system streamlines the entire student lifecycle from application through enrollment, course registration, and financial management.

## ✨ Features

### Public Features
- **Online Application Portal** - New students can apply online with document uploads
- **Real-time Application Tracking** - Track application status
- **Program Information** - Browse 12 undergraduate and postgraduate programs

### Student Portal
- **Enrollment Registration** - Complete enrollment with automated fee calculation
- **Course Registration** - Register for courses with prerequisite checking
- **Credit Limit Enforcement** - Automatic validation (12-18 credits for undergrad, 9-12 for postgrad)
- **Fee Breakdown** - Real-time calculation of tuition and fees

### Staff Dashboards
- **Admissions Dashboard** - Review and approve/reject applications
- **Registrar Dashboard** - Manage enrollments and course registrations
- **Finance Dashboard** - Track invoices, payments, and balances

## 🏗️ Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Deployment:** GitHub (ready for Netlify/Vercel)
- **Package Manager:** Bun

## 📊 Database

**Fully Populated with Real UNRE Data:**
- ✅ 12 Academic Programs (8 undergraduate, 4 postgraduate)
- ✅ 42 Year 1 Courses across all programs
- ✅ 9 Departments (3 Schools: Agriculture, Forestry, Natural Resources)
- ✅ Fee Structures (K 9,625.70 for residential students)
- ✅ 3 Campuses (Main, Agricultural Science, Forestry)
- ✅ 20 PNG Provinces and settings

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Bun package manager
- Supabase account (already configured)

### Installation

```bash
# Clone the repository
git clone https://github.com/emabi2002/unresors.git
cd unresors

# Install dependencies
bun install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
bun run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build the application
bun run build

# Start production server
bun run start
```

## 📁 Project Structure

```
unresors/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── apply/                # Public application form
│   │   ├── portal/               # Student & staff portals
│   │   │   ├── student/          # Student features
│   │   │   ├── admissions/       # Admissions dashboard
│   │   │   ├── registrar/        # Registrar dashboard
│   │   │   └── finance/          # Finance dashboard
│   │   └── api/                  # API routes
│   ├── components/ui/            # shadcn/ui components
│   ├── lib/                      # Utilities
│   │   └── supabase/             # Supabase clients
│   └── providers/                # React providers
├── .same/                        # Documentation & SQL scripts
│   ├── RLS_SECURITY_POLICIES_FIXED.sql
│   ├── CREATE_TEST_ADMIN_SIMPLE.sql
│   ├── GITHUB_DEPLOYMENT_SUCCESS.md
│   └── ... (50+ documentation files)
└── public/                       # Static assets
```

## 🔐 Security

- **Row Level Security (RLS)** policies configured for all tables
- **Role-based access control** (student, registrar, admissions, finance, ict_admin)
- **Azure AD SSO** ready (configuration guide in `.same/AZURE_AD_SETUP_GUIDE.md`)

## 🧪 Testing

**Test Admin Account:**
- Username: `TEST-ADMIN-001`
- Setup: Run `.same/CREATE_TEST_ADMIN_SIMPLE.sql` in Supabase

**Testing Mode:**
- Currently enabled in student portal pages
- Disable before production deployment

## 📖 Documentation

Comprehensive documentation available in the `.same/` folder:
- **Deployment Guide** - `.same/DEPLOYMENT_COMPLETE.md`
- **Security Setup** - `.same/RLS_SECURITY_POLICIES_FIXED.sql`
- **Azure AD Integration** - `.same/AZURE_AD_SETUP_GUIDE.md`
- **Test Account Setup** - `.same/CREATE_TEST_ADMIN_SIMPLE.sql`
- **Database Schema** - Multiple SQL scripts for schema and data

## 🌐 Deployment

### Current Status
✅ Code deployed to GitHub: https://github.com/emabi2002/unresors
⏳ Production hosting: Ready for Netlify/Vercel

### Deploy to Netlify

```bash
# Option 1: Connect via Netlify Dashboard
1. Go to https://app.netlify.com
2. New Site from Git → GitHub
3. Select: emabi2002/unresors
4. Build command: bun run build
5. Publish directory: .next
6. Add environment variables (see .env.local)
```

### Deploy to Vercel

```bash
# Option 2: Deploy via Vercel CLI
bunx vercel
# Follow prompts and add environment variables
```

## 📝 Environment Variables

Required environment variables (add in `.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: Payment gateways
NEXT_PUBLIC_BSP_PAY_MERCHANT_ID=demo_merchant
BSP_PAY_SECRET_KEY=demo_secret
NEXT_PUBLIC_KINA_BANK_MERCHANT_ID=demo_merchant
KINA_BANK_SECRET_KEY=demo_secret
```

## 🎯 Next Steps

### For Development
1. Enable RLS policies in Supabase (run `.same/RLS_SECURITY_POLICIES_FIXED.sql`)
2. Create test users for different roles
3. Test end-to-end workflows
4. Customize styling and branding

### For Production
1. Configure Azure AD SSO (see `.same/AZURE_AD_SETUP_GUIDE.md`)
2. Disable testing mode in portal pages
3. Deploy to Netlify/Vercel
4. Set up custom domain
5. Train staff on dashboards
6. Announce to students

## 📊 System Statistics

- **Total Files:** 103 application files + 50+ documentation
- **Lines of Code:** ~28,000+
- **Pages:** 7 complete pages (1 public, 3 student, 3 staff)
- **API Routes:** 3 endpoints
- **Build Status:** ✅ Passing
- **TypeScript:** ✅ No errors
- **Deployment:** ✅ GitHub (main branch)

## 🤝 Contributing

This is a production system for UNRE. For modifications or contributions:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

**Repository:** https://github.com/emabi2002/unresors
**Documentation:** See `.same/` folder
**Database:** Supabase (configured)

## 📜 License

Copyright © 2025 University of Natural Resources and Environment
All rights reserved.

---

**Built with ❤️ for UNRE students and staff**

**Version:** 32 - GitHub Deployment Complete
**Last Updated:** December 6, 2025
