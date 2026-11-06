# Task 7 — Admin Management System

**Agent:** Z.ai Code (admin-builder)
**Task ID:** 7
**Date:** 2026-11-06

## Deliverable

A complete, secure, dynamic Admin Management System rendered as a state-toggled view
on the root `/` route of the Next.js 16 portfolio app. No new routes were created.

## Files Created

All under `/home/z/my-project/src/components/admin/` (and one edit to `src/app/page.tsx`):

| File | Purpose |
| --- | --- |
| `src/components/admin/lib.ts` | `fetchJson` helper, admin-side types (`Admin`, `Inquiry`, `SeoSetting`, `DashboardData`, `UploadResponse`), helpers (`slugify`, `formatDate`, `formatDateTime`), constants (`INQUIRY_STATUSES`, `SOLUTION_PROJECT_STATUSES`) |
| `src/components/admin/image-upload.tsx` | `<ImageUpload>` reusable component — posts to `/api/admin/upload`, returns URL via `onChange`, with preview thumbnail, spinner and remove button |
| `src/components/admin/shared.tsx` | Shared UI: `PageHeader`, `ModuleCard`, `EmptyState`, `LoadingState`, `CenteredLoading`, `SaveButton`, `ConfirmDeleteDialog` (AlertDialog wrapper), `FieldRow`, `ScrollArea` (max-h-70vh overflow) |
| `src/components/admin/admin-shell.tsx` | Sidebar + topbar shell. Desktop fixed sidebar (~260px), mobile `Sheet` triggered by top-bar menu button, grouped nav, brand + Admin badge, logout + Back to site at bottom, active row styled with `bg-primary/10 text-primary` |
| `src/components/admin/login.tsx` | Premium dark login card. Email + password fields, posts to `/api/admin/login`, re-fetches `/api/admin/me` on success. Demo credentials hint shown |
| `src/components/admin/admin-view.tsx` | Default export `AdminView`. Manages auth state (`loading` → `authenticated`/`unauthenticated`), routes between login screen and shell + active module |
| `src/components/admin/modules/dashboard.tsx` | 6 stat cards (Total Inquiries, Unread, Projects, Services, Solutions, Testimonials), Recent Inquiries table with inline status change, quick-action buttons |
| `src/components/admin/modules/profile.tsx` | Single-record edit form (name, title, bio, about, approach, values, email, phone, location, photoUrl, available switch, stats) |
| `src/components/admin/modules/skills.tsx` | Table + Add/Edit Dialog + delete confirm. Color picker, visible switch, category, order |
| `src/components/admin/modules/services.tsx` | Table + Dialog with all fields incl. category select, features textarea, content textarea, featured/visible |
| `src/components/admin/modules/solutions.tsx` | Table + Dialog with dynamic **features** list editor (add/remove rows) and **images** list editor (ImageUpload per row + caption). Sends arrays that REPLACE existing nested records on PUT |
| `src/components/admin/modules/projects.tsx` | Table + Dialog with all fields incl. thumbnail (ImageUpload) and dynamic images gallery editor |
| `src/components/admin/modules/categories.tsx` | Table + Dialog (name, slug, type, order) |
| `src/components/admin/modules/testimonials.tsx` | Table + Dialog with rating select 1-5, date input, photoUrl + screenshotUrl via ImageUpload |
| `src/components/admin/modules/socials.tsx` | Table + Dialog (platform, label, url, icon, enabled toggle, order) |
| `src/components/admin/modules/inquiries.tsx` | Status-filterable list, inline status change, detail Dialog with full message + status buttons + delete confirm |
| `src/components/admin/modules/seo.tsx` | Table + Dialog (page, metaTitle, metaDescription, canonicalUrl, ogImageUrl via ImageUpload, robots) |
| `src/components/admin/modules/navigation.tsx` | Table + Dialog (label, href, icon, order, enabled toggle) |
| `src/components/admin/modules/settings.tsx` | Single-record edit form (siteName, logoUrl, faviconUrl, primaryColor picker, contactEmail, whatsappNumber, footerContent) |
| `src/app/page.tsx` | Replaced placeholder. Reads `useAppStore.view`; renders `<AdminView/>` when `view === "admin"`, otherwise a minimal "Open Admin" entry screen. No new routes created. |

## Auth Flow

1. On `AdminView` mount → `GET /api/admin/me`. If `{ admin }` returned → set authenticated;
   on 401 → show login screen.
2. Login → `POST /api/admin/login` with `{ email, password }`; on success re-fetch `/api/admin/me`.
   Errors surfaced via `sonner` toast.
3. Logout button in sidebar footer → `POST /api/admin/logout`, then clears auth state and
   calls `useAppStore.getState().setView("portfolio")`.
4. "Back to site" link in sidebar footer → `setView("portfolio")`.
5. Demo credentials `admin@aryadev.com / admin123` shown as muted hint on login card.

## Theme & UI Compliance

- Premium dark / black + purple theme using existing tokens (`bg-background`, `bg-card`,
  `border-border`, `text-muted-foreground`, `bg-primary`/`text-primary`). No indigo/blue.
- All shadcn/ui primitives reused (Card, Button, Input, Textarea, Label, Switch, Select,
  Table, Dialog, AlertDialog, Badge, Skeleton, Sheet). No recreations.
- Lucide icons only. No emojis.
- Long lists wrapped in `max-h-[70vh] overflow-y-auto` (custom scrollbar globally styled).
- Consistent `p-6` card padding, `gap-4`/`gap-6` spacing, `rounded-xl` cards.
- Mobile sidebar collapses into a `Sheet` triggered from the top bar.

## Lint

`bun run lint` passes with **0 errors and 0 warnings** after cleanup of unused
`eslint-disable` directives (the `@next/next/no-img-element` rule is already disabled
project-wide).

`bunx tsc --noEmit` reports no errors in any `src/` file (only pre-existing issues in
`examples/` and `skills/` folders which are out of scope).

## Notes for Other Agents

- All 13 modules + login + dashboard are functional end-to-end: list → create/edit → delete
  round-trips through the API and refreshes the list. Visible/enabled toggles do optimistic
  updates with rollback on error.
- ImageUpload posts multipart form data to `/api/admin/upload`; the helper `fetchJson`
  auto-detects FormData and avoids setting `Content-Type` so the browser can set the
  boundary.
- Solutions and Projects send `features`/`images` arrays on save, which the API replaces
  wholesale (transaction-based) — see `/api/admin/solutions/[id]` and `/api/admin/projects/[id]`.
- The public portfolio view is intentionally minimal (an "Open Admin" entry screen). The
  portfolio implementation belongs to a separate task; this task only wires the view toggle
  via the Zustand store.
