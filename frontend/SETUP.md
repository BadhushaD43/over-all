# Frontend Setup Complete

## Structure Created:
- ✅ Home Page (Navbar, Hero, 7 Language Movie Sliders, Footer)
- ✅ User Dashboard (Sidebar with Profile, Watchlist, Preferred Language Movies)
- ✅ Admin Dashboard (Stats, Support Messages, Admin Profile)
- ✅ Login Page
- ✅ All Components (Navbar, MovieCard, MovieSlider, Footer, Sidebar, UserProfile, AdminStats)
- ✅ Dark Mode Support
- ✅ 24x7 Chat & Dubbing Request in Footer
- ✅ Responsive Design

## Install Dependencies:
```bash
cd frontend
npm install
```

## Run Frontend:
```bash
npm run dev
```

## Features:
1. **Home Page:**
   - Search box in navbar
   - Trending & Upcoming buttons
   - Hero section with image
   - 7 language movie sections (English, Spanish, French, German, Japanese, Chinese, Tamil)
   - Arrow buttons to slide through movies
   - Footer with 24x7 chat and dubbing request

2. **User Dashboard:**
   - Left sidebar with user profile
   - Profile icon, name, email, phone, language, region
   - Edit profile functionality
   - Change password option
   - Dark mode toggle
   - Watchlist section (responsive grid)
   - Preferred language movies shown first
   - 5 other language sections

3. **Admin Dashboard:**
   - Admin profile in sidebar
   - Admin name, email, phone
   - Change password (new + confirm)
   - User statistics
   - Support request count
   - 24x7 chat responses
   - Recent support messages

## Default Login:
- Admin: admin@ottstream.com / Admin@123
- User: Create via signup or use existing user

## API Endpoints Used:
- /api/auth/login
- /api/movies/trending-by-language
- /api/users/me
- /api/watchlist
- /api/support
- /api/admin/stats
- /api/admin/support
