You are a senior full-stack developer and UI/UX designer. Your task is to implement dashboard pages for a Lost and Found Management System inside my existing Next.js project.

The project already has:

Next.js (App Router)

Tailwind CSS installed

Turso database connection

Authentication system (users must be logged in)

You must implement the following dashboard pages:

Report Lost
Report Found
Lost Items
Found Items
Matches

The goal is to create modern, responsive, professional pages with clean architecture, reusable components, and excellent user experience.

General Requirements

Follow these rules strictly:

Use Modern UI Design

Use Tailwind CSS to create a modern dashboard design.

Use utilities such as:

rounded-xl
shadow-md
hover:shadow-lg
transition
bg-white
border
grid
flex

Design should look like a modern SaaS dashboard.

Responsive Layout

All pages must be fully responsive.

Support:

mobile
tablet
laptop
desktop

Use Tailwind breakpoints:

sm:
md:
lg:
xl:
Dashboard Layout

All pages must use the same dashboard layout.

Structure:

Sidebar
Top Navbar
Main Content

Sidebar menu:

Dashboard
Report Lost
Report Found
Lost Items
Found Items
Matches
Profile
Logout

Sidebar should be:

collapsible on mobile

fixed on desktop

Page 1: Report Lost Item

Route example:

/dashboard/report-lost

Purpose:

Allow users to report a lost item.

Page Layout

Sections:

1️⃣ Page Header

Title:

Report Lost Item

Subtitle:

Provide detailed information about the item you lost so the system can help find possible matches.

2️⃣ Lost Item Form

Create a modern form card.

Fields:

Item Name
Category
Color
Brand
Description
Location Lost
Date Lost
Upload Image

Example categories:

Phone
Wallet
Bag
ID
Electronics
Accessories
Other
Form Design

Use a clean form layout.

Example:

grid grid-cols-1 md:grid-cols-2 gap-6

Form inputs must include:

labels

placeholders

validation messages

Image Upload

Allow users to upload an image.

Requirements:

preview image

save image path in database

show upload progress

Submit Button

Button text:

Submit Lost Item Report

When submitted:

store item in database

status = lost

show success notification

Page 2: Report Found Item

Route:

/dashboard/report-found

Purpose:

Allow users to report a found item.

Page Layout

Header:

Report Found Item

Subtitle:

If you found an item on campus, report it here so the rightful owner can locate it.
Form Fields

Same structure as lost item form.

Fields:

Item Name
Category
Color
Brand
Description
Location Found
Date Found
Upload Image

Database status:

found
UX Improvement

After submission:

Display message:

Thank you for reporting the found item. The system will automatically check for possible matches.
Page 3: Lost Items Page

Route:

/dashboard/lost-items

Purpose:

Allow users to browse all reported lost items.

Page Layout

Header:

Lost Items

Subtitle:

Browse all items reported as lost within the campus.
Search and Filters

Add search bar.

Search fields:

Item name
Category
Location

Filters:

Category
Date
Color
Items Display

Display items using modern cards.

Card contents:

Item Image
Item Name
Category
Location Lost
Date Lost
Reported By

Buttons:

View Details
Grid Layout

Example layout:

grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6

Cards should include:

rounded-xl
shadow
hover:shadow-lg
transition
Page 4: Found Items Page

Route:

/dashboard/found-items

Purpose:

Allow users to browse items reported as found.

Header
Found Items

Subtitle:

Check items that have been found around the campus.
Item Cards

Each card must show:

Item Image
Item Name
Category
Location Found
Date Found
Reported By

Buttons:

View Details
Claim Item
Claim Button Logic

If a user believes the item belongs to them:

Click:

Claim Item

This creates a claim request.

Database entry:

item_claims
Page 5: Matches Page

Route:

/dashboard/matches

Purpose:

Display automatically detected matches between lost and found items.

Header
Possible Matches

Subtitle:

These items may match based on the system's similarity detection.
Match Card Design

Each match card should display two items side by side.

Left:

Lost item

Right:

Found item

Card Layout

Example structure:

Lost Item Card | Match Score | Found Item Card
Display Information

Lost Item:

Image
Name
Category
Location Lost
Date Lost

Found Item:

Image
Name
Category
Location Found
Date Found

Match Score:

85% Match
Match Explanation

Show why the system matched them.

Example:

Matching attributes:
✔ Same item type
✔ Similar color
✔ Same location
✔ Close reporting date
Action Buttons

Buttons:

View Lost Item
View Found Item
Submit Claim
Matching Logic

Matches should be generated using the rule-based scoring system.

Attributes used:

Item Type
Color
Brand
Location
Date

Example scoring:

Item type match = +40
Location match = +30
Color similarity = +15
Brand match = +10
Date within 7 days = +5

If score ≥ 60 → create match.

Store in database:

item_matches
Reusable Components

Create reusable components such as:

ItemCard
MatchCard
ItemForm
ImageUploader
SearchBar
FilterDropdown
DashboardHeader

Place inside:

/components
UI Enhancements

Add subtle animations:

hover:scale-105
transition
duration-200

Add loading skeletons while fetching data.

Use empty state UI when no items exist.

Example message:

No items reported yet.
Code Quality

Ensure:

clean code

reusable components

proper TypeScript types

no duplicated logic

proper error handling

Final Goal

The dashboard pages must feel like a professional modern web application used by a university.

The UI must be:

modern

responsive

user-friendly

scalable

production quality

The system should help users easily report items, browse items, and discover matches quickly.

