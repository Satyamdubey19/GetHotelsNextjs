# Admin & Moderation Module Documentation

**Module Type:** Platform Management & Governance  
**Files Location:**

- Services: [services/admin.service.ts](../../services/admin.service.ts)
- API: [app/api/admin/](../../app/api/admin/)
- Pages: [app/admin/](../../app/admin/)

---

## 📖 Overview

The Admin & Moderation module provides tools for platform management, content moderation, user governance, KYC verification, payment oversight, and analytics. Only users with ADMIN role can access these features.

---

## 🎯 Core Functionality

### 1. Content Moderation

- **Listing Approval**: Review and approve hotels, tours, activities
- **Rejection Workflow**: Reject with reason and feedback
- **Auto-flagging**: Flag inappropriate content
- **Bulk Moderation**: Batch approve/reject operations
- **Moderation Queue**: Track pending reviews

### 2. User Management

- **User Oversight**: View all user accounts
- **Suspend/Ban**: Restrict user access
- **Fraud Detection**: Identify suspicious accounts
- **Support**: Resolve user issues
- **Export Data**: User records export

### 3. KYC Verification

- **Document Review**: Verify identity documents
- **Host Verification**: Approve hosts for listing
- **Manual Review**: QA process for edge cases
- **Expiry Tracking**: Renew verified documents
- **Risk Assessment**: Flag high-risk applicants

### 4. Payment Management

- **Transaction Oversight**: Monitor all payments
- **Refund Authorization**: Approve manual refunds
- **Payout Processing**: Release host earnings
- **Payment Disputes**: Handle payment issues
- **Reconciliation**: Verify payment accuracy

### 5. Analytics & Reporting

- **KPI Dashboard**: Platform metrics
- **Revenue Analytics**: Earnings, commissions
- **Usage Trends**: Booking patterns
- **Host Performance**: Top performers
- **Report Generation**: Export reports

---

## 📊 Admin Dashboard

### KPI Cards

```
┌─────────────────────────────────────────────┐
│ Total Users: 45,234  │  New This Week: 523  │
├─────────────────────────────────────────────┤
│ Active Bookings: 2,105  │  Revenue: ₹2.3Cr │
├─────────────────────────────────────────────┤
│ Pending Reviews: 34  │  Avg Rating: 4.7★   │
├─────────────────────────────────────────────┤
│ KYC Pending: 12  │  Payment Issues: 5     │
└─────────────────────────────────────────────┘
```

### Moderation Queue

```
┌─────────────────────────────────────────────────────┐
│ Pending Content Review (34 items)                   │
├─────────────────────────────────────────────────────┤
│ Hotels - 12 new listings pending                    │
│ Tours - 15 new packages pending                     │
│ Activities - 5 experiences pending                  │
│ User Posts - 2 posts flagged by users               │
│                                                     │
│ [Quick Action: Approve All] [Review First]          │
└─────────────────────────────────────────────────────┘
```

---

## 🔌 API Endpoints

### Listing Moderation

#### Get Pending Listings

```
GET /api/admin/listings?
  status=PENDING_REVIEW&
  type=hotel&  // hotel, tour, activity
  page=1&
  limit=20

Response:
{
  listings: [{
    id, title, hostId, type, status,
    submittedAt, images, description
  }],
  total: number
}
```

#### Approve Listing

```
POST /api/admin/listings/:id/approve
Authorization: Bearer admin_token

Request:
{
  notes?: string
}

Response: 200 OK
{
  listing: { ...listing, status: 'APPROVED' }
}
```

#### Reject Listing

```
POST /api/admin/listings/:id/reject
Authorization: Bearer admin_token

Request:
{
  rejectionReason: string,
  feedback: string
}

Response: 200 OK
{
  listing: { ...listing, status: 'REJECTED' }
}
```

### User Management

#### Get All Users

```
GET /api/admin/users?
  role=HOST&
  status=ACTIVE&
  page=1&
  limit=50

Response:
{
  users: User[],
  total: number
}
```

#### Suspend User

```
POST /api/admin/users/:userId/suspend
Authorization: Bearer admin_token

Request:
{
  reason: string,
  duration: number  // days (0 = permanent)
}

Response: 200 OK
{
  user: { ...user, status: 'SUSPENDED' }
}
```

#### Ban User

```
POST /api/admin/users/:userId/ban
Authorization: Bearer admin_token

Request:
{
  reason: string
}

Response: 200 OK
{
  user: { ...user, status: 'BANNED' }
}
```

### KYC Management

#### Get KYC Queue

```
GET /api/admin/kyc?
  status=PENDING&
  page=1

Response:
{
  applications: KYCApplication[],
  total: number
}
```

#### Review KYC

```
POST /api/admin/kyc/:applicationId/review
Authorization: Bearer admin_token

Request:
{
  approved: boolean,
  notes: string
}

Response: 200 OK
{
  application: KYCApplication
}
```

### Payment Management

#### Get Transactions

```
GET /api/admin/payments?
  status=COMPLETED&
  startDate=2026-05-01&
  endDate=2026-05-31&
  page=1

Response:
{
  payments: Payment[],
  total: number,
  totalAmount: number
}
```

#### Process Payout

```
POST /api/admin/payouts/:payoutId/process
Authorization: Bearer admin_token

Response: 200 OK
{
  payout: { status: 'PROCESSED', date: now }
}
```

### Analytics

#### Get Dashboard Metrics

