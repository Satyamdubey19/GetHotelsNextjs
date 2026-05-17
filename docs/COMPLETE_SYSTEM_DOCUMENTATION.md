# Complete System Documentation

## Scope

This documentation set covers the full GetHotels application from UI pages to backend modules:

- Page-wise documentation for all app routes and layout/error boundaries
- API route documentation for all `app/api/**/route.ts` handlers
- Module documentation for controllers, services, lib, contexts, validators, and components
- Architecture flow mapping from UI to data layer

## Documentation Map

1. `docs/PAGES_DOCUMENTATION_INDEX.md`

- Entry point for all page-wise documentation
- Coverage: 46 app route/layout/error files
- Per-page details include: purpose, UI structure, interactions, state, API integrations, dependencies, responsive notes, validation checklist

2. `docs/pages/*.md`

- One markdown file per page/route
- Naming convention mirrors route path
- Includes route-level implementation breakdown

3. `docs/API_ROUTE_DOCUMENTATION.md`

- API route inventory for all `app/api/**/route.ts`
- Coverage: 51 route handlers
- Includes method mapping and controller/service linkage

4. `docs/MODULE_DOCUMENTATION_DRAFT.md`

- Deep module-level inventory and architecture notes
- Covers: controllers, services, lib, contexts, validators, components
- Includes API route to controller mapping and usage references

## Architecture Summary

The app follows this primary flow:

- UI routes (`app/**/page.tsx`)
- Shared and domain components (`components/**`)
- API endpoints (`app/api/**/route.ts`)
- Controller layer (`controllers/**`)
- Service layer (`services/**`)
- Infrastructure/lib layer (`lib/**`)
- Database + external providers (Prisma, payment, mail, geolocation, sockets)

## Recommended Reading Order

1. `docs/PAGES_DOCUMENTATION_INDEX.md` (product and UI behavior)
2. `docs/API_ROUTE_DOCUMENTATION.md` (endpoint surface)
3. `docs/MODULE_DOCUMENTATION_DRAFT.md` (internal architecture and code ownership)

## Notes

- Documentation is generated from live source code analysis in this workspace.
- Route docs are page-wise and can be expanded further with product-level narratives if needed.
- For future maintenance, regenerate page docs when adding/removing routes.
