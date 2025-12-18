# Provenance Tracker – Project Documentation

Location: repository root

## Stack
- Framework: Next.js 16 (App Router), TypeScript
- Auth: NextAuth (credentials + Google), session-based client hooks
- UI: Tailwind CSS v4, shadcn-inspired primitives, motion/react for animation, radix-ui primitives
- State: React hooks
- Notifications: sonner
- QR/Scanning: qrcode.react and html5-qrcode

## Scripts
- `npm run dev`: start Next.js dev server
- `npm run build`: production build
- `npm run start`: run built app
- `npm run lint`: ESLint (Next config)

## Environment
Configure `.env.local` with (example):
```
NEXT_PUBLIC_DOTNET_API_URL=http://localhost:5199
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```
Adjust API URLs for non-local deployments.

## App structure (App Router)
- [app/page.tsx](app/page.tsx): Landing/search. Fetches transactions by productId, shows carousel input and changelog.
- [app/login/page.tsx](app/login/page.tsx): Login page; uses `LoginForm`.
- [app/login/loading.tsx](app/login/loading.tsx): Loading skeleton for login.
- [app/admin/page.tsx](app/admin/page.tsx): Admin dashboard wrapper.
- [app/transactions/page.tsx](app/transactions/page.tsx): Participant transactions view.
- [app/create-transaction/page.tsx](app/create-transaction/page.tsx): Form to create a transaction (participant gated).
- [app/api/[id]/page.tsx](app/api/%5Bid%5D/page.tsx): Redirect helper that reroutes dynamic IDs to main page.
- [app/api/auth/[...nextauth]/route.ts](app/api/auth/%5B...nextauth%5D/route.ts): NextAuth configuration (credentials + Google) with JWT/session mapping to backend user fields.
- [app/loading.tsx](app/loading.tsx): Global suspense fallback.
- [app/layout.tsx](app/layout.tsx): Root layout, providers, global styles.
- [app/globals.css](app/globals.css): Tailwind theme tokens and base styles.

## Key components
- Auth
  - [components/login-form.tsx](components/login-form.tsx): Credential + Google login, pre-registers via backend `POST /api/auth/register` then signs in.
  - [components/LogoutButton.tsx](components/LogoutButton.tsx): Sign-out helper.
  - [components/Providers.tsx](components/Providers.tsx): Wraps theme and NextAuth providers.
- Participant
  - [components/participant/transaction-form.tsx](components/participant/transaction-form.tsx): Create transaction; gates by role; supports first transaction and productId input.
  - [components/participant/transactions-table.tsx](components/participant/transactions-table.tsx): Table display of participant transactions.
  - [components/participant/Switch.tsx](components/participant/Switch.tsx): Controlled switch for first-transaction toggle.
- Admin
  - [components/admmin/pending-users-table.tsx](components/admmin/pending-users-table.tsx): Lists pending users; confirm action.
  - [components/admmin/pending-transactions-table.tsx](components/admmin/pending-transactions-table.tsx): Lists pending transactions; confirm/cancel actions.
  - [components/admmin/confirm-alert.tsx](components/admmin/confirm-alert.tsx) / [components/admmin/cancel-alert.tsx](components/admmin/cancel-alert.tsx): Reusable confirmation dialogs.
  - [components/admmin/table-tabs.tsx](components/admmin/table-tabs.tsx): Switch between admin tables.