```
GET /api/admin/analytics/dashboard

Response:
{
  users: { total, newThisWeek, active },
  bookings: { total, pending, completed },
  revenue: { total, thisMonth, thisWeek },
  listings: { total, approved, pending, rejected },
  ratings: { avgRating, totalReviews }
}
```

#### Get Revenue Report

```
GET /api/admin/analytics/revenue?
  period=monthly&  // daily, weekly, monthly
  startDate=2026-01-01&
  endDate=2026-05-31

Response:
{
  data: [{date, revenue, commissionCollected, payoutsProcessed}],
  totals: {revenue, commissions, payouts}
}
```

---

## 👮 Moderation Workflows

### Listing Approval Workflow

```
1. Host submits new hotel/tour/activity
   ├─ Automatic flagging for quality checks
   ├─ Images validated
   ├─ Description checked for inappropriate content
   └─ Status = PENDING_REVIEW
   ↓
2. Admin notified of pending review
   ├─ Dashboard shows in moderation queue
   ├─ Admin clicks to review
   └─ All details displayed
   ↓
3. Admin decision:
   Option A: APPROVE
   ├─ Listing becomes visible
   ├─ Host notified via email
   ├─ Add to search index
   └─ Status = APPROVED

   Option B: REJECT
   ├─ Provide specific feedback
   ├─ Host can fix and resubmit
   └─ Status = REJECTED

   Option C: REQUEST_CHANGES
   ├─ List specific items to fix
   ├─ Host can edit and resubmit
   └─ Status = CHANGES_REQUESTED
```

### KYC Verification Workflow

```
1. Host submits KYC application
   ├─ Upload identity document
   ├─ Verify details
   ├─ Bank information (optional)
   └─ Status = PENDING
   ↓
2. Admin reviews application
   ├─ Verify document authenticity
   ├─ Cross-check details
   ├─ Run background checks
   └─ Assess risk level
   ↓
3. Admin decision:
   Option A: VERIFIED
   ├─ Enable payout functionality
   ├─ Mark as verified
   └─ Host can now receive payments

   Option B: REJECTED
   ├─ Provide reason
   ├─ Host can resubmit
   └─ Flag in system

   Option C: REQUEST_CLARIFICATION
   ├─ Ask for additional docs
   ├─ Host resubmits
   └─ Re-review
```

---

## 🎯 Safety & Moderation

### Auto-Flagging Rules

```
Content Flags:
- Explicit/adult content
- Violence or hate speech
- Contact information (bypass payment)
- Duplicate listings
- Price outliers (too low/high)
- Suspicious patterns

User Flags:
- Multiple failed payments
- High chargeback rate
- Unusual login patterns
- Account age < 7 days + high booking
- Geographic anomalies
```

### Manual Moderation

```
Escalation Process:
1. User reports listing/user
2. Goes to moderation queue
3. Admin reviews evidence
4. Takes action (warn, remove, ban)
5. User notified (if suspended)
6. Reporter feedback sent
```

---

## 📊 Reporting & Analytics

### Revenue Dashboard

```
Total Platform Revenue (May 2026):
├─ Hotels: ₹1,05,000 (45%)
├─ Tours: ₹87,000 (38%)
├─ Activities: ₹30,000 (13%)
└─ Rentals: ₹8,000 (4%)

Commission Breakdown:
├─ Collected: ₹33,000 (15% of total)
├─ Payouts: ₹24,500
└─ Platform Retain: ₹8,500

Top 5 Hosts by Revenue:
1. Deluxe Resorts - ₹5,000
2. Adventure Tours Co - ₹4,200
3. Wellness Center - ₹3,800
4. Coastal Getaways - ₹3,500
5. Urban Stays - ₹3,200
```

### User Analytics

```
New Users This Month: 523
├─ Via Home: 345
├─ Via Search: 123
├─ Via Referral: 55

Active Users: 2,105
├─ Last 7 days: 1,843
├─ Last 30 days: 2,105
├─ Last 90 days: 4,230

User Retention:
├─ Week 1: 65%
├─ Month 1: 42%
├─ Month 3: 28%
```

---

## 🔐 Access Control

### Admin Permissions

```
User Management:
- View all users: ✓
- Edit user info: ✓
- Suspend/Ban users: ✓
- Reset passwords: ✓

Content Moderation:
- View pending listings: ✓
- Approve/Reject: ✓
- Edit listings: ✓
- Delete content: ✓

Financial:
- View transactions: ✓
- Approve payouts: ✓
- Issue refunds: ✓
- View reports: ✓

KYC:
- Review documents: ✓
- Approve/Reject: ✓
- Request clarification: ✓

Analytics:
- View dashboard: ✓
- Generate reports: ✓
- Export data: ✓
```

---

## ⚠️ Alert System

### Critical Alerts

```
- High chargeback rate (> 5%)
- Suspicious payment pattern
- Multiple reported listings
- User banned notification
- System errors/failures
- Payment gateway issues
```

### Dashboard Notifications

```
Real-time Updates:
- New pending reviews count
- Payment issues detected
- KYC applications submitted
- User reports submitted
- System maintenance alerts
```

---

## ✅ Testing Checklist

- [ ] Approval workflow works end-to-end
- [ ] Rejection sends correct emails
- [ ] KYC verification updates user status
- [ ] Payout processing calculates correctly
- [ ] User suspension/ban restricts access
- [ ] Analytics dashboard loads correctly
- [ ] Reports can be exported
- [ ] Audit logs track all admin actions
- [ ] Permission checks work correctly
- [ ] Moderation queue filters work
- [ ] Email notifications sent correctly

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
