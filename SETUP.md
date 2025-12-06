# Cricket Ground Booking System - Setup Guide

A complete cricket ground slot-booking system with React, MySQL, Express, and Razorpay integration.

## 🔐 Default Admin Credentials

**Quick Login:**
- **Email:** `admin@cricket.com`
- **Password:** `admin123`

> ⚠️ **Note:** The default admin user is created automatically when you run the database schema. After first login, change the password for security.

## Features

### User Features (No Login Required)
- Browse and book cricket ground slots
- View available time slots
- Select ground size (Full/Half)
- Choose night mode lighting
- Secure payment via Razorpay
- View booking history by phone/email
- Real-time slot availability checking
- No double-booking allowed

### Admin Features (Login Required)
- View all bookings with statistics
- Edit booking status and payment status
- Delete bookings
- Export bookings to Excel/CSV
- Dashboard with revenue tracking
- Real-time booking management

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (MongoDB Atlas)
- **Authentication**: Session-based (Express Sessions)
- **Payment**: Razorpay
- **Routing**: React Router
- **Icons**: Lucide React

## Database Schema

### Bookings Table
- User information (name, phone, email)
- Booking details (date, time, duration)
- Ground configuration (size, night mode)
- Status tracking (pending, confirmed, cancelled)
- Payment status (pending, completed, failed)

### Payments Table
- Razorpay transaction details
- Payment verification data
- Linked to bookings

## Setup Instructions

### 1. Database Setup (MongoDB)

1. **MongoDB Atlas Setup:**
   - Collections are created automatically when first document is inserted
   - No manual setup required - the server will create collections on first use
   - Default admin user will be created automatically on server startup

2. **MongoDB Connection String:**
   - Your MongoDB connection string is already configured
   - It will be stored in `server/.env` file
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/`

3. **Verify the database:**
   - Collections will be created automatically
   - Check MongoDB Atlas dashboard to see collections after first use
   - Collections: `admin_users`, `bookings`, `payments`

### 2. Backend Server Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `server/.env.example` to `server/.env`
   - Update MongoDB connection string:
     ```env
     MONGODB_URI=mongodb+srv://dhvani:dhvani@admin.e61e8mi.mongodb.net/
     DB_NAME=cricket_booking
     PORT=3001
     FRONTEND_URL=http://localhost:5173
     SESSION_SECRET=your-secret-key-change-in-production
     ```
   - **Note:** The MongoDB connection string is already configured in `.env.example`

4. **Start the server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   The server will run on `http://localhost:3001`

