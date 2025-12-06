# UNRE Student Registration System - Implementation Guide

## Project Overview

This is an enterprise-grade Online Student Registration System for the University of Natural Resources and Environment (UNRE) built with:
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI Components**
- **Supabase** (PostgreSQL + Storage)

## Current Status (Version 6)

### ✅ COMPLETED FEATURES

#### 1. Landing Page
- Professional homepage with feature overview
- Navigation to application and login pages
- Staff portal access links (Registrar, Admissions, Finance, ICT Admin)
- Responsive design with emerald green theme

#### 2. New Student Application Module
- Multi-step application form (4 steps):
  - Step 1: Personal Information
  - Step 2: Contact Details & Emergency Contact
  - Step 3: Academic Information & Program Selection
  - Step 4: Document Upload (Grade 12 cert, transcript, NID, photo)
- Progress tracking
- Form validation
- Mock data submission (ready for Supabase integration)

#### 3. Login Page
- Separate tabs for Student and Staff login
- Email + OTP authentication UI
- OTP verification flow
- Resend OTP functionality
- Ready for Supabase Auth integration

#### 4. Student Dashboard
Complete dashboard with 5 tabs:
- **Overview**: GPA, credits, payment status, quick actions, enrolled courses
- **Application**: Application status, approval timeline, uploaded documents
- **Courses**: Course registration, credit load tracking, prerequisite validation
- **Payments**: Current invoice, fee breakdown, payment history, payment actions
- **Profile**: Personal information, program details, profile management

#### 5. Registrar Dashboard
Comprehensive admin interface with 4 tabs:
- **Overview**: Statistics, recent applications, program distribution, quick actions
- **Applications**: Search, filter, approve/reject applications
- **Students**: Student records management, academic standing tracking
- **Enrollments**: Course enrollment management, credit tracking

#### 6. Admissions Dashboard
Application review interface:
- Pending applications queue
- Document verification
- Approval/rejection workflow
- Application statistics
- Report generation

#### 7. Finance Dashboard
Financial management system with 4 tabs:
- **Overview**: Revenue tracking, payment statistics, payment method distribution
- **Payments**: Transaction history, payment method filtering, status tracking
- **Invoices**: Invoice management, balance tracking, overdue monitoring
- **Reports**: Revenue reports, outstanding balances, reconciliation, audit trails

### 📁 Project Structure

```
unre-registration-system/
├── .same/                          # Project documentation
│   ├── todos.md                    # Development tracker
│   ├── database-schema.md          # Database schema documentation
│   └── IMPLEMENTATION_GUIDE.md     # This file
├── src/
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── apply/page.tsx          # Student application form
│   │   ├── login/page.tsx          # Login page
│   │   └── portal/
│   │       ├── student/page.tsx    # Student dashboard
│   │       ├── registrar/page.tsx  # Registrar dashboard
│   │       ├── admissions/page.tsx # Admissions dashboard
│   │       └── finance/page.tsx    # Finance dashboard
│   ├── components/ui/              # ShadCN UI components
│   ├── lib/
│   │   ├── supabase/client.ts      # Supabase client
│   │   └── utils.ts                # Utility functions
│   └── types/database.ts           # TypeScript type definitions
├── .env.local                      # Environment variables
└── package.json                    # Dependencies
```

## Next Steps for Implementation

### Phase 1: Supabase Setup (PRIORITY)

#### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Copy the project URL and anon key
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   ```

#### 1.2 Database Schema Implementation
Execute the SQL from `.same/database-schema.md` in Supabase SQL Editor:
1. Create all tables
2. Set up foreign keys
3. Create indexes
4. Set up Row Level Security (RLS) policies

**Critical Tables to Create First:**
- users
- students
- applications
- programs
- departments
- semesters
- courses

#### 1.3 Configure Supabase Storage
1. Create storage buckets:
   - `application-documents` (for student application files)
   - `student-photos` (for profile photos)
2. Set up storage policies for secure access

#### 1.4 Set Up Authentication
1. Enable Email provider in Supabase Auth settings
2. Configure email templates for OTP
3. Set up OAuth providers if needed
4. Configure authentication redirect URLs

### Phase 2: Authentication Integration

#### 2.1 Update Login Page
File: `src/app/login/page.tsx`

Replace mock authentication with Supabase:
```typescript
import { createClient } from '@/lib/supabase/client';

const handleSendOTP = async (e: React.FormEvent) => {
  e.preventDefault();
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: email,
  });

  if (!error) {
    setOtpSent(true);
    toast.success('OTP sent to your email');
  } else {
    toast.error(error.message);
  }
};

const handleVerifyOTP = async (e: React.FormEvent) => {
  e.preventDefault();
  const supabase = createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email: email,
    token: otp,
    type: 'email',
  });

  if (!error && data.user) {
    // Fetch user role from database
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    // Redirect based on role
    if (userData.role === 'student') {
      router.push('/portal/student');
    } else if (userData.role === 'registrar') {
      router.push('/portal/registrar');
    }
    // ... other roles
  }
};
```

#### 2.2 Create Protected Routes
Create middleware to protect dashboard routes:

File: `src/middleware.ts`
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session && req.nextUrl.pathname.startsWith('/portal')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

export const config = {
  matcher: '/portal/:path*',
};
```

### Phase 3: Application Module Integration

#### 3.1 Connect Application Form to Database
File: `src/app/apply/page.tsx`

