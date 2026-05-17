# Route: /profile

- Source file: app/profile/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 2
- State variables detected: 22

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- Personal Information
- Emergency Contact
- Social Links
- Activity
- User ID
- Change Password
- Connected Accounts
- Travel Documents
- Sessions
- Travel Preferences
- Language & Region
- Appearance
- Payment Methods
- Email Notifications
- Push Notifications
- SMS Notifications
- Profile Visibility
- Information Visibility
- Two-Factor Authentication
- Download Data
- Deactivate Account
- Delete Account
- Logout
- Saved Toast
- Sidebar
- Mobile Tab Selector
- Verified Badge (sidebar)
- User ID (sidebar)
- Main Content

### User-visible headings detected
- Loading your profile
- Sign in to view your profile
- Profile
- {profile.name}
- My Bookings
- {completionPercent}% complete
- No bookings yet
- {booking.Hotel?.title ?? 'Hotel'}

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => { setActiveTab('profile'); setIsEditMode(true); setEditedProfile(profile)
- () => { setActiveTab(tab.key); setMobileMenuOpen(false)
- () => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); showSavedToast()
- () => { setIsEditMode(false); setEditedProfile(profile)
- () => { setShowDeleteConfirm(false); setDeleteConfirmText('')
- () => {
                  setIsEditMode(!isEditMode)
                  setEditedProfile(profile)
- () => handleCancel(booking.id)
- () => setDarkMode(!darkMode)
- () => setMobileMenuOpen(!mobileMenuOpen)
- () => setNotifications({ ...notifications, [item.key]: !notifications[item.key]
- () => setPrivacy({ ...privacy, [item.key]: !privacy[item.key]
- () => setPrivacy({ ...privacy, loginAlerts: !privacy.loginAlerts
- () => setPrivacy({ ...privacy, profileVisibility: vis
- () => setPrivacy({ ...privacy, twoFactorEnabled: !privacy.twoFactorEnabled
- () => setShowDeleteConfirm(true)
- () => setShowPassword(!showPassword)
- e => { const u = { ...userProfile, dietaryPreferences: e.target.value
- e => { const u = { ...userProfile, preferredCurrency: e.target.value
- e => { const u = { ...userProfile, preferredLanguage: e.target.value
- e => { const u = { ...userProfile, travelStyle: e.target.value
- e => setConfirmPassword(e.target.value)
- e => setCurrentPassword(e.target.value)
- e => setDeleteConfirmText(e.target.value)
- e => setEditedProfile({ ...editedProfile, [field.key]: e.target.value
- e => setEditedProfile({ ...editedProfile, address: e.target.value
- e => setEditedProfile({ ...editedProfile, bio: e.target.value
- e => setEditedProfile({ ...editedProfile, emergencyContactName: e.target.value
- e => setEditedProfile({ ...editedProfile, emergencyContactPhone: e.target.value
- e => setEditedProfile({ ...editedProfile, gender: e.target.value
- e => setNewPassword(e.target.value)
- handleCopyId
- handleSaveNotifications
- handleSavePrivacy
- handleSaveProfile
- item.label === 'Active Bookings' ? (e) => { e.preventDefault(); setActiveTab('bookings')

## State Management
- activeTab
- bookingsError
- bookingsLoading
- cancellingId
- confirmPassword
- currentPassword
- darkMode
- deleteConfirmText
- editedProfile
- isEditMode
- isMounted
- isSaving
- mobileMenuOpen
- newPassword
- notifications
- privacy
- savedToast
- showCopied
- showDeleteConfirm
- showPassword
- userBookings
- userProfile
- Side effects: 2 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- PATCH /auth/me

## Internal Dependencies
- @/components/layout/Footer/Footer
- @/components/layout/Header/Header
- @/components/ui/Button
- @/components/ui/Card
- @/components/ui/SectionCard
- @/components/ui/ToggleSwitch
- @/contexts/AuthContext
- @/lib/axios
- @/lib/booking

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.