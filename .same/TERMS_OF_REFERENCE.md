# TERMS OF REFERENCE (TOR)

## ONLINE STUDENT REGISTRATION SYSTEM
**University of Natural Resources and Environment (UNRE)**

---

## 1. PROJECT BACKGROUND

### 1.1 Context
The University of Natural Resources and Environment (UNRE) currently manages student registration, enrollment, and academic administration through manual, paper-based processes. This system has proven inefficient, time-consuming, and prone to errors, creating bottlenecks during peak registration periods and limiting the university's ability to scale operations.

### 1.2 Problem Statement
Current challenges include:
- **Manual Form Processing**: Students must physically submit paper forms for registration
- **Limited Accessibility**: Registration only available during office hours at campus
- **Data Entry Errors**: Manual data entry leads to inconsistencies and errors
- **Document Management**: Physical document storage is space-intensive and difficult to retrieve
- **Slow Approval Process**: Paper-based workflows delay application processing
- **No Real-time Tracking**: Students cannot track application status online
- **Reporting Difficulties**: Generating reports requires manual data compilation
- **Payment Reconciliation**: Manual tracking of student payments is error-prone

### 1.3 Proposed Solution
Development and deployment of a comprehensive web-based Online Student Registration System that digitizes and automates the entire student lifecycle management process, from initial application through enrollment, course registration, and payment processing.

---

## 2. PROJECT OBJECTIVES

### 2.1 Primary Objectives
1. **Digitize Student Registration**: Transform manual registration processes into efficient online workflows
2. **Improve Accessibility**: Enable 24/7 access to registration services from any location
3. **Enhance Data Accuracy**: Eliminate manual data entry errors through digital forms and validation
4. **Streamline Approvals**: Implement electronic approval workflows for applications and enrollments
5. **Enable Real-time Tracking**: Provide students and staff with live status updates
6. **Facilitate Reporting**: Generate automated reports for administration and decision-making
7. **Integrate Payment Systems**: Connect with local payment gateways (BSP Pay, Kina Bank)

### 2.2 Secondary Objectives
1. Support Office 365 Single Sign-On (SSO) for seamless authentication
2. Create role-based access control for different user types (students, staff, admin)
3. Establish secure document storage and retrieval system
4. Enable CSV data exports for external analysis
5. Provide mobile-responsive interface for accessibility on all devices

---

## 3. SCOPE OF WORK

### 3.1 IN-SCOPE Components

#### Phase 1: Authentication & User Management
- **User Authentication System**
  - Office 365 SSO integration with Microsoft Azure AD
  - Email-based OTP (One-Time Password) authentication
  - Session management and secure logout
  - Password reset functionality

- **User Roles & Permissions**
  - Student role with course registration access
  - Registrar role with enrollment approval rights
  - Admissions role with application review rights
  - Finance role with payment and invoice management
  - ICT Admin role with full system access

- **User Profile Management**
  - Personal information management
  - Profile photo upload
  - Contact details update
  - Emergency contact information

#### Phase 2: Student Application & Registration

- **New Student Application Module**
  - Online application form (4 sections matching manual form):
    - Section 1: Personal Information (21 fields)
    - Section 2: Academic Background (program selection, qualifications)
    - Section 3: Financial Information (payment details, sponsor)
    - Section 4: Declaration & Signature
  - Document upload functionality:
    - Grade 12 Certificate
    - Academic Transcripts
    - National ID
    - Passport Photo
  - Application submission and tracking
  - Application status notifications

- **Enrollment Registration Module**
  - Student enrollment form (matching manual "REGISTRATION OF ENROLLMENT" form)
  - All 50+ fields from manual form including:
    - Personal details (surname, first name, gender, DOB, marital status, etc.)
    - Academic information (program, level, strand, courses)
    - Financial details (resident type, sponsor, fees, dormitory)
    - Course selection (6 courses per semester)
    - Declaration and agreement
  - Auto-fill of existing student data
  - Enrollment submission for registrar approval

- **Course Registration Module**
  - Browse available courses by program and department
  - Course search and filtering
  - Credit limit validation (12-18 credits)
  - Course capacity checking
  - Prerequisite validation
  - Fee calculation based on selected courses
  - Shopping cart functionality
  - Registration confirmation

#### Phase 3: Staff Dashboards & Workflows

- **Registrar Dashboard**
  - **Overview Tab**:
    - Statistics cards (total applications, pending review, total students, new enrollments)
    - Recent applications list
    - Program distribution charts
    - Quick action buttons (all functional)
  - **Applications Tab**:
    - Search applications by name/email
    - Filter by status (submitted/approved/rejected/under review)
    - Filter by program
    - View application details
    - Approve/reject applications with one click
    - Export filtered data to CSV
    - Result counters
  - **Students Tab**:
    - Search students by name/email
    - Filter by year (1-4)
    - Filter by academic standing (active/probation/suspended)
    - View student profiles
    - Export student list to CSV
    - Result counters
  - **Enrollments Tab**:
    - View all student enrollments
    - Enrollment detail view
    - Approve/reject enrollments
    - Export enrollment data to CSV