Update the `handleSubmit` function:
```typescript
const handleSubmit = async () => {
  const supabase = createClient();

  // 1. Upload documents to Supabase Storage
  const documentUrls = {};

  for (const [key, file] of Object.entries({
    grade12Cert: formData.grade12Cert,
    transcript: formData.transcript,
    nationalIdDoc: formData.nationalIdDoc,
    photo: formData.photo,
  })) {
    if (file) {
      const filePath = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('application-documents')
        .upload(filePath, file);

      if (!error) {
        documentUrls[key] = data.path;
      }
    }
  }

  // 2. Insert application data
  const { data, error } = await supabase
    .from('applications')
    .insert({
      applicant_email: formData.email,
      applicant_phone: formData.phone,
      first_name: formData.firstName,
      last_name: formData.lastName,
      middle_name: formData.middleName,
      program_id: formData.programId,
      status: 'submitted',
      documents: documentUrls,
      application_date: new Date().toISOString(),
      // ... other fields
    })
    .select()
    .single();

  if (!error) {
    toast.success('Application submitted successfully!');
    // Send confirmation email
  }
};
```

### Phase 4: Dashboard Data Integration

#### 4.1 Student Dashboard
Replace mock data with Supabase queries:

```typescript
const fetchStudentData = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch student profile
  const { data: student } = await supabase
    .from('students')
    .select(`
      *,
      programs (program_name),
      enrollments (
        *,
        semesters (*)
      )
    `)
    .eq('id', user.id)
    .single();

  // Fetch course registrations
  const { data: courses } = await supabase
    .from('course_registrations')
    .select(`
      *,
      courses (*)
    `)
    .eq('student_id', student.id);

  // Fetch invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('student_id', student.id)
    .order('created_at', { ascending: false });

  return { student, courses, invoices };
};
```

#### 4.2 Registrar Dashboard
Implement application approval workflow:

```typescript
const approveApplication = async (applicationId: string) => {
  const supabase = createClient();

  // 1. Update application status
  await supabase
    .from('applications')
    .update({
      status: 'approved',
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId);

  // 2. Create student record
  const { data: application } = await supabase
    .from('applications')
    .select('*')
    .eq('id', applicationId)
    .single();

  const { data: student } = await supabase
    .from('students')
    .insert({
      // Map application data to student record
      ...application,
      student_id: generateStudentId(), // Implement ID generation
      enrollment_year: new Date().getFullYear(),
      academic_standing: 'good',
    })
    .select()
    .single();

  // 3. Generate offer letter
  await generateOfferLetter(student.id);

  // 4. Send approval email
  await sendApprovalEmail(application.applicant_email);
};
```

### Phase 5: Payment Gateway Integration

#### 5.1 BSP Pay Integration
Create API route: `src/app/api/payments/bsp/route.ts`

```typescript
export async function POST(request: Request) {
  const { invoiceId, amount } = await request.json();

  // BSP Pay API integration
  const response = await fetch(process.env.BSP_PAY_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.BSP_PAY_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchantId: process.env.NEXT_PUBLIC_BSP_PAY_MERCHANT_ID,
      amount: amount,
      invoiceId: invoiceId,
      // ... other BSP Pay parameters
    }),
  });

  const data = await response.json();
  return Response.json({ redirectUrl: data.paymentUrl });
}
```

#### 5.2 Payment Callback Handler
Create webhook endpoint: `src/app/api/payments/callback/route.ts`

```typescript
export async function POST(request: Request) {
  const payload = await request.json();
  const supabase = createClient();

  // Verify payment signature
  const isValid = verifyPaymentSignature(payload);

  if (isValid && payload.status === 'success') {
    // 1. Update payment record
    await supabase
      .from('payments')
      .update({
        status: 'successful',
        gateway_response: payload,
      })
      .eq('transaction_reference', payload.reference);

    // 2. Update invoice
    await supabase
      .from('invoices')
      .update({
        amount_paid: payload.amount,
        status: 'paid',
      })
      .eq('id', payload.invoiceId);

    // 3. Activate student enrollment
    await activateEnrollment(payload.studentId);

    // 4. Generate receipt
    await generateReceipt(payload);
  }

  return Response.json({ received: true });
}
```

### Phase 6: Audit Trail Implementation

Create audit logging middleware:

```typescript
export async function logAuditEvent({
  userId,
  action,
  entityType,
  entityId,
  oldValues,
  newValues,
  metadata,
}: AuditLogParams) {
  const supabase = createClient();

  await supabase
    .from('audit_logs')
    .insert({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: getClientIP(),
      user_agent: getUserAgent(),
      timestamp: new Date().toISOString(),
      metadata,
    });
}
```

## Testing Checklist

### Manual Testing
- [ ] Application submission flow
- [ ] Login with OTP
- [ ] Student dashboard data display
- [ ] Registrar application approval
- [ ] Payment processing
- [ ] Document upload/download
- [ ] Invoice generation
- [ ] Role-based access control

### Security Testing
- [ ] RLS policies working correctly
- [ ] Authentication required for protected routes
- [ ] File upload validation
- [ ] SQL injection prevention
- [ ] XSS protection

## Deployment

### Vercel Deployment (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd unre-registration-system
vercel --prod
```

### Environment Variables in Production
Set these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_BSP_PAY_MERCHANT_ID`
- `BSP_PAY_SECRET_KEY`
- `KINA_BANK_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`

## Support & Contacts

For technical questions:
- Review `.same/todos.md` for development progress
- Check `.same/database-schema.md` for database structure
- Contact UNRE ICT Services for deployment support

## Important Notes

1. **Security**: Never commit `.env.local` to version control
2. **Backup**: Set up regular database backups in Supabase
3. **Monitoring**: Enable Supabase logging and monitoring
4. **Testing**: Test payment gateways in sandbox mode first
5. **Documentation**: Keep API documentation up to date

---

**Last Updated**: December 3, 2025
**Version**: 6
**Status**: Phase 1 Complete - Ready for Supabase Integration
