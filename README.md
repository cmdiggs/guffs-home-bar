# Guffs Web App

A mobile-first web app for Guffs home bar: cocktails, guest photo uploads, and sports memorabilia, with an admin panel to manage content.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   ```bash
   ADMIN_PASSWORD=your-secret-password
   ```

   Optional: `DATABASE_PATH`, `UPLOADS_PATH` (see `.env.example`).

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (sign in with `ADMIN_PASSWORD`).

## Features

- **Public site**: Header with logo, Guffs’ Cocktails (cards + detail modal), Share your moment (photo upload), Sports memorabilia section. Logo loading animation on first load.
- **Admin** (`/admin`): Add/edit/delete cocktails and memorabilia, view and download guest photo submissions. Password-protected; log out from the admin nav.

## Tech

- Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- SQLite (better-sqlite3) for data; local file storage under `public/uploads/`