- **Admissions Dashboard**
  - Statistics cards (pending review, approved today, rejected today, total applications)
  - Application review table with search and filters
  - Review application button (opens detailed view)
  - Approve/reject application buttons
  - Document verification interface
  - Export pending applications to CSV
  - Filter by program and search applicants
  - Result counters

- **Finance Dashboard**
  - **Overview Tab**:
    - Revenue statistics (total revenue, pending payments, payments today)
    - Recent payments list
    - Payment method distribution charts
    - Reconciliation tracker
    - Quick action buttons (all functional)
  - **Payments Tab**:
    - Payment transactions table
    - Search payments by student name/ID
    - Filter by payment method (BSP Pay, Kina Bank, Visa, Cash)
    - Filter by status (successful/pending/failed)
    - View payment details
    - Export payments to CSV
    - Result counters
  - **Invoices Tab**:
    - Student invoices table
    - Search invoices by student
    - Filter by status (paid/partial/pending/overdue)
    - View invoice details
    - Track payment status (amount paid, balance)
    - Export invoices to CSV
    - Result counters
  - **Reports Tab**:
    - Revenue Report generation (by program and payment method)
    - Outstanding Balances Report
    - Reconciliation Report (BSP & Kina Bank)
    - Audit Trail Report
    - CSV export for all reports
    - Downloadable reports with timestamps

- **ICT Admin Dashboard** (Future Phase)
  - System settings management
  - User account management
  - Audit logs and system monitoring
  - Database backups
  - Email template configuration

#### Phase 4: Data Management & Storage

- **Database Schema**
  - Users table (authentication, profiles)
  - Students table (personal details, academic records)
  - Applications table (new student applications)
  - Student_enrollments table (enrollment registrations)
  - Programs table (academic programs)
  - Courses table (course catalog)
  - Course_registrations table (student course selections)
  - Payments table (payment transactions)
  - Invoices table (student invoices)

- **File Storage System**
  - Supabase Storage buckets for documents
  - Row Level Security (RLS) policies
  - Document versioning
  - Secure file access controls
  - File upload size limits (5MB per file)
  - Supported formats: PDF, JPG, PNG

- **Data Security**
  - Row Level Security (RLS) on all tables
  - Encrypted data transmission (HTTPS)
  - Secure authentication tokens
  - Role-based data access
  - Audit logging for sensitive operations
  - Regular database backups

#### Phase 5: Reporting & Analytics

- **Automated Reports**
  - Application statistics by program and period
  - Enrollment numbers by semester
  - Student demographics
  - Payment collection reports
  - Outstanding balance tracking
  - Course enrollment statistics

- **CSV Export Functionality**
  - Export applications (filtered)
  - Export students (filtered)
  - Export enrollments
  - Export payments (filtered)
  - Export invoices (filtered)
  - Export reports (all types)
  - Timestamped file naming

- **Dashboard Analytics**
  - Real-time statistics cards
  - Visual charts (program distribution, payment methods)
  - Trend analysis
  - KPI tracking

#### Phase 6: Integration & Payment Processing

- **Payment Gateway Integration** (Future Phase)
  - BSP Pay integration
  - Kina Bank IPG integration
  - Visa/Mastercard processing
  - Cash payment recording
  - Payment confirmation emails
  - Receipt generation

- **Email Notifications** (Future Phase)
  - Application submission confirmation
  - Application approval/rejection notification
  - Enrollment confirmation
  - Payment receipt emails
  - Course registration confirmation
  - System announcements

- **Office 365 Integration**
  - Azure AD authentication (SSO)
  - Microsoft account linking
  - Outlook email integration (future)

### 3.2 OUT-OF-SCOPE Components

The following items are explicitly excluded from this project scope:

1. **Learning Management System (LMS)**
   - Course content delivery
   - Assignment submissions
   - Grading and assessment
   - Online exams

2. **Library Management System**
   - Book cataloging
   - Borrowing/returns
   - Digital library resources

3. **Human Resources Management**
   - Staff payroll
   - Leave management
   - Performance reviews

4. **Academic Records Management**
   - Grade processing
   - Transcript generation
   - Graduation management
   - Certificate printing

5. **Timetable Scheduling**
   - Class scheduling
   - Room allocation
   - Faculty assignments

6. **Mobile Native Applications**
   - iOS app development
   - Android app development
   - (Note: Web application is mobile-responsive)

7. **SMS Notifications**
   - Text message alerts
   - SMS verification
   - (Email notifications only)

8. **Third-party Integrations** (except specified)
   - Government databases
   - Other educational institutions
   - Research databases

