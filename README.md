# Heritage Explorer - Cultural Tourism Platform

A comprehensive web application for discovering and exploring cultural heritage destinations, stories, events, and virtual tours.

## Features

- 🏛️ **Destinations** - Browse cultural heritage sites with detailed information, images, and maps
- 📖 **Stories** - Read and submit cultural stories from around the world
- 🎉 **Events** - Discover upcoming cultural events and festivals
- 🎯 **Experiences** - Find guided tours, workshops, and cultural activities
- 🎥 **Virtual Tours** - Explore heritage sites through immersive virtual experiences
- 🗺️ **Interactive Maps** - View destinations on Mapbox-powered maps
- 🔐 **Admin Dashboard** - Manage all content with role-based access control
- 🔖 **Bookmarks** - Save your favorite destinations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **Maps**: Mapbox GL JS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation

## Prerequisites

- Node.js 18+ and npm
- A Supabase project (or use Lovable Cloud)
- Mapbox access token (for maps functionality)

## Getting Started

### 4. Database Setup

If setting up manually, run the migrations in `supabase/migrations/` to create:

- `destinations` - Heritage sites and locations
- `stories` - Cultural stories and articles
- `events` - Cultural events and festivals
- `experiences` - Tours and activities
- `virtual_tours` - Virtual tour content
- `profiles` - User profiles
- `bookmarks` - User saved destinations
- `user_roles` - Role-based access control

### 5. Configure Secrets

For edge functions to work, configure the following secrets:

- `MAPBOX_ACCESS_TOKEN` - For map functionality
- `RESEND_API_KEY` - For contact form emails (optional)

### 6. Run Development Server

// npm install

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   ├── cards/          # Reusable card components
│   ├── destination/    # Destination detail components
│   ├── home/           # Homepage sections
│   ├── layout/         # Navbar, Footer
│   ├── search/         # Search functionality
│   ├── stories/        # Story components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
├── pages/              # Route pages
├── types/              # TypeScript types
└── lib/                # Utility functions

supabase/
├── functions/          # Edge functions
│   ├── get-mapbox-token/
│   ├── search-places/
│   └── send-contact-email/
└── migrations/         # Database migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## User Roles

- **User** - Browse content, bookmark destinations, submit stories
- **Editor** - All user permissions + manage content
- **Admin** - Full access including user management

## Deployment

### Via Lovable

Click **Share → Publish** in the Lovable editor.

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Configure environment variables on your host

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.
