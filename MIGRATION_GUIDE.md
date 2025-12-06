# Migration Guide: Supabase to MySQL

This guide explains the changes made to migrate from Supabase to MySQL Workbench.

## What Changed

### Database
- **Before**: Supabase (PostgreSQL) with Row Level Security
- **After**: MySQL Workbench with Express backend API

### Authentication
- **Before**: Supabase Auth
- **After**: Session-based authentication with Express Sessions

### API Layer
- **Before**: Direct Supabase client calls from frontend
- **After**: RESTful API endpoints via Express backend

## File Changes

### New Files
- `server/index.js` - Express backend server
- `server/package.json` - Backend dependencies
- `database/schema.sql` - MySQL database schema
- `database/README.md` - Database documentation
- `src/lib/api.ts` - API client (replaces Supabase client)

### Modified Files
- `src/pages/AdminLogin.tsx` - Uses API instead of Supabase Auth
- `src/pages/AdminDashboard.tsx` - Uses API for bookings
- `src/pages/BookSlot.tsx` - Uses API for booking creation
- `src/pages/MyBookings.tsx` - Uses API for search
- `src/components/Navbar.tsx` - Uses API for session check
- `src/lib/types.ts` - Simplified types (no Supabase types)
- `package.json` - Removed Supabase dependency

### Deleted Files
- `src/lib/supabase.ts` - Replaced by `src/lib/api.ts`
- `scripts/create-admin.js` - Admin user created automatically by backend

## API Endpoints

### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Check session

### Bookings
- `GET /api/bookings` - Get all bookings (admin only)
- `GET /api/bookings/search?phone=...&email=...` - Search bookings
- `POST /api/bookings/check-availability` - Check slot availability
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking (admin only)
- `DELETE /api/bookings/:id` - Delete booking (admin only)

### Payments
- `POST /api/payments` - Create payment record

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=cricket_booking
```

## Setup Steps

1. **Create MySQL database:**
   - Run `database/schema.sql` in MySQL Workbench

2. **Start backend:**
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Start frontend:**
   ```bash
   npm install
   npm run dev
   ```

## Default Admin Credentials

- **Email**: `admin@cricket.com`
- **Password**: `admin123`

The admin user is automatically created by the backend server on first startup.

