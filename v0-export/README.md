# Guffs - Home Bar App

A beautiful, mobile-first web app for your home bar featuring craft cocktails, sports memorabilia, and visitor photo uploads.

## Features

### Public Features
- **Cocktails Menu** - Browse cocktails named after friends with ingredients and descriptions
- **Sports Memorabilia** - View featured sports collectibles and memorabilia
- **Photo Upload** - Visitors can upload photos from the bar
- **Visitor Gallery** - See photos from all bar visitors

### Admin Features (Protected)
- **Manage Cocktails** - Add, edit, and delete cocktails with image uploads
- **Manage Memorabilia** - Add, edit, and delete sports memorabilia items
- **Manage Photos** - Review and delete visitor photos

## Getting Started

### 1. Database Setup
The database tables have already been created via Supabase migration. The following tables exist:
- `cocktails` - Stores cocktail information
- `memorabilia` - Stores sports memorabilia details
- `visitor_photos` - Stores uploaded visitor photos

### 2. Storage Setup
Create a Supabase Storage bucket for images:

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create a new public bucket named `photos`
4. Set the bucket to public access

### 3. Create Admin User
To access the admin panel at `/admin`, you need to create a user:

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" and create an account with email/password
4. Use these credentials to log in at `/auth/login`

### 4. Access Admin Panel
After logging in, navigate to `/admin` to manage:
- Cocktails
- Memorabilia
- Visitor photos

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Fonts**: Inter (body) + Playfair Display (headings)

## Design

The app features a warm, sophisticated design inspired by premium recipe apps:
- Warm neutral color palette with amber accents
- Clean, Mela-inspired interface
- Smooth animations including logo fade-in on load
- Mobile-first responsive design
- Card-based layouts for easy browsing

## Routes

- `/` - Main public page
- `/auth/login` - Admin login
- `/admin` - Admin dashboard (protected)

## Environment Variables

All Supabase environment variables are automatically configured by the v0 integration.
