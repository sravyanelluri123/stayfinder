# StayFinder
Next.js 14 + TypeScript + Tailwind + Supabase (Postgres, Auth, RLS).

## Setup
1. Create a Supabase project. In the SQL editor run `supabase/schema.sql` (tables, RLS, overlap-prevention exclusion constraint, seed data).
2. `cp .env.example .env.local` and fill in your project URL and anon key (never use the service-role key in client code).
3. `npm install && npm run dev` → http://localhost:3000
4. To make an admin: `update profiles set role='admin' where email='you@example.com';`

## Deploy
Push to GitHub, import in Vercel, add the two env vars.

## Schema
profiles, properties, bookings (GiST exclusion constraint blocks overlapping non-cancelled stays), favorites, reviews.
