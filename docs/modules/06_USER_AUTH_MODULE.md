# User Authentication & Profile Module Documentation

**Module Type:** Identity Management  
**Files Location:**

- Services: [services/auth.service.ts](../../services/auth.service.ts)
- API: [app/api/auth/](../../app/api/auth/)
- Context: [contexts/AuthContext.tsx](../../contexts/AuthContext.tsx)

---

## 📖 Overview

The User Authentication & Profile module manages user registration, login, session management, profile information, and user roles. It integrates with NextAuth.js, JWT tokens, and bcrypt password hashing.

---

## 🎯 Core Functionality

### 1. Authentication

- **Sign Up**: Email registration with password
- **Email Verification**: Confirm email address
- **Login**: Email/password authentication
- **Forgot Password**: Password reset via email link
- **Session Management**: JWT tokens and refresh tokens
- **Logout**: Terminate session

### 2. User Profiles

- **Create Profile**: During registration
- **Edit Profile**: Update personal information
- **Avatar Upload**: Profile picture to Cloudinary
- **Preferences**: Language, currency, notifications
- **Privacy Settings**: Control visibility

### 3. Role Management

- **USER**: Standard user/guest
- **HOST**: Property/experience owner
- **ADMIN**: Platform administrator
- **Role Assignment**: During registration or admin action
- **Permission Control**: Based on roles

### 4. Security

- **Password Hashing**: Bcrypt encryption
- **JWT Tokens**: Secure authentication
- **Refresh Tokens**: Long-lived sessions
- **Rate Limiting**: Prevent brute force
- **Email Verification**: Prevent spam accounts

---

## 📊 Data Models

### User Model

```typescript
interface User {
  id: string
  email: string
  password: string  // bcrypt hashed
  name: string
  phone?: string

  // Profile
  avatar?: string  // Cloudinary URL
  bio?: string
  dateOfBirth?: Date
  gender?: string
  nationality?: string

  // Address
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string

  // Verification
  emailVerified?: Date
  phoneVerified?: Date
  documentVerified: boolean

  // Account
  role: UserRole  // USER, HOST, ADMIN
  status: UserStatus  // ACTIVE, INACTIVE, SUSPENDED, BANNED

  // Preferences
  currency: string  // 'INR'
  language: string  // 'en'
  newsletter: boolean

  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  deletedAt?: Date
}

enum UserRole {
  USER
  HOST
  ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  BANNED
}
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### Sign Up

```
POST /api/auth/signup
Content-Type: application/json

Request:
{
  email: string,
  password: string,
  name: string,
  role?: 'USER' | 'HOST'  // Default: USER
}

Response: 201 Created
{
  user: { id, email, name, role },
  token: string,
  refreshToken: string
}

Errors:
- 400: Email already exists
- 400: Password too weak
- 422: Invalid email format
```

#### Login

```
POST /api/auth/login
Content-Type: application/json

Request:
{
  email: string,
  password: string
}

Response: 200 OK
{
  user: { id, email, name, role, avatar },
  token: string,
  refreshToken: string
}

Errors:
- 401: Invalid email or password
- 423: Account suspended
```

#### Logout

```
POST /api/auth/logout
Authorization: Bearer token

Response: 200 OK
{ message: 'Logged out successfully' }
```

#### Verify Email

```
GET /api/auth/verify-email?token=xyz123

Response: 200 OK
{ verified: true, message: 'Email verified' }

Errors:
- 400: Invalid or expired token
```

#### Request Password Reset

```
POST /api/auth/forgot-password
Content-Type: application/json

Request:
{
  email: string
}

Response: 200 OK
{ message: 'Reset email sent' }
```

#### Reset Password

```
POST /api/auth/reset-password
Content-Type: application/json

Request:
{
  token: string,
  newPassword: string
}

Response: 200 OK
{ message: 'Password reset successfully' }

Errors:
- 400: Invalid or expired token
- 400: Password too weak
```

#### Refresh Token

```
POST /api/auth/refresh
Content-Type: application/json

Request:
{
  refreshToken: string
}

Response: 200 OK
{
  token: string,
  refreshToken: string
}

Errors:
- 401: Invalid or expired refresh token
```

---

### Profile Endpoints

#### Get Profile

```
GET /api/auth/profile
Authorization: Bearer token

Response: 200 OK
{ user: User }
```

#### Update Profile

```
PUT /api/auth/profile
Authorization: Bearer token
Content-Type: application/json

Request:
{
  name?: string,
  phone?: string,
  bio?: string,
  dateOfBirth?: date,
  address?: string,
  city?: string,
  country?: string,
  language?: string,
  currency?: string,
  newsletter?: boolean
}

Response: 200 OK
{ user: User }
```

#### Upload Avatar

```
POST /api/auth/avatar
Authorization: Bearer token
Content-Type: multipart/form-data

Request:
{
  avatar: File
}

