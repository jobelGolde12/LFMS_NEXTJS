You are a senior full-stack software engineer and system architect. Your task is to build a modern, scalable, and production-quality Lost and Found Management System inside my existing Next.js project.

The project already has a fresh Next.js installation, and Tailwind CSS is already installed. You must implement the entire system within this project while following clean architecture, maintainable code practices, and professional UI/UX design.

The system concept comes from a campus lost-and-found platform where users can report lost items, report found items, and the system automatically suggests possible matches using rule-based similarity matching.

1. Technology Stack Requirements

Use the following technologies:

Frontend:

Next.js (App Router)

React

Tailwind CSS

Typescript

Modern component-based architecture

Backend:

Next.js API Routes or Server Actions

Typescript

Clean service layer architecture

Database:

Turso (libSQL / SQLite compatible)

Use .env for Turso credentials

Implement proper relational database schema

Other Requirements:

Use modern ES standards

Use reusable components

Use proper folder structure

Write readable and maintainable code

Avoid messy or duplicated logic

2. Project Structure Requirements

Create a clean and scalable folder structure.

Example structure:

/app
   /(auth)
       login
       register

   /(dashboard)
       dashboard
       lost-items
       found-items
       report-lost
       report-found
       matches
       profile

/api
   auth
   items
   matches
   claims

/components
   ui
   layout
   items
   dashboard
   forms

/lib
   db
   services
   utils
   matching-engine

/types

/database
   schema.sql
   seed.sql

/public
   uploads

/docs
   system_architecture.md
   database_design.md
   matching_algorithm.md
3. User Roles

There are two roles in the system:

1. Normal Users

Students, staff, or teachers who can:

Register

Login

Report lost items

Report found items

Search items

View matches

Claim items

2. Admin

Admins can:

Manage users

Manage reports

Verify item claims

Approve or reject matches

View dashboard statistics

4. Core Features

Implement the following core features.

Authentication System

Users must be able to:

Register

Login

Logout

Secure password hashing

Session management

User data stored in Turso.

User fields:

users
id
name
email
password
role
created_at

Use proper validation.

Report Lost Item

Users can report lost items by filling a form.

Fields:

Item name

Category

Color

Brand

Description

Location lost

Date lost

Upload image

Save the item as status = lost.

Report Found Item

Same structure as lost item but:

status = found

Item Browsing

Users must be able to:

View all lost items

View all found items

Search items

Filter by category

Filter by location

Filter by date

Display items as modern responsive cards.

Item Claim System

When a user finds their item:

They can click Claim Item.

Claim process:

User -> Claim Request
Admin -> Verify claim
Admin -> Approve or reject

Claim table:

item_claims
id
item_id
user_id
status
created_at
Automatic Matching System

Implement a Rule-Based Matching Engine.

This system automatically compares lost and found reports.

Attributes used for matching:

Item type

Color

Brand

Location

Date

Use a weighted scoring system.

Example scoring:

Item Type match = +40
Location match = +30
Color similar = +15
Brand match = +10
Date within 7 days = +5

Total score = 100.

If score > 60 → Suggest match.

Store matches in:

item_matches
id
lost_item_id
found_item_id
score
status
created_at

Possible status:

suggested
confirmed
rejected
Dashboard

Create a modern analytics dashboard.

Admin dashboard must show:

Total users

Total lost items

Total found items

Total matched items

Recent reports

Use clean card layout with Tailwind.

UI / UX Design Requirements

Design must be modern and minimalistic.

Style inspiration:

modern SaaS dashboards

glassmorphism

soft shadows

smooth animations

Use Tailwind utilities like:

rounded-xl
shadow-lg
hover:shadow-xl
transition
grid layouts

Make the UI:

responsive

mobile friendly

accessible

Components

Create reusable components such as:

Navbar
Sidebar
ItemCard
ItemForm
SearchBar
DashboardCard
MatchCard
UserMenu

All UI should be reusable and modular.

File Upload System

Users must be able to upload images of items.

Requirements:

Save images in /public/uploads

Store file path in database

Database Design

Design a clean relational schema.

Tables required:

users
items
item_matches
item_claims
notifications

Items table:

items
id
user_id
title
category
color
brand
description
location
status (lost/found)
date_reported
image_url
created_at

Add indexes for:

location

category

status

API Layer

Create clean API routes.

Examples:

POST /api/auth/register
POST /api/auth/login

POST /api/items/report-lost
POST /api/items/report-found

GET /api/items/lost
GET /api/items/found

POST /api/matches/run

POST /api/claims/request
POST /api/claims/verify

Use proper error handling.

Matching Engine Logic

Create a dedicated module:

/lib/matching-engine

The engine must:

Compare lost items with found items

Compute similarity score

Save matches in database

Return sorted matches

Pseudo logic:

for each lost_item
    for each found_item
        score = 0

        if type same → +40
        if location same → +30
        if color similar → +15
        if brand same → +10
        if date difference <= 7 days → +5

        if score >= 60
            store match
Performance Optimization

Ensure:

Efficient database queries

Use indexing

Avoid unnecessary re-renders

Use server components when possible

Documentation

Generate the following documentation files:

docs/
system_architecture.md
database_design.md
matching_algorithm.md
api_documentation.md
project_setup.md

Each file must explain:

system architecture

database schema

matching logic

how to run project

environment setup

Environment Variables

Use .env for Turso connection.

Example:

TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

Use them inside /lib/db.

Code Quality Rules

Follow these rules strictly:

No duplicated logic

Use Typescript types

Use services layer

Use clean component structure

Use meaningful variable names

Add comments where needed

Ensure:

No runtime errors

No broken UI

No console errors

Final Goal

Deliver a complete professional Lost and Found system that includes:

modern UI

scalable architecture

rule-based item matching

clean database logic

reusable components

proper API structure

Turso database integration

high-quality maintainable code

The project must feel like a real production-grade campus system, not a simple demo.