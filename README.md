# 📸 Muthee's Family Album

A modern, private family photo album and memories platform — think Google Photos, but intimate and family-focused. Built as a prototype/demo with plans to become a full personal project.

🔗 **Live Demo:** [Coming Soon - Vercel Deployment]

---

## 🎯 Project Vision

Create a digital sanctuary where families can:
- **Preserve memories** — Upload and organize photos/videos by events, dates, and locations
- **Share stories** — Add context, captions, and narratives to captured moments
- **Stay connected** — View upcoming family events and celebrations
- **Relive the past** — "On This Day" memory triggers, just like Google Photos

This is NOT just another photo gallery. It's a **living family archive** that grows with your family.

---

## ✨ Core Features

### Phase 1: Foundation (Current Sprint)
- [ ] **Authentication System**
  - Email/password login
  - OAuth providers (Google, GitHub)
  - Open registration (not limited to family emails for demo purposes)
  - User profiles with avatars

- [ ] **Photo Upload & Storage**
  - Drag-and-drop upload interface
  - Multiple file upload support
  - Automatic EXIF data extraction (date, location, camera info)
  - Image optimization and thumbnail generation
  - Supabase Storage integration

- [ ] **Photo Gallery**
  - Responsive masonry/grid layout
  - Lightbox view for full-size images
  - Filter by date range (timeline)
  - Filter by location
  - Search functionality

### Phase 2: Enhanced Experience
- [ ] **Albums & Organization**
  - Create custom albums
  - Auto-generated albums (by date, location, faces)
  - Tagging system
  - Favorites collection

- [ ] **"On This Day" Memories**
  - Daily memory notifications
  - Historical photo surfacing
  - Memory compilation views

- [ ] **Family Events**
  - Upcoming events calendar
  - Event photo collections
  - RSVP functionality

### Phase 3: Social Features
- [ ] Comments and reactions on photos
- [ ] Family member tagging
- [ ] Shared albums with permissions
- [ ] Activity feed

---

## 🏗️ Project Structure

```
muthee-family-album/
├── public/
│   ├── fonts/                    # Custom typography
│   └── images/                   # Static assets
│
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── (auth)/               # Auth route group
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/          # Protected routes
│   │   │   ├── gallery/          # Photo gallery & filters
│   │   │   ├── upload/           # Photo upload interface
│   │   │   ├── albums/           # Album management
│   │   │   ├── memories/         # On This Day feature
│   │   │   ├── events/           # Family events
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/                  # API routes
│   │   │   ├── auth/
│   │   │   ├── photos/
│   │   │   └── upload/
│   │   │
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── Card.tsx
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   │
│   │   ├── auth/                 # Auth-specific components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthProvider.tsx
│   │   │
│   │   ├── gallery/              # Gallery components
│   │   │   ├── PhotoGrid.tsx
│   │   │   ├── PhotoCard.tsx
│   │   │   ├── Lightbox.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   └── TimelineView.tsx
│   │   │
│   │   └── upload/               # Upload components
│   │       ├── Dropzone.tsx
│   │       ├── UploadPreview.tsx
│   │       └── UploadProgress.tsx
│   │
│   ├── lib/                      # Utilities & configurations
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── middleware.ts     # Auth middleware
│   │   ├── utils.ts              # Helper functions
│   │   └── constants.ts          # App constants
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── usePhotos.ts
│   │   ├── useUpload.ts
│   │   └── useFilters.ts
│   │
│   └── types/                    # TypeScript definitions
│       ├── database.ts           # Supabase generated types
│       ├── photo.ts
│       └── user.ts
│
├── supabase/
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Sample data for development
│
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment (git-ignored)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```



## 🛠️ Tech Stack

| Layer | Technology | Why? |
|-------|------------|------|
| **Framework** | Next.js 14 (App Router) | Server components, API routes, great DX |
| **Language** | TypeScript | Type safety, better tooling |
| **Styling** | Tailwind CSS | Rapid UI development |
| **Database** | Supabase (PostgreSQL) | Powerful queries for filtering by date/location |
| **Auth** | Supabase Auth | Built-in, multiple providers |
| **Storage** | Supabase Storage | Integrated with database, easy setup |
| **Deployment** | Vercel | Seamless Next.js deployment |
| **State** | React hooks + Context | Simple, no extra dependencies |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/muthee-family-album.git
cd muthee-family-album
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from above
3. Create a storage bucket named `photos`
4. Set bucket to private with RLS policies

### 4. Configure environment variables
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |

---

## 🎨 Design Direction

Drawing inspiration from the Atulah Family Album aesthetic:
- **Warm, inviting color palette** — Creams, sage greens, forest tones
- **Elegant typography** — Serif headings, clean sans-serif body
- **Polaroid-style photo cards** — Nostalgic, personal feel
- **Generous whitespace** — Let the photos breathe
- **Subtle animations** — Smooth transitions, floating effects

---

## 📝 Development Roadmap

| Phase | Timeline | Status |
|-------|----------|--------|
| Project Setup & Auth | Week 1 | 🔄 In Progress |
| Photo Upload & Storage | Week 1-2 | ⏳ Pending |
| Gallery & Filtering | Week 2 | ⏳ Pending |
| Albums & Organization | Week 3 | ⏳ Pending |
| "On This Day" Feature | Week 3-4 | ⏳ Pending |
| Events Calendar | Week 4 | ⏳ Pending |
| Polish & Deploy | Week 5 | ⏳ Pending |

---

## 🤝 Contributing

This is a personal project but feedback is welcome! Feel free to:
- Open issues for bugs or feature suggestions
- Submit PRs for improvements
- Share ideas for better family album features

---

## 📄 License

MIT License — feel free to use this as a starting point for your own family album!

---

## 👨‍💻 Author

**Muthee** — Building memories, one upload at a time.

---

*Built with ❤️ and lots of family photos*