---

## 4. DELIVERABLES

### 4.1 Technical Deliverables

1. **Source Code**
   - Complete Next.js application codebase
   - TypeScript components and modules
   - Database migration scripts
   - Configuration files
   - Documentation comments

2. **Database**
   - Supabase PostgreSQL database
   - All required tables and relationships
   - Row Level Security (RLS) policies
   - Indexes for performance optimization
   - Sample/test data for development

3. **Deployed Application**
   - Live production website on Netlify
   - Staging environment for testing
   - GitHub repository with version control
   - Automated deployment pipeline

4. **User Interfaces**
   - Student portal (dashboard, registration, enrollment)
   - Registrar dashboard (4 tabs, all functional)
   - Admissions dashboard (application review)
   - Finance dashboard (4 tabs, all functional)
   - ICT Admin portal (basic structure)
   - Responsive design for desktop, tablet, mobile

### 4.2 Documentation Deliverables

1. **Technical Documentation**
   - System architecture diagram
   - Database schema documentation
   - API endpoint documentation
   - Deployment guide
   - Environment setup instructions
   - Troubleshooting guide

2. **User Documentation**
   - Student user guide (with screenshots)
   - Staff user guides (Registrar, Admissions, Finance)
   - Administrator manual
   - FAQ document
   - Video tutorials (optional)

3. **Project Documentation**
   - Terms of Reference (this document)
   - Requirements specification
   - Testing plan and results
   - Change log
   - Known issues and limitations

4. **Training Materials**
   - Training presentation slides
   - Quick reference guides
   - Training videos (screen recordings)
   - Step-by-step tutorials

### 4.3 Support Deliverables

1. **Testing & Quality Assurance**
   - Test user accounts for all roles
   - Sample data for testing
   - Testing checklist and results
   - Bug fix log

2. **Handover Package**
   - Administrator credentials
   - Database access details
   - GitHub repository access
   - Hosting platform credentials
   - Email configuration details

---

## 5. TECHNICAL SPECIFICATIONS

### 5.1 Technology Stack

**Frontend:**
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui (Radix UI)
- Icons: Lucide React
- Form Validation: Client-side validation
- Toast Notifications: Sonner

**Backend:**
- Database: Supabase (PostgreSQL)
- Storage: Supabase Storage
- Authentication: Supabase Auth + Azure AD OAuth
- API: Next.js API Routes (Server-side)

