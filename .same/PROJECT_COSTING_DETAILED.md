# DETAILED PROJECT COSTING
**UNRE Online Student Registration System**

---

## EXECUTIVE COST SUMMARY

**Total Initial Investment:** K 45,000 - K 75,000 (USD $12,500 - $20,800)
**Annual Operational Cost:** K 5,500 - K 8,000 (USD $1,500 - $2,200)
**Annual Cost Savings:** K 38,000+ (USD $10,500+)
**Return on Investment (ROI):** Positive within 6-12 months
**Payback Period:** 6-12 months

**Currency:** PNG Kina (K) | Conversion Rate: ~K3.60 = USD $1.00

---

## TABLE OF CONTENTS

1. [Development Costs](#1-development-costs)
2. [Infrastructure & Hosting](#2-infrastructure--hosting-costs)
3. [Third-Party Services](#3-third-party-services)
4. [Training & Documentation](#4-training--documentation-costs)
5. [Testing & Quality Assurance](#5-testing--quality-assurance)
6. [Deployment & Go-Live](#6-deployment--go-live-costs)
7. [Support & Maintenance](#7-support--maintenance-annual)
8. [Contingency & Miscellaneous](#8-contingency--miscellaneous)
9. [Cost Breakdown by Phase](#9-cost-breakdown-by-phase)
10. [Cost-Benefit Analysis](#10-cost-benefit-analysis)
11. [Payment Schedule](#11-payment-schedule-options)
12. [Cost Comparison Scenarios](#12-cost-comparison-scenarios)

---

## 1. DEVELOPMENT COSTS

### 1.1 Human Resources (Labor Costs)

#### **Lead Developer / Full-Stack Engineer**
- **Role**: System architecture, coding, database design, API development
- **Duration**: 3 months (12 weeks)
- **Hours**: 480 hours (40 hours/week × 12 weeks)
- **Rate**: K 50-80/hour (USD $14-22/hour)
- **Subtotal**: **K 24,000 - K 38,400** (USD $6,670 - $10,670)

**Breakdown by Phase:**
- Phase 1 (Authentication): 80 hours → K 4,000 - K 6,400
- Phase 2 (Forms): 120 hours → K 6,000 - K 9,600
- Phase 3 (Dashboards): 160 hours → K 8,000 - K 12,800
- Phase 4 (Integration): 80 hours → K 4,000 - K 6,400
- Phase 5 (Deployment): 40 hours → K 2,000 - K 3,200

#### **UI/UX Designer** (Part-time)
- **Role**: Interface design, user experience, mockups
- **Duration**: 1 month (4 weeks)
- **Hours**: 80 hours (20 hours/week × 4 weeks)
- **Rate**: K 40-60/hour (USD $11-17/hour)
- **Subtotal**: **K 3,200 - K 4,800** (USD $890 - $1,330)

**Tasks:**
- Dashboard designs (40 hours)
- Form layouts (20 hours)
- Responsive design (10 hours)
- Design system (10 hours)

#### **QA Tester / Quality Assurance**
- **Role**: Testing, bug reporting, UAT coordination
- **Duration**: 2 weeks
- **Hours**: 80 hours (40 hours/week × 2 weeks)
- **Rate**: K 30-50/hour (USD $8-14/hour)
- **Subtotal**: **K 2,400 - K 4,000** (USD $670 - $1,110)

**Tasks:**
- Test case creation (20 hours)
- Manual testing (40 hours)
- UAT coordination (10 hours)
- Bug tracking (10 hours)

#### **Project Manager** (Part-time)
- **Role**: Coordination, stakeholder management, reporting
- **Duration**: 3 months
- **Hours**: 120 hours (10 hours/week × 12 weeks)
- **Rate**: K 60-90/hour (USD $17-25/hour)
- **Subtotal**: **K 7,200 - K 10,800** (USD $2,000 - $3,000)

**Tasks:**
- Project planning (20 hours)
- Stakeholder meetings (30 hours)
- Progress tracking (30 hours)
- Documentation review (20 hours)
- Risk management (20 hours)

#### **Documentation Specialist / Technical Writer**
- **Role**: User guides, manuals, documentation
- **Duration**: 2 weeks
- **Hours**: 60 hours
- **Rate**: K 35-55/hour (USD $10-15/hour)
- **Subtotal**: **K 2,100 - K 3,300** (USD $580 - $915)

**Deliverables:**
- Student user guide (15 hours)
- Staff user guides (20 hours)
- Admin manual (10 hours)
- Video tutorial scripts (10 hours)
- FAQ document (5 hours)

#### **Database Administrator** (Consultant)
- **Role**: Database optimization, RLS policies, performance tuning
- **Duration**: 1 week
- **Hours**: 20 hours
- **Rate**: K 70-100/hour (USD $19-28/hour)
- **Subtotal**: **K 1,400 - K 2,000** (USD $390 - $555)

**Tasks:**
- Schema review and optimization
- Index creation and tuning
- RLS policy implementation
- Backup configuration
- Performance testing

### **Total Development Labor: K 40,300 - K 63,300** (USD $11,200 - $17,580)

---

## 2. INFRASTRUCTURE & HOSTING COSTS

### 2.1 Initial Setup (One-Time)

| Item | Description | Cost (K) | Cost (USD) |
|------|-------------|----------|------------|
| **Domain Registration** | .edu.pg or .com.pg domain | K 55 - K 90 | $15 - $25 |
| **SSL Certificate** | Free (Let's Encrypt via Netlify) | K 0 | $0 |
| **Development Environment** | Local setup, tools | K 0 | $0 |
| **Staging Environment** | Netlify free tier | K 0 | $0 |
| **Database Setup** | Supabase initial setup | K 0 | $0 |
| **Storage Buckets** | Supabase Storage setup | K 0 | $0 |
| **Email Service Setup** | SendGrid account setup | K 0 | $0 |

**Subtotal (One-Time): K 55 - K 90** (USD $15 - $25)

### 2.2 Recurring Costs (Annual)

#### **Hosting - Netlify**
| Tier | Monthly | Annual | Details |
|------|---------|--------|---------|
| **Free Tier** | K 0 | K 0 | 100GB bandwidth, 300 build minutes |
| **Pro Tier** | K 70 | K 840 | Unlimited bandwidth, 25K build minutes |
| **Recommendation** | - | **K 0 - K 840** | Start free, upgrade if needed |

**Expected:** Start with free tier, upgrade to Pro in year 2 if traffic exceeds limits.

#### **Database - Supabase**
| Tier | Monthly | Annual | Details |
|------|---------|--------|---------|
| **Free Tier** | K 0 | K 0 | 500MB database, 1GB storage, 2GB bandwidth |
| **Pro Tier** | K 90 | K 1,080 | 8GB database, 100GB storage, 250GB bandwidth |
| **Recommendation** | - | **K 0 - K 1,080** | Start free, upgrade year 1 if data exceeds 500MB |

**Expected:** Upgrade to Pro within 3-6 months as student data grows.

#### **Email Service - SendGrid**
| Plan | Monthly | Annual | Details |
|------|---------|--------|---------|
| **Free Tier** | K 0 | K 0 | 100 emails/day (3K/month) |
| **Essentials** | K 55 | K 660 | 50K emails/month |
| **Recommendation** | - | **K 0 - K 660** | Start free, upgrade for notifications |

**Expected:** Free tier sufficient for first 6 months, then upgrade for notifications.

#### **Domain Renewal**
- **Annual Cost**: K 55 - K 90 (USD $15 - $25)
- **Auto-renewal**: Recommended

#### **Backup Storage** (Optional)
- **Service**: External backups (AWS S3, Google Cloud)
- **Monthly**: K 20 - K 40
- **Annual**: **K 240 - K 480** (USD $65 - $135)
- **Recommendation**: Use Supabase built-in backups (included in Pro tier)

### **Total Infrastructure (Annual): K 55 - K 2,650** (USD $15 - $735)

**Realistic First Year:** K 1,200 - K 1,800 (USD $335 - $500)

---

## 3. THIRD-PARTY SERVICES

### 3.1 Payment Gateway Integration

#### **BSP Pay (Bank South Pacific)**
- **Setup Fee**: K 0 - K 500 (varies, often waived for universities)
- **Monthly Fee**: K 0 - K 150
- **Transaction Fee**: 2.5% - 3.5% per transaction
- **Annual Cost (excluding transaction fees)**: **K 0 - K 1,800**

**Estimated Transaction Volume:**
- 500 students × K 4,500 average fee = K 2,250,000
- Transaction fees @ 3%: **K 67,500/year**

#### **Kina Bank IPG (Internet Payment Gateway)**
- **Setup Fee**: K 0 - K 500
- **Monthly Fee**: K 0 - K 100
- **Transaction Fee**: 2.0% - 3.0% per transaction
- **Annual Cost (excluding transaction fees)**: **K 0 - K 1,200**

**Estimated Transaction Fees @ 2.5%:** K 56,250/year

#### **Visa/Mastercard Processing**
- **Merchant Account**: K 200 - K 500 setup
- **Monthly Fee**: K 50 - K 150
- **Transaction Fee**: 2.8% - 3.5%
- **Annual Cost**: **K 800 - K 2,300** (excluding transaction fees)

### **Total Payment Gateway (Annual, excluding transactions):**
**K 800 - K 5,300** (USD $220 - $1,470)

**Note:** Transaction fees are passed to students or absorbed by university. Not included in operational budget.

### 3.2 SMS Gateway (Optional - Future Phase)

- **Provider**: Digicel PNG, Bemobile
- **Setup**: K 500 - K 1,000
- **Monthly**: K 200 - K 500
- **SMS Cost**: K 0.20 - K 0.40 per SMS
- **Annual Cost**: **K 3,000 - K 7,000** (for 10K SMS/year)

**Status:** Not in current scope, future enhancement.

### 3.3 Microsoft Azure AD (Office 365)

- **Azure AD Free**: K 0 (included with Office 365 subscription)
- **University already has Office 365**: K 0 additional cost
- **Annual Cost**: **K 0**

### 3.4 Monitoring & Analytics (Optional)

- **Sentry** (Error tracking): Free tier or K 1,000/year for Pro
- **Google Analytics**: Free
- **Uptime Monitoring**: Free tier (Uptime Robot)
- **Annual Cost**: **K 0 - K 1,000** (USD $0 - $280)

### **Total Third-Party Services (Annual): K 800 - K 6,300** (USD $220 - $1,750)

---

## 4. TRAINING & DOCUMENTATION COSTS

### 4.1 Training Materials Development

| Item | Hours | Rate (K/hr) | Cost (K) |
|------|-------|-------------|----------|
| **Video Tutorials** (6 videos × 5 hours) | 30 | K 40-60 | K 1,200 - K 1,800 |
| **User Guides** (5 guides × 8 hours) | 40 | K 35-55 | K 1,400 - K 2,200 |
| **Quick Reference Cards** (5 cards × 2 hours) | 10 | K 35-55 | K 350 - K 550 |
| **Training Presentation** (Slides, exercises) | 16 | K 40-60 | K 640 - K 960 |
| **FAQ Document** (Research, write) | 8 | K 35-55 | K 280 - K 440 |
| **Screen Recording Tools** (Subscription) | - | - | K 200 - K 400 |

**Subtotal: K 4,070 - K 6,350** (USD $1,130 - $1,765)

### 4.2 Training Delivery

#### **Staff Training Sessions**

| Session | Participants | Duration | Trainer Rate | Cost (K) |
|---------|--------------|----------|--------------|----------|
| **Core Staff Workshop** | 15 staff | 2 days | K 1,500/day | K 3,000 |
| **IT Admin Training** | 3 admins | 1 day | K 1,200/day | K 1,200 |
| **Refresher Sessions** (4 sessions) | 10 staff | 2 hrs each | K 400/session | K 1,600 |

**Subtotal: K 5,800**

#### **Student Orientation**

| Session | Participants | Duration | Cost per Session | Total Sessions | Cost (K) |
|---------|--------------|----------|------------------|----------------|----------|
| **New Students** | 50/session | 1 hour | K 300 | 10 sessions | K 3,000 |
| **Continuing Students** | 100/session | 30 min | K 200 | 8 sessions | K 1,600 |

**Subtotal: K 4,600**

#### **Training Materials (Physical)**

| Item | Quantity | Unit Cost (K) | Total (K) |
|------|----------|---------------|-----------|
| **Printed User Guides** | 50 | K 20 | K 1,000 |
| **Quick Reference Cards** | 100 | K 5 | K 500 |
| **Training Certificates** | 50 | K 3 | K 150 |
| **USB Drives** (with materials) | 20 | K 25 | K 500 |

**Subtotal: K 2,150**

### **Total Training & Documentation: K 16,620 - K 19,900** (USD $4,615 - $5,530)

**Note:** This is primarily a one-time cost, with minimal annual refresher costs.

---

## 5. TESTING & QUALITY ASSURANCE

### 5.1 Testing Tools & Services

| Item | Cost (K) | Description |
|------|----------|-------------|
| **Browser Testing Tools** (BrowserStack) | K 400 - K 800/year | Cross-browser testing |
| **Performance Testing** (LoadImpact) | K 600 - K 1,200 | Load testing, stress tests |
| **Security Scanning** (Sucuri, Wordfence) | K 500 - K 1,000 | Vulnerability scans |
| **Test Data Generation Tools** | K 0 | Free/open source |
| **Bug Tracking** (GitHub Issues) | K 0 | Free with GitHub |

**Subtotal: K 1,500 - K 3,000** (USD $415 - $835)

### 5.2 QA Labor (Included in Development Costs)

- QA Tester: K 2,400 - K 4,000 (already counted in Section 1.1)

### 5.3 User Acceptance Testing (UAT)

| Item | Cost (K) | Description |
|------|----------|-------------|
| **UAT Coordinator** (internal staff) | K 0 | Existing staff |
| **Test User Incentives** (10 users) | K 500 | K 50/user gift cards |
| **UAT Environment** | K 0 | Staging on Netlify |

**Subtotal: K 500**

### **Total Testing & QA: K 2,000 - K 3,500** (USD $555 - $970)

---

## 6. DEPLOYMENT & GO-LIVE COSTS

### 6.1 Production Deployment

| Item | Hours | Rate (K/hr) | Cost (K) |
|------|-------|-------------|----------|
| **Production Setup** | 8 | K 60-80 | K 480 - K 640 |
| **Database Migration** | 16 | K 70-100 | K 1,120 - K 1,600 |
| **DNS Configuration** | 2 | K 60-80 | K 120 - K 160 |
| **SSL Setup** | 1 | K 60-80 | K 60 - K 80 |
| **Monitoring Setup** | 4 | K 60-80 | K 240 - K 320 |

**Subtotal: K 2,020 - K 2,800** (USD $560 - $780)

### 6.2 Go-Live Support

| Item | Duration | Cost (K) | Description |
|------|----------|----------|-------------|
| **Go-Live Week Support** | 5 days | K 3,000 - K 4,500 | On-site/on-call support |
| **Emergency Hotline** | 2 weeks | K 1,500 - K 2,500 | 24/7 support during launch |
| **Post-Launch Monitoring** | 1 month | K 2,000 - K 3,000 | Daily monitoring |

**Subtotal: K 6,500 - K 10,000** (USD $1,805 - $2,780)

### 6.3 Data Migration Services

| Item | Hours | Rate (K/hr) | Cost (K) |
|------|-------|-------------|----------|
| **Data Cleanup** | 20 | K 40-60 | K 800 - K 1,200 |
| **Data Import Scripts** | 16 | K 60-80 | K 960 - K 1,280 |
| **Validation & Testing** | 12 | K 50-70 | K 600 - K 840 |

**Subtotal: K 2,360 - K 3,320** (USD $655 - $920)

### **Total Deployment & Go-Live: K 10,880 - K 16,120** (USD $3,020 - $4,480)

---

## 7. SUPPORT & MAINTENANCE (Annual)

### 7.1 Technical Support

#### **Help Desk (Tier 1)**
- **Staffing**: 2 staff members (existing IT team)
- **Time Allocation**: 25% of time
- **Annual Cost**: K 0 (existing staff, reallocated)

#### **Technical Support (Tier 2)**
- **Staffing**: 1 IT specialist
- **Time Allocation**: 50% of time
- **Annual Cost**: **K 15,000 - K 25,000** (USD $4,165 - $6,945)

#### **Development Support (Tier 3)**
- **Retainer**: 10 hours/month
- **Rate**: K 70-90/hour
- **Annual Cost**: **K 8,400 - K 10,800** (USD $2,330 - $3,000)

**Subtotal: K 23,400 - K 35,800** (USD $6,500 - $9,945)

### 7.2 Maintenance & Updates

| Item | Frequency | Annual Cost (K) | Description |
|------|-----------|-----------------|-------------|
| **Security Patches** | Monthly | K 2,400 - K 3,600 | Updates, security fixes |
| **Feature Enhancements** | Quarterly | K 4,000 - K 6,000 | Minor improvements |
| **Bug Fixes** | As needed | K 2,000 - K 4,000 | Issue resolution |
| **Performance Optimization** | Bi-annual | K 1,600 - K 2,400 | Speed improvements |
| **Database Maintenance** | Monthly | K 1,200 - K 2,000 | Cleanup, optimization |

**Subtotal: K 11,200 - K 18,000** (USD $3,110 - $5,000)

### 7.3 Backup & Disaster Recovery

| Item | Annual Cost (K) | Description |
|------|-----------------|-------------|
| **Automated Backups** | K 0 - K 500 | Included in Supabase Pro or external |
| **Backup Testing** (quarterly) | K 800 - K 1,200 | Restore testing |
| **Disaster Recovery Plan Updates** | K 400 - K 800 | Annual review |

**Subtotal: K 1,200 - K 2,500** (USD $335 - $695)

### 7.4 Monitoring & Analytics

| Item | Annual Cost (K) | Description |
|------|-----------------|-------------|
| **Uptime Monitoring** | K 0 - K 400 | Free or paid service |
| **Performance Monitoring** | K 500 - K 1,000 | APM tools |
| **Error Tracking** | K 0 - K 1,000 | Sentry or similar |
| **Analytics** | K 0 | Google Analytics (free) |

**Subtotal: K 500 - K 2,400** (USD $140 - $665)

### **Total Annual Support & Maintenance: K 36,300 - K 58,700** (USD $10,085 - $16,305)

**Note:** This can be reduced by using internal IT staff (reduce by K 15,000-25,000)

---

## 8. CONTINGENCY & MISCELLANEOUS

### 8.1 Contingency Budget

- **Percentage**: 10-15% of total development cost
- **Calculation**: 15% × K 70,000 average = **K 10,500**
- **Purpose**: Unforeseen issues, scope changes, delays

### 8.2 Miscellaneous Costs

| Item | Cost (K) | Description |
|------|----------|-------------|
| **Project Management Tools** | K 0 - K 500 | GitHub Projects (free) or Jira |
| **Communication Tools** | K 0 | Microsoft Teams (existing) |
| **Design Tools** | K 0 - K 600 | Figma free tier or Pro |
| **Stock Images/Assets** | K 200 - K 500 | Icons, images, graphics |
| **Legal Review** (optional) | K 1,000 - K 3,000 | Contract, privacy policy review |
| **Travel/Meetings** | K 500 - K 1,500 | On-site meetings if needed |

**Subtotal: K 1,700 - K 6,100** (USD $470 - $1,695)

### **Total Contingency & Misc: K 12,200 - K 16,600** (USD $3,390 - $4,610)

---

## 9. COST BREAKDOWN BY PHASE

### Phase 1: Authentication & Foundation (2 weeks)
| Category | Cost (K) | % of Total |
|----------|----------|------------|
| Development Labor | K 4,000 - K 6,400 | 6-8% |
| Infrastructure Setup | K 55 - K 90 | <1% |
| Tools & Services | K 200 - K 400 | <1% |
| **Phase 1 Total** | **K 4,255 - K 6,890** | **6-9%** |

### Phase 2: Registration Forms (3 weeks)
| Category | Cost (K) | % of Total |
|----------|----------|------------|
| Development Labor | K 6,000 - K 9,600 | 9-13% |
| UI/UX Design | K 3,200 - K 4,800 | 5-6% |
| Testing | K 800 - K 1,200 | 1-2% |
| **Phase 2 Total** | **K 10,000 - K 15,600** | **14-21%** |

### Phase 3: Staff Dashboards (3 weeks)
| Category | Cost (K) | % of Total |
|----------|----------|------------|
| Development Labor | K 8,000 - K 12,800 | 11-17% |
| Testing | K 1,000 - K 1,500 | 1-2% |
| **Phase 3 Total** | **K 9,000 - K 14,300** | **13-19%** |

### Phase 4: Integration & Testing (2 weeks)
| Category | Cost (K) | % of Total |
|----------|----------|------------|
| Development Labor | K 4,000 - K 6,400 | 6-8% |
| QA Testing | K 2,400 - K 4,000 | 3-5% |
| Database Admin | K 1,400 - K 2,000 | 2-3% |
| Testing Tools | K 1,500 - K 3,000 | 2-4% |
| Payment Gateway Setup | K 500 - K 1,500 | 1-2% |
| **Phase 4 Total** | **K 9,800 - K 16,900** | **14-22%** |

### Phase 5: Deployment & Training (2 weeks)
| Category | Cost (K) | % of Total |
|----------|----------|------------|
| Development Labor | K 2,000 - K 3,200 | 3-4% |
| Deployment | K 2,020 - K 2,800 | 3-4% |
| Go-Live Support | K 6,500 - K 10,000 | 9-13% |
| Data Migration | K 2,360 - K 3,320 | 3-4% |
| Training Materials | K 4,070 - K 6,350 | 6-8% |
| Training Delivery | K 10,400 - K 10,400 | 14% |
| **Phase 5 Total** | **K 27,350 - K 36,070** | **38-48%** |

### Project Management (Across all phases)
| Category | Cost (K) | % of Total |
|----------|----------|------------|
| PM Labor | K 7,200 - K 10,800 | 10-14% |
| Documentation | K 2,100 - K 3,300 | 3-4% |
| Contingency | K 10,500 - K 10,500 | 15% |
| Miscellaneous | K 1,700 - K 6,100 | 2-8% |
| **PM & Overhead Total** | **K 21,500 - K 30,700** | **30-41%** |

### **TOTAL INITIAL PROJECT COST: K 81,905 - K 120,460**

---

## 10. COST-BENEFIT ANALYSIS

### 10.1 Total Investment Summary

| Category | One-Time Cost (K) | Annual Cost (K) |
|----------|-------------------|-----------------|
| **Development** | K 40,300 - K 63,300 | K 0 |
| **Project Management** | K 9,300 - K 14,100 | K 0 |
| **Infrastructure** | K 55 - K 90 | K 1,200 - K 1,800 |
| **Third-Party Services** | K 500 - K 1,500 | K 800 - K 6,300 |
| **Training & Docs** | K 16,620 - K 19,900 | K 1,000 - K 2,000 |
| **Testing & QA** | K 2,000 - K 3,500 | K 500 - K 1,000 |
| **Deployment** | K 10,880 - K 16,120 | K 0 |
| **Support & Maintenance** | K 0 | K 36,300 - K 58,700 |
| **Contingency & Misc** | K 12,200 - K 16,600 | K 2,000 - K 3,000 |
| **TOTAL** | **K 91,855 - K 135,110** | **K 41,800 - K 72,800** |

**Realistic Estimate:**
- **One-Time Investment:** K 100,000 - K 110,000 (USD $27,800 - $30,555)
- **Annual Operational:** K 45,000 - K 55,000 (USD $12,500 - $15,280)

### 10.2 Annual Cost Savings

| Current Manual Process | Cost (K/year) | After Automation | Cost (K/year) | **Savings (K)** |
|------------------------|---------------|------------------|---------------|-----------------|
| **Paper Forms & Printing** | K 18,000 | Digital forms | K 0 | **K 18,000** |
| **Manual Data Entry** (2 staff, 25% time) | K 12,000 | Automated | K 0 | **K 12,000** |
| **Physical Document Storage** | K 1,800 | Cloud storage | K 500 | **K 1,300** |
| **Manual Payment Tracking** | K 6,000 | Automated | K 0 | **K 6,000** |
| **Error Corrections** (estimated) | K 8,000 | Reduced by 90% | K 800 | **K 7,200** |
| **Report Generation** (manual) | K 4,000 | Automated | K 200 | **K 3,800** |
| **Student Support** (reduced queries) | K 5,000 | Self-service | K 2,000 | **K 3,000** |
| **TOTAL SAVINGS** | **K 54,800** | - | **K 3,500** | **K 51,300** |

### 10.3 Return on Investment (ROI)

**Scenario 1: Minimal Support (using internal IT)**
- **Initial Investment:** K 100,000
- **Annual Operational Cost:** K 25,000 (internal IT, minimal external support)
- **Annual Savings:** K 51,300
- **Net Annual Benefit:** K 51,300 - K 25,000 = **K 26,300**
- **Payback Period:** K 100,000 ÷ K 26,300 = **3.8 months**
- **5-Year ROI:** (K 26,300 × 5 - K 100,000) ÷ K 100,000 = **31.5%**

**Scenario 2: Full External Support**
- **Initial Investment:** K 110,000
- **Annual Operational Cost:** K 55,000 (full external support)
- **Annual Savings:** K 51,300
- **Net Annual Benefit:** K 51,300 - K 55,000 = **-K 3,700** (Year 1)
- **But operational cost reduces to K 35,000 in Year 2+:** K 16,300 net benefit
- **Payback Period:** ~18 months
- **5-Year ROI:** Still positive

**Conclusion:** System pays for itself in 4-18 months depending on support model.

### 10.4 Intangible Benefits (Not Quantified)

✅ **Improved Student Satisfaction** - 24/7 access, faster processing
✅ **Enhanced University Reputation** - Modern, efficient systems
✅ **Better Data Accuracy** - Reduced errors from 15% to <1%
✅ **Faster Decision Making** - Real-time reports and analytics
✅ **Scalability** - Can handle growth without proportional cost increase
✅ **Compliance** - Better audit trails and data security
✅ **Environmental Impact** - Reduced paper consumption
✅ **Staff Productivity** - More time for value-added tasks

---

## 11. PAYMENT SCHEDULE OPTIONS

### Option A: Milestone-Based Payment (Recommended)

| Milestone | Deliverables | % of Total | Amount (K) |
|-----------|--------------|------------|------------|
| **Project Start** | Contract signed, requirements finalized | 20% | K 20,000 - K 22,000 |
| **Phase 1 Complete** | Authentication system deployed | 10% | K 10,000 - K 11,000 |
| **Phase 2 Complete** | All forms functional and tested | 15% | K 15,000 - K 16,500 |
| **Phase 3 Complete** | All dashboards functional | 20% | K 20,000 - K 22,000 |
| **Phase 4 Complete** | Integration and testing done | 15% | K 15,000 - K 16,500 |
| **Go-Live** | System deployed to production | 15% | K 15,000 - K 16,500 |
| **Post-Launch** (30 days) | Training complete, system stable | 5% | K 5,000 - K 5,500 |
| **TOTAL** | - | **100%** | **K 100,000 - K 110,000** |

### Option B: Monthly Payment (Alternative)

- **Duration:** 4 months (16 weeks)
- **Monthly Payment:** K 25,000 - K 27,500
- **Final Payment:** K 10,000 - K 11,000 (after 30-day post-launch period)
- **Total:** K 110,000

### Option C: Phase-Based Payment (Simplified)

| Phase | Amount (K) | Timeline |
|-------|------------|----------|
| **Phases 1-2** (Authentication + Forms) | K 35,000 | Months 1-2 |
| **Phase 3** (Dashboards) | K 25,000 | Month 2-3 |
| **Phases 4-5** (Integration, Testing, Deployment) | K 30,000 | Month 3-4 |
| **Post-Launch Support** | K 10,000 | Month 4 |
| **Training** | K 10,000 | Month 4 |
| **TOTAL** | **K 110,000** | 4 months |

---

## 12. COST COMPARISON SCENARIOS

### Scenario A: Budget-Conscious (Minimum Viable Product)

**Approach:** Internal resources, minimal external vendors, free tier services

| Category | Cost (K) |
|----------|----------|
| **Development** (2 internal developers, 3 months) | K 30,000 |
| **Infrastructure** (free tiers year 1) | K 0 |
| **Training** (internal trainers) | K 5,000 |
| **Testing** (internal QA) | K 2,000 |
| **Deployment** (minimal support) | K 5,000 |
| **Contingency** (10%) | K 4,200 |
| **TOTAL ONE-TIME** | **K 46,200** |
| **Annual Operational** (internal IT support) | **K 15,000** |

**Pros:** Lower initial cost
**Cons:** Longer timeline, basic features only, higher risk

### Scenario B: Standard Professional (Recommended)

**Approach:** Mix of internal and external resources, professional services

| Category | Cost (K) |
|----------|----------|
| **Development** (external lead dev + internal support) | K 50,000 |
| **Infrastructure** (Pro tier services) | K 2,000 |
| **Training** (professional trainers) | K 15,000 |
| **Testing** (external QA) | K 5,000 |
| **Deployment** (full support) | K 15,000 |
| **Project Management** (external PM) | K 10,000 |
| **Contingency** (15%) | K 14,500 |
| **TOTAL ONE-TIME** | **K 111,500** |
| **Annual Operational** (mix internal/external) | **K 35,000** |

**Pros:** Balanced cost/quality, proven approach
**Cons:** Moderate investment required

### Scenario C: Premium Enterprise

**Approach:** Full external team, enterprise-grade services, premium support

| Category | Cost (K) |
|----------|----------|
| **Development** (senior external team) | K 75,000 |
| **Infrastructure** (enterprise tier) | K 5,000 |
| **Training** (comprehensive program) | K 25,000 |
| **Testing** (full QA team) | K 10,000 |
| **Deployment** (24/7 support) | K 20,000 |
| **Project Management** (dedicated PM) | K 15,000 |
| **Contingency** (20%) | K 30,000 |
| **TOTAL ONE-TIME** | **K 180,000** |
| **Annual Operational** (full managed service) | **K 70,000** |

**Pros:** Fastest delivery, highest quality, comprehensive support
**Cons:** Highest cost

---

## 13. COST OPTIMIZATION STRATEGIES

### 13.1 Reduce Initial Investment

1. **Use Internal Staff** - Save K 15,000 - K 25,000
2. **Start with Free Tiers** - Save K 1,500 - K 2,500 (Year 1)
3. **Phased Training** - Spread K 10,000 over 6 months
4. **Minimal MVP First** - Defer K 20,000 in advanced features
5. **Self-Service Documentation** - Save K 5,000 in training delivery

**Potential Savings:** K 51,500 - K 62,500

### 13.2 Reduce Annual Operational Costs

1. **Use Internal IT Support** - Save K 15,000 - K 25,000
2. **Optimize Hosting** - Save K 500 - K 1,000 (right-size services)
3. **Automated Monitoring** - Save K 2,000 in manual checks
4. **Self-Service Help** - Reduce K 3,000 in support tickets
5. **Quarterly Instead of Monthly Updates** - Save K 2,000

**Potential Savings:** K 22,500 - K 31,000/year

### 13.3 Increase ROI

1. **Launch Faster** - Achieve savings 2 months earlier = K 8,500
2. **Add Payment Gateway** - Reduce manual tracking by K 8,000/year
3. **Automate More Workflows** - Additional K 5,000/year savings
4. **Reduce Printing Further** - Additional K 3,000/year savings

**Additional Annual Savings:** K 24,000+

---

## 14. PAYMENT GATEWAY TRANSACTION FEES

### 14.1 Estimated Transaction Volume (Annual)

| Student Type | Count | Avg Fee (K) | Total (K) |
|--------------|-------|-------------|-----------|
| **New Students** | 200 | K 4,500 | K 900,000 |
| **Continuing Students** (Semester 1) | 600 | K 2,250 | K 1,350,000 |
| **Continuing Students** (Semester 2) | 600 | K 2,250 | K 1,350,000 |
| **Late Payments** | 100 | K 1,500 | K 150,000 |
| **TOTAL VOLUME** | 1,500 | - | **K 3,750,000** |

### 14.2 Transaction Fee Comparison

| Provider | Fee % | Annual Fee (K) | Who Pays |
|----------|-------|----------------|----------|
| **BSP Pay** | 3.0% | K 112,500 | Student (added to total) |
| **Kina Bank** | 2.5% | K 93,750 | Student (added to total) |
| **Visa/Mastercard** | 3.2% | K 120,000 | Student (added to total) |

**University Cost:** K 0 (fees passed to students)
**OR**
**University Absorbs:** K 93,750 - K 120,000/year (if covering fees)

**Recommendation:** Add payment gateway fee to student invoice (standard practice).

---

## 15. SUMMARY & RECOMMENDATIONS

### 15.1 Recommended Budget

#### **Initial Investment (One-Time)**

| Category | Budget (K) | Budget (USD) |
|----------|------------|--------------|
| Development & Project Management | K 55,000 | $15,280 |
| Infrastructure Setup | K 2,000 | $555 |
| Training & Documentation | K 18,000 | $5,000 |
| Testing & QA | K 5,000 | $1,390 |
| Deployment & Go-Live | K 12,000 | $3,335 |
| Contingency (15%) | K 13,800 | $3,835 |
| **TOTAL INITIAL** | **K 105,800** | **$29,395** |

#### **Annual Operational Cost (Year 1)**

| Category | Budget (K) | Budget (USD) |
|----------|------------|--------------|
| Infrastructure & Hosting | K 1,800 | $500 |
| Third-Party Services | K 3,000 | $835 |
| Support & Maintenance | K 30,000 | $8,335 |
| Training Refreshers | K 2,000 | $555 |
| Monitoring & Updates | K 3,000 | $835 |
| Contingency | K 5,000 | $1,390 |
| **TOTAL ANNUAL** | **K 44,800** | **$12,445** |

#### **Annual Operational Cost (Year 2+)**

- Reduced to **K 25,000 - K 35,000** (USD $6,945 - $9,720)
- No training costs
- Internal support established
- Optimized infrastructure

### 15.2 Financial Justification

**Investment:** K 105,800 (one-time) + K 44,800 (Year 1) = **K 150,600**
**Annual Savings:** **K 51,300**
**Payback Period:** K 150,600 ÷ K 51,300 = **2.9 years** (conservative)

**Alternative Calculation (excluding Year 1 operational):**
**Investment:** K 105,800
**Net Annual Benefit:** K 51,300 - K 30,000 (Year 2+ operational) = K 21,300
**Payback Period:** K 105,800 ÷ K 21,300 = **5 months**

### 15.3 Key Recommendations

1. **Start with Budget-Conscious Approach:** K 75,000 - K 85,000
   - Use internal developers where possible
   - Free tier infrastructure (Year 1)
   - Phased training delivery

2. **Upgrade to Standard Professional if Budget Allows:** K 105,000 - K 115,000
   - Better quality, faster delivery
   - Professional support
   - Comprehensive training

3. **Payment Schedule:** Milestone-based (Option A)
   - Reduces risk for university
   - Ensures quality at each stage
   - Aligns payment with value delivery

4. **Cost Optimization:**
   - Leverage internal IT staff for ongoing support (save K 15,000-25,000/year)
   - Start with free tiers, upgrade as needed (save K 2,000 Year 1)
   - Automate help desk with comprehensive docs (save K 3,000/year)

5. **ROI Maximization:**
   - Launch during low-enrollment period for smooth transition
   - Comprehensive staff training to reduce support burden
   - Phased rollout: Start with new students, then continuing students

---

## 16. FUNDING OPTIONS

### Option 1: Full Upfront Payment
- **Amount:** K 105,800
- **Pros:** Best pricing, no interest
- **Cons:** Large capital outlay

### Option 2: Installment Plan (4 months)
- **Monthly:** K 26,450 × 4 = K 105,800
- **Pros:** Spreads cost
- **Cons:** None (same total)

### Option 3: Grant/Donor Funding
- **Target:** K 100,000 from education/technology grants
- **University Contribution:** K 5,800 + operational costs
- **Pros:** Minimal university outlay
- **Cons:** Application time, uncertain approval

### Option 4: Student Technology Fee
- **New Fee:** K 50/student/year
- **Students:** 800
- **Annual Revenue:** K 40,000
- **Covers:** Operational costs + ROI in 3 years
- **Pros:** Self-sustaining
- **Cons:** Requires approval, student buy-in

---

## 17. RISK-ADJUSTED BUDGETING

### Low Risk (90% Confidence)

**Minimum Budget:** K 85,000 (one-time) + K 30,000 (annual)

- Assumes:
  - Internal development support
  - No major scope changes
  - Free tier services sufficient
  - Minimal external support

### Medium Risk (75% Confidence)

**Standard Budget:** K 105,800 (one-time) + K 44,800 (annual)

- Assumes:
  - Mix internal/external resources
  - 15% contingency covers overruns
  - Standard professional services
  - Some scope adjustments

### High Risk (50% Confidence)

**Maximum Budget:** K 135,000 (one-time) + K 60,000 (annual)

- Assumes:
  - Significant scope changes
  - Full external development
  - Premium services required
  - Extended support period

**Recommendation:** Budget for Medium Risk scenario (K 105,800), have contingency plan for High Risk.

---

## APPENDIX A: Cost Assumptions

1. **Exchange Rate:** K 3.60 = USD $1.00 (approximate)
2. **Labor Rates:** Based on PNG IT market rates 2025
3. **Student Count:** 800 total (200 new, 600 continuing)
4. **Transaction Volume:** 1,500 transactions/year
5. **Infrastructure:** Assumes growth from free to Pro tier in 6-12 months
6. **Support:** Mix of internal (65%) and external (35%) support
7. **Training:** One-time comprehensive training in Year 1, refreshers thereafter
8. **Inflation:** 5% annual increase in operational costs

---

## APPENDIX B: Alternative Pricing Models

### Model 1: Fixed Price Contract
- **Total:** K 110,000 (all-inclusive)
- **Includes:** Development, deployment, training, 90-day support
- **Excludes:** Ongoing maintenance (separate annual contract)

### Model 2: Time & Materials
- **Developer Rate:** K 70/hour
- **Estimated Hours:** 600-800 hours
- **Estimated Total:** K 42,000 - K 56,000 (development only)
- **Plus:** Infrastructure, training, support (add K 50,000)
- **Total:** K 92,000 - K 106,000

### Model 3: Subscription/SaaS Model
- **Monthly Fee:** K 6,000 - K 8,000
- **Includes:** Hosting, support, updates, maintenance
- **Initial Setup:** K 25,000
- **Annual Cost:** K 72,000 - K 96,000 + K 25,000 (Year 1) = K 97,000
- **5-Year Total:** K 385,000 - K 505,000
- **Pros:** Predictable costs, no internal IT needed
- **Cons:** Much higher long-term cost

**Recommendation:** Model 1 (Fixed Price) for development, then annual support contract.

---

**Document Version:** 1.0
**Date:** December 4, 2025
**Prepared By:** Development Team
**Currency:** PNG Kina (K) | USD ($)
**Conversion Rate:** K 3.60 = USD $1.00

**For Questions Contact:**
support@unre.edu.pg
GitHub: https://github.com/emabi2002/unresors

---

**END OF DETAILED COSTING DOCUMENT**
