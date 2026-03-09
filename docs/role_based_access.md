# Role-Based Access Control (RBAC)

This project implements RBAC with two roles:

- `user`
- `admin`

## How RBAC Works

Authorization is enforced in multiple layers:

1. Middleware (`/middleware.ts`)
- Validates signed session cookie.
- Redirects unauthenticated users to `/login` for protected pages.
- Blocks non-admin users from admin pages and admin APIs.

2. Permission utilities (`/lib/auth/permissions.ts`)
- `isAdmin(user)`
- `isUser(user)`
- `requireAuth()`
- `requireAdmin()`

3. API guards
- User APIs require authentication.
- Admin APIs require `admin` role.
- Sensitive operations also validate ownership/admin role at handler level.

## Signed Session Security

Session cookies are HMAC-signed in `/lib/auth/session.ts`.

- Cookie name: `lfms_session`
- Signature: SHA-256 HMAC
- Prevents role tampering / privilege escalation from client-side cookie edits.

## Role Permissions

### User
Can:
- register/login/logout
- access dashboard pages
- report lost/found items
- browse lost/found/matches
- submit claims
- view profile

Cannot:
- access admin dashboard
- manage users
- approve/reject claims
- perform admin-only moderation actions

### Admin
Can do everything users can, plus:
- access `/dashboard/admin` and admin management pages
- access admin APIs
- review users/reports/claims/matches
- approve/reject claims

## Protected Routes

### User Protected
- `/dashboard`
- `/dashboard/report-lost`
- `/dashboard/report-found`
- `/dashboard/lost-items`
- `/dashboard/found-items`
- `/dashboard/matches`
- `/dashboard/profile`

### Admin Protected
- `/dashboard/admin`
- `/dashboard/admin/users`
- `/dashboard/admin/reports`
- `/dashboard/admin/claims`
- `/dashboard/admin/matches`

## Protected APIs

### User APIs
- `POST /api/items/report-lost`
- `POST /api/items/report-found`
- `GET /api/items/lost`
- `GET /api/items/found`
- `POST /api/claims/request`

### Admin APIs
- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`
- `GET /api/admin/reports`
- `POST /api/admin/claims/approve`
- `POST /api/admin/claims/reject`

## Notes

- New registrations default to `role = user`.
- Initial admin account is seeded by `scripts/seed.ts`.
- Frontend role checks are for UX only; backend checks are the source of truth.