- Shared UI primitives (shadcn-style)
  - [components/ui/*](components/ui): Buttons, cards, dialogs, dropdowns, tables, tabs, switch, textarea, etc.; plus animated inputs (`placeholders-and-vanish-input`), floating dock, file upload with QR scan.
- Feature widgets
  - [components/provenance-carousel.tsx](components/provenance-carousel.tsx): Entry carousel for product search.
  - [components/ChangeLogProduct.tsx](components/ChangeLogProduct.tsx): Timeline/changelog renderer for transactions.
  - [components/popup-details.tsx](components/popup-details.tsx): Detail modal for transactions/products.
  - [components/QRCodeGenerator.tsx](components/QRCodeGenerator.tsx): Generates and downloads QR codes for a product ID.
  - [components/ui/file-upload.tsx](components/ui/file-upload.tsx): File drop/QR scanner leveraging html5-qrcode.
  - [components/ui/floating-dock.tsx](components/ui/floating-dock.tsx): Animated icon dock.

## Auth flow
1. **Registration + credential sign-in:** `LoginForm` posts `email/password` to backend `/api/auth/register`; on success calls `signIn("credentials")` (NextAuth credentials provider) then routes to `/`.
2. **OAuth:** `signIn("google")` delegated to NextAuth; JWT callback exchanges OAuth profile with backend `/api/auth/external-login` to create/return roles/token.
3. **Session mapping:** JWT callback stores `userId`, `roles`, `backendToken`, `isApproved`, `email`, `name`; session callback exposes them on `session.user`.
4. **Access control:** Components (e.g., create transaction) check `session.user.roles` for `Participant`; admin tables use `backendToken` for authorized fetches.

## User flows
- **Participant story (happy path):**
  1) Navigates to [app/login/page.tsx](app/login/page.tsx) and signs up/in via [components/login-form.tsx](components/login-form.tsx) (credentials or Google).
  2) If approved as `Participant`, opens [app/create-transaction/page.tsx](app/create-transaction/page.tsx) to submit a new product transaction using [components/participant/transaction-form.tsx](components/participant/transaction-form.tsx); first-time creation can auto-generate a productId.
  3) Reviews own transactions in [app/transactions/page.tsx](app/transactions/page.tsx) rendered by [components/participant/transactions-table.tsx](components/participant/transactions-table.tsx).
  4) Anyone can look up provenance by productId on [app/page.tsx](app/page.tsx); uses [components/provenance-carousel.tsx](components/provenance-carousel.tsx) for input and [components/ChangeLogProduct.tsx](components/ChangeLogProduct.tsx) to display the chain.

- **Admin story (approval path):**
  1) Signs in via [app/login/page.tsx](app/login/page.tsx) using admin credentials.
  2) Opens [app/admin/page.tsx](app/admin/page.tsx) and toggles between tabs from [components/admmin/table-tabs.tsx](components/admmin/table-tabs.tsx).
  3) In [components/admmin/pending-users-table.tsx](components/admmin/pending-users-table.tsx), approves pending users (grants Participant access).
  4) In [components/admmin/pending-transactions-table.tsx](components/admmin/pending-transactions-table.tsx), confirms or cancels pending transactions via the confirm/cancel alerts.
  5) Validated data then becomes visible to participants and public product lookups on [app/page.tsx](app/page.tsx).

## Backend touchpoints (hard-coded in UI)
- `POST /api/auth/register`
- `POST /api/auth/login` (NextAuth credentials authorize)
- `POST /api/auth/external-login` (OAuth mapping)
- `GET /api/transaction/{productId}`
- `POST /api/participant` (create transaction)
- `GET /api/participant` (list participant transactions)
- Admin: `GET /api/admin/pending-users`, `POST /api/admin/confirm-user/{email}`, `GET /api/admin/pending-transactions`, `POST /api/admin/confirm-transaction/{id}`, `POST /api/admin/cancel-transaction/{id}`
- Participant approval: `POST /api/user/participant-approve`
Adjust base URL via `NEXT_PUBLIC_DOTNET_API_URL` and use relative paths where possible for deployment safety.

## Styling & theming
- Tailwind v4 with custom CSS variables in `app/globals.css`.
- `theme-provider.tsx` integrates `next-themes` for light/dark.
- Components use `cn` helper for class merging.

## Data display
- Tables use `@tanstack/react-table` with sorting/filtering and radix dropdown actions.
- Carousel/input widgets use motion/react for animation.
- Toasts via `sonner` for success/error feedback.

## Adding features: checklist
- Add API calls via `fetch` using `NEXT_PUBLIC_DOTNET_API_URL` base.
- Gate pages/components by `session.user.roles` as needed; rely on `backendToken` for auth headers.
- Keep UI in `components/ui/*` for primitives; compose feature components under `components/*`.
- Update documentation if adding routes: list in this file under App structure & Backend touchpoints.

## Running locally
```
pm install
npm run dev
```
Visit http://localhost:3000. Ensure backend is running at the configured `NEXT_PUBLIC_DOTNET_API_URL`.

## Deployment notes
- For production, set `NEXTAUTH_URL` to deployed origin and provide OAuth credentials matching that origin.
- Replace hard-coded localhost URLs in components with relative paths or environment-based helpers before deploying.
- Run `npm run build` to verify bundle.