### 3. Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API URL:**
   - Create a `.env` file in the root directory:
     ```env
     VITE_API_URL=http://localhost:3001/api
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

### 4. Admin Login

The default admin user is automatically created when you run the database schema:

- **Email:** `admin@cricket.com`
- **Password:** `admin123`

Login at `/admin-login` after starting both frontend and backend servers.

**⚠️ Important:** Change the password after first login for security!

### 4. Razorpay Integration

To enable payments, you need a Razorpay account:

1. Sign up at https://razorpay.com/
2. Get your API keys from Dashboard > Settings > API Keys
3. Update the Razorpay key in `src/pages/BookSlot.tsx`:
   ```typescript
   const options = {
     key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual key
     // ... rest of the config
   };
   ```

**Note**: For production, store the Razorpay key in environment variables.

### 5. Pricing Configuration

Current pricing (can be modified in `src/pages/BookSlot.tsx`):

**Full Ground:**
- Day (6 AM - 6 PM): ₹1,500/hour
- Night (6 PM - 6 AM): ₹2,000/hour

**Half Ground:**
- Day: ₹800/hour
- Night: ₹1,200/hour

## Usage

### For Customers (No Login)

1. **Book a Slot** (`/book`):
   - Fill in personal details (name, phone, email)
   - Select date and time
   - Choose duration (1-4 hours)
   - Select ground size (Full/Half)
   - Enable night lights if needed
   - Review pricing and proceed to payment

2. **View Bookings** (`/my-bookings`):
   - Enter phone number or email
   - View all your bookings
   - Check booking status and payment status

3. **View Pricing** (`/pricing`):
   - See detailed pricing for all options
   - Compare full vs half ground rates
   - Understand day vs night charges

### For Admins (Login Required)

1. **Login** (`/admin-login`):
   - Enter admin email and password
   - Access admin dashboard

2. **Dashboard** (`/admin`):
   - View statistics (total bookings, revenue)
   - See all bookings with full details
   - Edit booking status and payment status
   - Delete bookings
   - Export data to CSV/Excel
   - Refresh booking list

## Key Features Explained

### Automatic Double-Booking Prevention
- Checks for overlapping time slots
- Validates against same ground size
- Considers booking duration
- Alerts user if slot is unavailable

### Smart Night Mode Detection
- Automatically enables night lights for 6 PM - 6 AM bookings
- Adjusts pricing accordingly
- Users can manually override

### Excel Export
- Admin can export all bookings to CSV
- Includes all booking details
- Timestamped filename
- Opens in Excel/Google Sheets

### Real-Time Updates
- Admin dashboard has refresh button
- Booking status updates immediately
- Payment status tracking

### Security Features
- Session-based authentication for admin
- Public users can create and view their own bookings
- Admin users (authenticated) can view/edit/delete all bookings
- Secure payment data handling
- Password hashing with bcrypt

## Pages

1. **Home** (`/`) - Landing page with features
2. **Book Slot** (`/book`) - Booking form with payment
3. **Pricing** (`/pricing`) - Detailed pricing information
4. **My Bookings** (`/my-bookings`) - User booking history
5. **Admin Login** (`/admin-login`) - Admin authentication
6. **Admin Dashboard** (`/admin`) - Booking management

## Payment Flow

1. User fills booking form
2. System checks slot availability
3. Booking created with 'pending' status
4. Razorpay payment modal opens
5. User completes payment
6. Payment verification
7. Booking status updated to 'confirmed'
8. Payment status updated to 'completed'

## Validation Rules

- **Phone**: 10 digits required
- **Email**: Valid email format
- **Date**: Cannot book past dates
- **Duration**: 1-4 hours only
- **No overlapping**: Same ground size cannot be double-booked

## Security Features

- RLS policies on all database tables
- Admin-only access for sensitive operations
- Secure payment via Razorpay
- No exposed API keys in frontend (except Razorpay public key)
- Authentication required for admin features

## Excel Integration

**Export**: Admin can export all bookings to CSV format with one click.

**Import**: To import bookings from Excel:
1. Prepare CSV with required columns
2. Use Supabase Dashboard > Table Editor
3. Use "Import data from CSV" feature
4. Map columns to database fields

## Support

For issues or questions:
1. Check MongoDB Atlas dashboard for database connection
2. Check backend server logs (console output)
3. Check browser console for frontend errors
4. Verify Razorpay integration and test mode
5. Ensure admin user exists in `admin_users` collection
6. Verify backend server is running on port 3001
7. Check MongoDB connection string in `server/.env` file
8. Ensure MongoDB Atlas network access allows your IP address

## Production Checklist

- [ ] Set up production MongoDB Atlas cluster
- [ ] Configure secure MongoDB connection string
- [ ] Update SESSION_SECRET in production
- [ ] Set up HTTPS for frontend and backend
- [ ] Configure CORS properly for production domain
- [ ] Add production Razorpay keys
- [ ] Enable Razorpay webhooks for payment confirmation
- [ ] Set up MongoDB Atlas backups
- [ ] Configure MongoDB Atlas network access (IP whitelist)
- [ ] Configure environment variables securely
- [ ] Set up custom domain
- [ ] Enable HTTPS
- [ ] Configure email notifications (optional)
- [ ] Set up backup strategy
- [ ] Test payment flow thoroughly
- [ ] Add terms and conditions
- [ ] Configure cancellation policy