**Deployment:**
- Hosting: Netlify (Web Application)
- Code Repository: GitHub (https://github.com/emabi2002/unresors)
- Version Control: Git
- CI/CD: Netlify auto-deploy from GitHub

**Development Tools:**
- Package Manager: Bun
- Code Editor: Any (VS Code recommended)
- Linter: Biome
- Type Checking: TypeScript compiler

### 5.2 System Requirements

**Server Requirements:**
- Cloud hosting (Netlify serverless)
- PostgreSQL database (Supabase managed)
- SSL certificate (Netlify provided)
- CDN for static assets (Netlify provided)

**Client Requirements:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum screen resolution: 320px (mobile) to 1920px+ (desktop)
- JavaScript enabled
- Internet connection (minimum 1 Mbps recommended)

**Database Requirements:**
- PostgreSQL 14+
- Minimum 1GB storage
- Row Level Security (RLS) support
- JSON/JSONB support for flexible data

### 5.3 Performance Requirements

- **Page Load Time**: < 3 seconds on 3G connection
- **Time to Interactive**: < 5 seconds
- **Search Response Time**: < 1 second
- **Form Submission**: < 2 seconds
- **CSV Export**: < 5 seconds for 1000 records
- **Concurrent Users**: Support 100+ simultaneous users
- **Uptime**: 99.5% availability target

### 5.4 Security Requirements

- **Authentication**: Multi-factor authentication (Office 365 SSO + OTP)
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: TLS 1.3 for data in transit
- **Password Policy**: Minimum 8 characters, complexity requirements
- **Session Management**: Secure token-based sessions, auto-logout after 30 minutes inactivity
- **Data Access**: Row Level Security (RLS) on all database tables
- **File Upload**: Virus scanning, file type validation, size limits
- **Audit Logging**: Log all critical operations (approve, reject, payment, etc.)
- **Data Backup**: Daily automated backups, 30-day retention

### 5.5 Integration Requirements

**Required Integrations:**
- Microsoft Azure AD (Office 365 SSO)
- Supabase Database
- Supabase Storage
- Supabase Authentication

**Future Integrations:**
- BSP Pay payment gateway
- Kina Bank Internet Payment Gateway (IPG)
- SMTP email service (for notifications)
- SMS gateway (optional)

---

## 6. PROJECT PHASES & TIMELINE

### Phase 1: Authentication & Foundation (COMPLETED)
**Duration**: 2 weeks
**Status**: ✅ Complete

**Deliverables:**
- User authentication system (Office 365 SSO, Email OTP)
- User roles and permissions
- Protected routes middleware
- Login/logout functionality
- Basic user profile

### Phase 2: Registration Forms & Student Portal (COMPLETED)
**Duration**: 3 weeks
**Status**: ✅ Complete

**Deliverables:**
- New student application form (50+ fields, matches manual form)
- Enrollment registration form (50+ fields, matches manual form)
- Course registration module
- Document upload functionality
- Student dashboard
- Client-side file uploads to Supabase Storage

### Phase 3: Staff Dashboards & Workflows (COMPLETED)
**Duration**: 3 weeks
**Status**: ✅ Complete

**Deliverables:**
- Registrar Dashboard (4 tabs, all functional)
  - Applications management with approve/reject
  - Students management with filters
  - Enrollments tracking
  - CSV exports
- Admissions Dashboard (fully functional)
  - Application review interface
  - Approve/reject functionality
  - Search and filters
  - CSV export
- Finance Dashboard (4 tabs, all functional)
  - Payments management
  - Invoices tracking
  - Reports generation
  - CSV exports
- ICT Admin portal (basic structure)

### Phase 4: Integration & Testing (IN PROGRESS)
**Duration**: 2 weeks
**Status**: ⏳ Pending

**Deliverables:**
- Database setup and testing
- Payment gateway integration (BSP Pay, Kina Bank)
- Email notification system
- End-to-end testing
- User acceptance testing (UAT)
- Bug fixes and refinements

### Phase 5: Deployment & Training (PENDING)
**Duration**: 2 weeks
**Status**: ⏳ Pending

**Deliverables:**
- Production deployment
- Staff training sessions
- User documentation
- Administrator handover
- Go-live support

### Phase 6: Post-Launch Support & Enhancement (FUTURE)
**Duration**: Ongoing
**Status**: ⏳ Pending

**Deliverables:**
- Bug fixes and maintenance
- Feature enhancements
- Performance optimization
- Security updates
- User support

---

## 7. ROLES & RESPONSIBILITIES

### 7.1 Project Stakeholders

**Project Sponsor:**
- University of Natural Resources and Environment (UNRE) Management
- Responsibilities:
  - Provide project vision and strategic direction
  - Approve major decisions and budget
  - Remove organizational barriers
  - Champion the project across the university

**Project Owner:**
- UNRE IT Department / Registrar's Office
- Responsibilities:
  - Define functional requirements
  - Prioritize features
  - Accept deliverables
  - Coordinate with end users

**Development Team:**
- Lead Developer / System Architect
- Responsibilities:
  - Design system architecture
  - Develop application features
  - Write clean, maintainable code
  - Create technical documentation
  - Deploy and maintain system

**Quality Assurance:**
- QA Tester / UAT Coordinator
- Responsibilities:
  - Test all features and workflows
  - Report bugs and issues
  - Verify fixes
  - Conduct user acceptance testing

**Training Coordinator:**
- HR / IT Training Officer
- Responsibilities:
  - Develop training materials
  - Conduct staff training sessions
  - Provide post-launch support
  - Gather user feedback

### 7.2 End Users

**Students:**
- Submit applications online
- Register for courses
- Complete enrollment forms
- Upload documents
- Track application status
- View invoices and payments

**Registrar Staff:**
- Review and approve applications
- Manage student enrollments
- Approve course registrations
- Generate student reports
- Export data for analysis

**Admissions Staff:**
- Review new applications
- Verify student documents
- Approve or reject applications
- Generate admission reports

**Finance Staff:**
- Track student payments
- Manage invoices
- Reconcile payments
- Generate financial reports
- Monitor outstanding balances

**ICT Administrators:**
- Manage system settings
- Create user accounts
- Monitor system performance
- Troubleshoot issues
- Perform backups

---

## 8. SUCCESS CRITERIA

### 8.1 Functional Success Criteria

1. **Authentication**: 100% of authorized users can successfully login
2. **Application Submission**: Students can submit complete applications without errors
3. **Document Upload**: All required documents can be uploaded (< 5MB each)
4. **Approval Workflow**: Staff can approve/reject applications in < 2 minutes
5. **Course Registration**: Students can register for courses within credit limits
6. **Search & Filter**: All search and filter functions return accurate results in < 1 second
7. **CSV Export**: All export functions download correct data in CSV format
8. **Payment Tracking**: All payments are recorded and visible in real-time
9. **Report Generation**: All reports can be generated and downloaded successfully

### 8.2 Technical Success Criteria

1. **Uptime**: System availability of 99.5% or higher
2. **Performance**: Page load times < 3 seconds on average
3. **Security**: No critical security vulnerabilities (regular scans)
4. **Data Integrity**: Zero data loss incidents
5. **Browser Compatibility**: Works on Chrome, Firefox, Safari, Edge (latest versions)
6. **Mobile Responsiveness**: Fully functional on devices 320px to 1920px+
7. **Error Handling**: All errors display user-friendly messages
8. **Database Performance**: Query response times < 500ms for 95% of queries

### 8.3 User Adoption Success Criteria

1. **Staff Training**: 90% of staff trained within 2 weeks of launch
2. **Student Adoption**: 70% of new students use online application in first semester
3. **User Satisfaction**: Average rating of 4/5 or higher in post-launch survey
4. **Support Tickets**: < 10 critical issues per month after first 3 months
5. **Data Accuracy**: < 1% error rate in student records
6. **Process Efficiency**: 50% reduction in application processing time
7. **Cost Savings**: Reduction in paper/printing costs by 80%

### 8.4 Business Success Criteria

1. **Registration Time**: Reduce average registration time from days to hours
2. **Application Approval**: Reduce approval cycle from weeks to 2-3 days
3. **Data Accessibility**: 100% of student records accessible online by authorized staff
4. **Reporting Speed**: Generate reports in minutes instead of days
5. **Payment Reconciliation**: Daily reconciliation instead of monthly
6. **Student Satisfaction**: Improved student experience (measured by surveys)
7. **Operational Efficiency**: Reduce administrative workload by 40%

---

## 9. ASSUMPTIONS & CONSTRAINTS

### 9.1 Assumptions

1. **Infrastructure**: UNRE has reliable internet connectivity across campus
2. **User Devices**: Students and staff have access to computers or smartphones
3. **Email Access**: All students have active email addresses
4. **Data Migration**: Existing student data can be exported in structured format
5. **Authentication**: Students have or can create Office 365 accounts
6. **Payments**: Payment gateways (BSP Pay, Kina Bank) APIs are accessible
7. **Training**: Staff will be available for training sessions
8. **Support**: IT support staff available for troubleshooting
9. **Stakeholder Engagement**: Key stakeholders available for requirements clarification
10. **Data Quality**: Existing student data is accurate and complete

### 9.2 Constraints

**Technical Constraints:**
1. **Technology Stack**: Must use specified technologies (Next.js, Supabase, Netlify)
2. **Browser Support**: Limited to modern browsers (IE not supported)
3. **File Size**: Document uploads limited to 5MB per file
4. **Database**: Limited by Supabase free tier quota (can upgrade as needed)
5. **Hosting**: Netlify bandwidth and build minute limitations

**Budget Constraints:**
1. **Hosting Costs**: Currently using free tiers (Netlify, Supabase)
2. **Third-party Services**: Limited budget for premium features
3. **Payment Gateway Fees**: Transaction fees apply for BSP Pay, Kina Bank

**Time Constraints:**
1. **Go-Live Date**: Target launch before next academic year enrollment
2. **Development Timeline**: Limited development resources
3. **Testing Period**: Minimum 2 weeks for UAT required

**Operational Constraints:**
1. **User Training**: Limited availability of staff for extended training
2. **Data Migration**: Existing manual records may be incomplete
3. **Change Management**: Resistance to change from some staff members
4. **Support Resources**: Limited IT support staff availability

**Regulatory Constraints:**
1. **Data Privacy**: Must comply with PNG data protection laws
2. **Student Records**: Must meet educational institution record-keeping requirements
3. **Financial Records**: Must comply with accounting and audit requirements

---

## 10. RISK MANAGEMENT

### 10.1 Identified Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **Low user adoption** | Medium | High | Comprehensive training, user-friendly design, support hotline |
| **Data migration errors** | Medium | High | Thorough data validation, pilot testing, backup procedures |
| **System downtime** | Low | High | Reliable hosting, monitoring, backup systems, support SLA |
| **Security breach** | Low | Critical | Strong authentication, encryption, regular security audits |
| **Payment gateway failure** | Medium | Medium | Multiple payment options, manual payment recording fallback |
| **Scope creep** | High | Medium | Clear scope definition, change control process, stakeholder agreement |
| **Insufficient training** | Medium | Medium | Detailed documentation, video tutorials, hands-on sessions |
| **Internet connectivity issues** | Medium | Medium | Offline mode for critical functions, mobile data alternatives |
| **Browser compatibility** | Low | Low | Cross-browser testing, modern browser requirements clearly stated |
| **Performance degradation** | Low | Medium | Load testing, performance monitoring, scalable infrastructure |

### 10.2 Risk Response Plans

**High-Priority Risks:**
1. **Security Breach**
   - Prevention: Multi-layer security (authentication, authorization, encryption)
   - Detection: Audit logs, intrusion detection, regular security scans
   - Response: Incident response plan, immediate notification, system lockdown procedures

2. **Data Loss**
   - Prevention: Daily automated backups, database replication
   - Detection: Data integrity checks, backup verification
   - Response: Restore from latest backup, investigate root cause, implement fixes

3. **Low User Adoption**
   - Prevention: User-centered design, early user involvement, pilot testing
   - Detection: Usage analytics, feedback surveys
   - Response: Additional training, UI improvements, incentive programs

---

## 11. CHANGE MANAGEMENT

### 11.1 Change Control Process

1. **Change Request Submission**
   - Stakeholder submits formal change request
   - Include: description, justification, expected impact

2. **Impact Assessment**
   - Technical team evaluates feasibility
   - Estimate effort, cost, timeline impact
   - Identify dependencies and risks

3. **Approval Process**
   - Minor changes: Project Owner approval
   - Major changes: Project Sponsor + Steering Committee approval
   - Budget impact: Finance approval required

4. **Implementation**
   - Update project plan and documentation
   - Communicate changes to all stakeholders
   - Implement and test changes
   - Update user documentation if needed

5. **Verification**
   - Test changed functionality
   - Obtain user acceptance
   - Update change log

### 11.2 Types of Changes

**Minor Changes** (approved by Project Owner):
- UI text updates
- Color/styling adjustments
- Minor bug fixes
- Documentation updates

**Major Changes** (requires Sponsor approval):
- New features or modules
- Workflow changes
- Database schema changes
- Integration additions
- Scope modifications

**Emergency Changes** (fast-track approval):
- Critical security patches
- System-down incidents
- Data corruption fixes

---

## 12. QUALITY ASSURANCE

### 12.1 Testing Strategy

**Unit Testing:**
- Test individual components and functions
- Validate form inputs and calculations
- Verify database queries

**Integration Testing:**
- Test data flow between components
- Verify API endpoint functionality
- Test authentication workflows
- Validate file upload to storage

**System Testing:**
- End-to-end testing of complete workflows
- Test all user roles and permissions
- Verify all CRUD operations
- Test concurrent user scenarios

**User Acceptance Testing (UAT):**
- Real users test in staging environment
- Validate against business requirements
- Collect feedback for improvements
- Sign-off before production deployment

**Performance Testing:**
- Load testing (concurrent users)
- Stress testing (peak loads)
- Page load time measurements
- Database query optimization

**Security Testing:**
- Penetration testing
- Vulnerability scanning
- Authentication/authorization testing
- Data encryption verification

**Browser/Device Testing:**
- Chrome, Firefox, Safari, Edge
- Desktop (1920px), Laptop (1366px), Tablet (768px), Mobile (375px)
- iOS and Android mobile browsers

### 12.2 Quality Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Code Coverage | > 70% | Automated testing tools |
| Bug Density | < 5 bugs per module | Bug tracking system |
| Defect Resolution Time | < 48 hours (critical) | Support ticket system |
| User Error Rate | < 3% | Analytics and error logs |
| System Availability | > 99.5% | Uptime monitoring |
| Page Load Time | < 3 seconds | Performance monitoring |
| User Satisfaction | > 4/5 rating | Post-launch surveys |

---

## 13. TRAINING & CAPACITY BUILDING

### 13.1 Training Plan

**Phase 1: Core Staff Training** (Week 1)
- Target: Registrar, Admissions, Finance staff
- Duration: 2-day intensive workshop
- Content: System overview, workflows, dashboard usage
- Method: Hands-on training with test accounts
- Materials: Training slides, user guides, video tutorials

**Phase 2: IT Administrator Training** (Week 1)
- Target: ICT support staff
- Duration: 1-day technical workshop
- Content: System architecture, admin functions, troubleshooting
- Method: Technical documentation review, system walkthrough
- Materials: Admin guide, deployment documentation

**Phase 3: Student Orientation** (Week 2-3)
- Target: All students (new and continuing)
- Duration: 1-hour sessions (multiple batches)
- Content: How to apply, register, upload documents
- Method: Demonstration + Q&A
- Materials: Student user guide, FAQ, video tutorials

**Phase 4: Ongoing Support** (Post-launch)
- Help desk for user questions
- Online knowledge base
- Regular refresher sessions
- Updates documentation for new features

### 13.2 Training Materials

1. **Video Tutorials** (screen recordings):
   - How to apply as new student
   - How to register for courses
   - How to complete enrollment form
   - How to upload documents
   - Staff: How to approve applications
   - Staff: How to generate reports

2. **User Guides** (PDF documents):
   - Student user guide (20-30 pages)
   - Registrar user guide (15-20 pages)
   - Admissions user guide (10-15 pages)
   - Finance user guide (15-20 pages)
   - Administrator manual (30-40 pages)

3. **Quick Reference Cards** (1-2 pages):
   - Common tasks cheat sheet
   - Keyboard shortcuts
   - Troubleshooting quick fixes

4. **FAQ Document**:
   - 20-30 most common questions and answers
   - Searchable online format
   - Regular updates based on support tickets

---

## 14. SUPPORT & MAINTENANCE

### 14.1 Support Levels

**Tier 1: Help Desk**
- First point of contact for users
- Handle common questions and issues
- Password resets, basic troubleshooting
- Response time: Within 4 business hours
- Available: Mon-Fri, 8AM-5PM

**Tier 2: Technical Support**
- Handle complex technical issues
- System configuration changes
- Data corrections
- Response time: Within 8 business hours
- Escalate to Tier 3 if needed

**Tier 3: Development Team**
- Fix bugs and system errors
- Implement patches and updates
- Major configuration changes
- Response time: Within 24 hours for critical issues
- Available on-call for emergencies

### 14.2 Maintenance Schedule

**Daily:**
- Monitor system uptime and performance
- Review error logs
- Check backup completion

**Weekly:**
- Review support tickets
- Database performance analysis
- Security log review

**Monthly:**
- System updates and patches
- Performance optimization
- User feedback review
- Generate usage reports

**Quarterly:**
- Security audit
- Disaster recovery test
- Capacity planning review
- Feature enhancement prioritization

**Annually:**
- Comprehensive system review
- Technology stack update assessment
- License renewals
- SLA review and adjustment

### 14.3 Service Level Agreement (SLA)

| Issue Priority | Response Time | Resolution Time | Availability |
|----------------|---------------|-----------------|--------------|
| **Critical** (system down) | 1 hour | 4 hours | 24/7 on-call |
| **High** (major function broken) | 4 hours | 1 business day | Business hours |
| **Medium** (minor function issue) | 8 hours | 3 business days | Business hours |
| **Low** (cosmetic, enhancement) | 2 business days | As scheduled | Business hours |

---

## 15. BUDGET CONSIDERATIONS

### 15.1 Development Costs

**Human Resources:**
- Lead Developer: 3 months full-time
- UI/UX Designer: 1 month part-time
- QA Tester: 2 weeks full-time
- Project Manager: 3 months part-time
- Documentation Specialist: 2 weeks

**Tools & Licenses:**
- Development tools: VS Code (free)
- Design tools: Figma (free tier)
- Project management: GitHub Projects (free)
- Communication: Microsoft Teams (existing)

**Third-Party Services:**
- Supabase: Free tier initially, $25/month for Pro if needed
- Netlify: Free tier initially, $19/month for Pro if needed
- Domain: ~$15/year for custom domain
- SSL Certificate: Free (Let's Encrypt via Netlify)

### 15.2 Operational Costs (Annual)

**Hosting & Infrastructure:**
- Netlify Pro: $228/year (if exceeds free tier)
- Supabase Pro: $300/year (if exceeds free tier)
- Domain renewal: $15/year
- Email service (SendGrid): $180/year (for 50K emails/month)
- Estimated Total: $723/year

**Payment Gateway Fees:**
- BSP Pay: Transaction fees (% per transaction)
- Kina Bank: Transaction fees (% per transaction)
- Estimated: Depends on transaction volume

**Support & Maintenance:**
- IT support staff: Existing university IT staff
- System administrator: Part-time (20% of IT admin role)
- Emergency support: On-call rotation of IT staff

**Training & Documentation:**
- Initial training materials: One-time development cost
- Ongoing training: 2 hours/month for new staff
- Documentation updates: As needed

### 15.3 Cost-Benefit Analysis

**Cost Savings:**
- Paper and printing: ~$5,000/year saved
- Manual data entry staff time: ~200 hours/year saved
- Physical document storage: Reduced space requirements
- Faster processing: Reduced student waiting time
- Fewer errors: Reduced correction overhead

**Return on Investment (ROI):**
- Initial investment: Development time + setup costs
- Annual operational cost: ~$1,000 - $1,500
- Annual savings: ~$8,000 - $10,000
- ROI: Positive within first year
- Intangible benefits: Improved reputation, student satisfaction, data accuracy

---

## 16. COMPLIANCE & GOVERNANCE

### 16.1 Data Protection & Privacy

**Compliance Requirements:**
- Papua New Guinea Data Protection laws
- Educational institution record-keeping standards
- Student privacy regulations
- Financial record-keeping requirements

**Data Handling:**
- Collect only necessary data
- Secure storage with encryption
- Limited access based on roles
- Data retention policy (7 years for student records)
- Secure data deletion procedures

**Privacy Policy:**
- Clear privacy notice for users
- Consent for data collection
- Right to access personal data
- Right to correction of errors
- Complaint handling process

### 16.2 Accessibility Standards

**WCAG 2.1 Compliance:**
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum)
- Alt text for images
- Clear form labels
- Error message clarity

**Mobile Accessibility:**
- Responsive design for all screen sizes
- Touch-friendly buttons (44px minimum)
- Readable text without zooming
- Offline capability for critical functions (future)

### 16.3 Audit & Compliance

**Audit Logging:**
- Log all critical operations (approve, reject, payments)
- User activity tracking
- System access logs
- Data modification history
- Retention: 2 years minimum

**Regular Audits:**
- Security audit: Quarterly
- Data integrity check: Monthly
- Access control review: Quarterly
- Compliance review: Annually

**Governance:**
- Steering committee oversight
- Regular progress reporting
- Budget review and approval
- Policy enforcement
- Risk management review

---

## 17. PROJECT CLOSURE

### 17.1 Closure Criteria

The project will be considered complete when:
1. ✅ All deliverables accepted by Project Owner
2. ✅ UAT successfully completed and signed off
3. ✅ System deployed to production
4. ✅ All documentation delivered
5. ✅ Training completed for all user groups
6. ✅ Handover to operations team completed
7. ✅ Post-implementation review conducted
8. ✅ Lessons learned documented
9. ✅ Final project report submitted
10. ✅ Budget reconciliation completed

### 17.2 Handover Activities

**Technical Handover:**
- Transfer all credentials (admin, database, hosting)
- Provide access to GitHub repository
- Configure backup procedures
- Document deployment process
- Set up monitoring and alerts

**Operational Handover:**
- Transfer to IT support team
- Establish help desk procedures
- Define escalation paths
- Schedule knowledge transfer sessions
- Provide maintenance documentation

**Administrative Handover:**
- Final project documentation
- Warranty/support agreements
- Training materials
- User feedback summary
- System usage statistics

### 17.3 Post-Implementation Review

**Review Meeting** (4 weeks after go-live):
- Assess achievement of success criteria
- Review actual vs. planned costs and timeline
- Identify lessons learned
- Gather user feedback
- Document recommendations for future projects
- Plan for ongoing enhancements

**Metrics to Review:**
- User adoption rates
- System performance
- Issue resolution time
- User satisfaction scores
- Cost vs. budget
- Timeline adherence

---

## 18. APPENDICES

### Appendix A: Acronyms & Definitions

| Acronym/Term | Definition |
|--------------|------------|
| **UNRE** | University of Natural Resources and Environment |
| **TOR** | Terms of Reference |
| **SSO** | Single Sign-On |
| **OTP** | One-Time Password |
| **RLS** | Row Level Security |
| **CSV** | Comma-Separated Values |
| **UAT** | User Acceptance Testing |
| **SLA** | Service Level Agreement |
| **API** | Application Programming Interface |
| **CRUD** | Create, Read, Update, Delete |
| **RBAC** | Role-Based Access Control |
| **IPG** | Internet Payment Gateway |
| **HTTPS** | Hypertext Transfer Protocol Secure |
| **TLS** | Transport Layer Security |
| **CI/CD** | Continuous Integration/Continuous Deployment |

### Appendix B: Contact Information

**Project Sponsor:**
- Name: [To be filled]
- Title: Vice Chancellor / Registrar
- Email: [To be filled]
- Phone: [To be filled]

**Project Owner:**
- Name: [To be filled]
- Title: ICT Manager / Senior Registrar
- Email: [To be filled]
- Phone: [To be filled]

**Development Team:**
- Lead Developer: [To be filled]
- Email: [To be filled]
- GitHub: https://github.com/emabi2002/unresors

**Support Contact:**
- Help Desk: [To be filled]
- Email: support@unre.edu.pg
- Phone: [To be filled]

### Appendix C: Referenced Documents

1. Manual "REGISTRATION OF ENROLLMENT" form (original paper form)
2. UNRE Student Handbook
3. University policies and procedures
4. Data protection regulations (PNG)
5. Educational standards and requirements

### Appendix D: Related URLs

- **GitHub Repository**: https://github.com/emabi2002/unresors
- **Live Production Site**: https://same-r0vlmzkaklc-latest.netlify.app
- **Staging Environment**: [To be configured]
- **Supabase Dashboard**: https://supabase.com/dashboard/project/kemnvfkdybsujxerhcqi
- **Netlify Dashboard**: https://app.netlify.com
- **Documentation**: Repository `.same/` folder

---

## 19. APPROVAL & SIGN-OFF

This Terms of Reference document has been reviewed and approved by:

**Project Sponsor:**
Name: _______________________________
Signature: ___________________________
Date: ________________________________

**Project Owner:**
Name: _______________________________
Signature: ___________________________
Date: ________________________________

**Lead Developer:**
Name: _______________________________
Signature: ___________________________
Date: ________________________________

**Quality Assurance:**
Name: _______________________________
Signature: ___________________________
Date: ________________________________

---

**Document Control:**
- **Document Title**: Terms of Reference - UNRE Online Student Registration System
- **Version**: 1.0
- **Date Created**: December 4, 2025
- **Created By**: Development Team
- **Review Cycle**: Quarterly or as needed
- **Next Review Date**: March 4, 2026

---

**End of Terms of Reference**