Response: 200 OK
{
  user: { ...user, avatar: string }
}
```

#### Change Password

```
POST /api/auth/change-password
Authorization: Bearer token
Content-Type: application/json

Request:
{
  currentPassword: string,
  newPassword: string
}

Response: 200 OK
{ message: 'Password changed' }

Errors:
- 401: Current password incorrect
- 400: New password too weak
```

---

## 🔄 Authentication Flows

### Sign Up Flow

```
1. User navigates to /signup
2. Fills form (email, password, name, role)
3. Validates email not exists
4. Validates password strength
5. POST /api/auth/signup
6. Password hashed with bcrypt
7. User created with role and status=ACTIVE
8. Verification email sent
9. JWT token issued
10. AuthContext updated
11. Redirect to email verification or dashboard
```

### Email Verification Flow

```
1. User receives email with verification link
2. Link contains signed JWT token
3. User clicks link → GET /api/auth/verify-email?token=xyz
4. Token verified (signature + expiry)
5. User.emailVerified updated
6. Redirect to confirmed page
7. Full access to platform features
```

### Login Flow

```
1. User navigates to /login
2. Enters email and password
3. POST /api/auth/login
4. Email lookup in database
5. Password compared with bcrypt hash
6. If valid:
   ├─ Generate JWT token (15 min expiry)
   ├─ Generate refresh token (30 day expiry)
   ├─ Update lastLogin timestamp
   ├─ Return tokens to client
   ├─ AuthContext updated
   └─ Redirect to dashboard
7. If invalid:
   └─ Return 401 error
```

### Password Reset Flow

```
1. User clicks "Forgot Password"
2. Enters email address
3. POST /api/auth/forgot-password
4. If email exists:
   ├─ Generate reset token (1 hour expiry)
   ├─ Send email with reset link
   └─ Show "Check your email" message
5. User clicks email link
6. Enter new password
7. POST /api/auth/reset-password
8. Verify token
9. Hash new password
10. Update user.password
11. Invalidate all existing tokens
12. Redirect to login
```

### Role-Based Access

```
POST /api/auth/signup with role='HOST'
1. Create user with role=HOST
2. Create associated Host profile
3. User directed to KYC verification
4. Cannot list properties until KYC approved

User can later become Host via profile settings
1. POST /api/auth/upgrade-to-host
2. Create Host profile
3. Trigger KYC verification flow
```

---

## 🔐 Security Measures

### Password Security

```
Requirements:
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

Hashing: bcrypt with 10 salt rounds
Storage: Hashed password never plain text
Comparison: Constant-time comparison
```

### Token Security

```
JWT Token:
- Algorithm: HS256
- Expiry: 15 minutes
- Payload: { userId, email, role }
- Signature: NEXTAUTH_SECRET

Refresh Token:
- Expiry: 30 days
- Stored: httpOnly cookie (secure)
- Rotation: Issue new token on refresh
```

### API Security

```
Rate Limiting:
- Login: 5 attempts per 15 minutes per IP
- Signup: 3 attempts per hour per IP
- Password reset: 2 attempts per 24 hours per email

CORS: Domain whitelist
HTTPS: Required for production
CSP: Content Security Policy headers
```

---

## 📱 Auth Context (React)

### AuthContext Structure

```typescript
interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  role: UserRole | null

  // Methods
  login: (email, password) => Promise<void>
  signup: (data) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data) => Promise<void>
  isHost: () => boolean
  isAdmin: () => boolean
}

// Usage in components
const { user, isLoggedIn, role, login, logout } = useAuth()

// Protected route wrapper
<ProtectedRoute requiredRole="HOST">
  <HostDashboard />
</ProtectedRoute>
```

---

## 🎯 Features

### Account Linking

- Email verified badge on profile
- Connect multiple login methods (future: OAuth)
- Device management (active sessions)

### Notifications

- Login notifications (new device)
- Password change confirmation
- Suspicious activity alerts

### Privacy

- Profile visibility settings (public/private)
- Block users
- Privacy policy acceptance

---

## 📊 User Statistics

### Dashboard Metrics (Admin)

- Total users
- New signups per day
- Active users
- Suspended accounts
- Role distribution (User vs Host)

---

## ✅ Testing Checklist

- [ ] Sign up with valid/invalid emails
- [ ] Password strength validation
- [ ] Email verification workflow
- [ ] Login with correct/incorrect credentials
- [ ] Forgot password flow
- [ ] Token refresh works
- [ ] Protected routes redirect without auth
- [ ] Profile update works
- [ ] Avatar upload to Cloudinary
- [ ] Logout clears session
- [ ] Role-based access control works
- [ ] Rate limiting prevents brute force
- [ ] HTTPS enforced
- [ ] Secure cookies set correctly

---

**Last Updated:** May 16, 2026  
**Status:** Complete  
**Maintained By:** Development Team
