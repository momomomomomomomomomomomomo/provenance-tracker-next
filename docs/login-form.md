# Login Form Component

Location: [components/login-form.tsx](components/login-form.tsx)

## Purpose
A client-side form that signs users into the app via the platform's credential flow and Google OAuth. It also triggers a registration call to the .NET backend before credential sign-in.

## External dependencies
- NextAuth hooks: `useSession`, `signIn`
- Next.js router: `useRouter`
- UI primitives: `Card`, `Field`, `Input`, `Button` (Shadcn-based)
- Notifications: `sonner` `toast`
- Utility: `cn`
- Backend endpoint: `POST http://localhost:5199/api/auth/register`

## Props
| Prop | Type | Description |
| --- | --- | --- |
| `className` | string (optional) | Extra classes applied to the outer container. |
| `...props` | React.ComponentProps<"div"> | Passed through to the root `div`. |

## State
| State | Type | Purpose |
| --- | --- | --- |
| `email` | string | Email input binding. |
| `password` | string | Password input binding. |
| `error` | string | Error message shown below the actions. |
| `isLoading` | boolean | Disables inputs/buttons and updates the primary CTA label. |

## Behavior
- **Redirect authenticated users:** If `useSession().status` is `"authenticated"`, immediately push to `/`.
- **Submit (email/password):**
  1) POST to `http://localhost:5199/api/auth/register` with `{ email, password }`.
  2) On success, call `signIn("credentials", { redirect: false, email, password })`.
  3) If credential sign-in succeeds, show a success toast and navigate to `/`; otherwise show an invalid-password error.
  4) On registration failure, display the backend message or a fallback string.
- **Google login:** Call `signIn("google", { callbackUrl: "/" })`; on immediate error, display toast and inline error and clear `isLoading`.
- **Validation/UX:** Inputs are required; `isLoading` disables inputs and buttons and swaps the primary CTA label to "Logging in...".
- **Error display:** Inline `FieldDescription` in red when `error` is non-empty.

## UI structure
- Wrapper `div` with spacing, containing a `Card`.
- `CardHeader` with title and description.
- `CardContent` with a form and `FieldGroup` containing:
  - Email `Field` with `Input`.
  - Password `Field` with `Input`.
  - Action `Field` with primary (credential) and secondary (Google) buttons, plus error text.

## Integration notes
- Ensure NextAuth is configured with a `credentials` provider and a `google` provider; the credential provider should accept `email` and `password` fields.
- The registration endpoint is hard-coded to `http://localhost:5199/api/auth/register`; adjust for other environments.
- On success, the component always routes to `/`.

## Usage
```tsx
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md py-10">
      <LoginForm />
    </main>
  );
}
```
