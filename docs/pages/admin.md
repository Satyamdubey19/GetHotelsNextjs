# Route: /admin

- Source file: app/admin/page.tsx
- Rendering mode: Client Component
- useEffect hooks: 1
- State variables detected: 4

## Purpose
This page is documented from source code structure and in-component logic. It includes UI sections, user actions, data/state flow, and integration points.

## UI Structure
- No explicit JSX section comments detected; page structure inferred via components and headings.

### User-visible headings detected
- {greetingName}, the platform is healthy, but there are a few queues that need your attention.
- Handle the most important queues first
- {formatCurrency(stats.totalRevenue)}
- {workspaceViews.find((view) => view.id === workspaceView)?.label}
- Recent operational events

## Functionalities
- Handles rendering, interactions, and route-specific behaviors defined in this page.
- Event handlers and interactions:
- () => setWorkspaceView(view.id)

## State Management
- loading
- recentActivity
- stats
- workspaceView
- Side effects: 1 useEffect hook(s) used for async loading, subscriptions, or lifecycle logic.

## API / Data Integrations
- No direct HTTP calls detected in this file (data may come via props/child components).

## Internal Dependencies
- @/components/ui/loading-skeletons
- @/components/ui/StatCard
- @/components/ui/StatusBadge
- @/contexts/AuthContext

## UX/Responsive Notes
- Uses Tailwind utility classes; responsive behavior is primarily controlled with sm/md/lg/xl breakpoints in JSX class names.
- Verify at 360px, 768px, 1024px, and 1440px breakpoints for layout integrity, overflow, and interaction accessibility.

## Validation Checklist
- Route renders without runtime errors.
- Primary action buttons and links are clickable.
- Empty/loading/error states are reachable and visually stable.
- No horizontal overflow on mobile.