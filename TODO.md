You are a senior backend engineer and system security architect.

Your task is to implement a secure Role-Based Access Control (RBAC) system in my Next.js Lost and Found Management System.

The project already uses:

Next.js (App Router)

Tailwind CSS

TypeScript

Turso database (libSQL)

Authentication system (login/register)

Your goal is to ensure that system features are accessible only to authorized users based on their role.

The RBAC implementation must be secure, scalable, and cleanly structured.

Main Objective

Implement a role-based authorization system that:

restricts access to protected pages

protects API routes

controls dashboard features

separates admin and user capabilities

prevents unauthorized actions

User Roles

The system must support two roles:

admin
user

These roles determine what features the user can access.

Role Description
1. User Role

The user role represents:

students

faculty

staff members

Users can interact with the lost-and-found system but cannot manage system administration tasks.

User Permissions

Users are allowed to:

register an account

login/logout

view the welcome page

access their dashboard

report lost items

report found items

browse lost items

browse found items

view possible matches

submit item claim requests

view their claim status

edit their profile

Users are NOT allowed to:

delete other users

approve or reject claims

delete reports from other users

access admin dashboard

manage system records

2. Admin Role

The admin role is for system administrators.

Admins have full control over the system.

Admin Permissions

Admins can:

access admin dashboard

view system analytics

view all users

manage users

manage lost item reports

manage found item reports

delete or edit reports

verify item claims

approve claim requests

reject claim requests

view match results

manually confirm matches

remove invalid matches

Admins can also access everything that users can access.

Database Implementation

The users table must include a role field.

Example schema:

users
-----
id
name
email
password
role
created_at

Role values:

admin
user

Default role for new registrations:

user
Authorization Middleware

Implement route protection middleware.

Create middleware that:

Checks if the user is authenticated

Checks the user role

Allows or blocks access accordingly

Example logic:

If not authenticated → redirect to login

If route requires admin
    If user.role !== admin
        deny access

Create middleware inside:

/middleware.ts
Protected Routes

Protect the following routes.

User Protected Routes

Users must be logged in to access:

/dashboard
/dashboard/report-lost
/dashboard/report-found
/dashboard/lost-items
/dashboard/found-items
/dashboard/matches
/dashboard/profile
Admin Protected Routes

Only admins can access:

/dashboard/admin
/dashboard/admin/users
/dashboard/admin/reports
/dashboard/admin/claims
/dashboard/admin/matches

If a normal user tries to access admin routes:

Show:

403 Unauthorized

Or redirect to dashboard.

API Route Protection

Protect backend API routes as well.

Example API restrictions:

User APIs

Accessible by logged-in users:

POST /api/items/report-lost
POST /api/items/report-found
GET /api/items/lost
GET /api/items/found
POST /api/claims/request
Admin APIs

Accessible only by admin:

GET /api/admin/users
DELETE /api/admin/users/:id
GET /api/admin/reports
POST /api/admin/claims/approve
POST /api/admin/claims/reject

Always validate role before executing API logic.

Permission Utility Functions

Create reusable permission utilities.

Example file:

/lib/auth/permissions.ts

Functions:

isAdmin(user)
isUser(user)
requireAdmin()
requireAuth()

Example usage:

if (!isAdmin(user)) {
  throw new Error("Unauthorized access")
}
Frontend Role Control

Control UI elements based on role.

Example:

Hide admin features from users.

Example sidebar logic:

User sidebar:

Dashboard
Report Lost
Report Found
Lost Items
Found Items
Matches
Profile

Admin sidebar:

Dashboard
Report Lost
Report Found
Lost Items
Found Items
Matches
Admin Panel
Users
Claims
Reports
Matches Management
Admin Dashboard

Create an admin dashboard page.

Route:

/dashboard/admin

Admin dashboard should show:

total users

total lost items

total found items

total matches

pending claims

Use dashboard cards.

Example layout:

Total Users
Total Lost Items
Total Found Items
Pending Claims
Seed Admin Account

Seed an initial admin account in the database.

Create a seed script.

Example admin account:

Name: System Administrator
Email: admin@sorsu.edu
Password: admin123
Role: admin

Ensure password is securely hashed.

Admin Credentials Documentation

Create a file:

docs/admin.md

Inside this file, include the admin login credentials.

Example format:

# Admin Login Credentials

Use the following account to access the admin dashboard.

Email: admin@sorsu.edu
Password: admin123

After login, navigate to:

/dashboard/admin

This file helps the developer quickly log in to the admin panel.

Security Best Practices

Ensure the RBAC system follows security best practices:

never trust frontend role validation

always validate role on backend

hash passwords

sanitize inputs

prevent privilege escalation

avoid exposing sensitive data

Code Structure

Organize authorization logic in a clean structure.

Example folders:

/lib/auth
    auth.ts
    permissions.ts
    session.ts

/middleware
    roleMiddleware.ts
Error Handling

Unauthorized access should return:

403 Forbidden

Unauthenticated users should be redirected to:

/login
Documentation

Create a documentation file:

docs/role_based_access.md

Explain:

how RBAC works

role permissions

protected routes

admin capabilities

Final Goal

After implementation, the system must:

restrict access to authorized roles

protect dashboard pages

protect API endpoints

separate user and admin features

provide a secure and scalable RBAC system

The system should follow production-level security standards and feel like a professional enterprise application.

