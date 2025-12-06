# MongoDB Migration Complete

## What Changed

### Database
- **Before**: MySQL with mysql2 driver
- **After**: MongoDB with native MongoDB driver

### Connection
- **Before**: MySQL connection pool with host, user, password
- **After**: MongoDB connection string (MongoDB Atlas)

### Collections (instead of Tables)
- `admin_users` - Admin authentication
- `bookings` - All cricket ground bookings
- `payments` - Razorpay payment records

## MongoDB Connection String

Your MongoDB connection string:
```
mongodb+srv://dhvani:dhvani@admin.e61e8mi.mongodb.net/
```

This is stored in `server/.env` as:
```env
MONGODB_URI=mongodb+srv://dhvani:dhvani@admin.e61e8mi.mongodb.net/
DB_NAME=cricket_booking
```

## Setup Steps

1. **Create `server/.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://dhvani:dhvani@admin.e61e8mi.mongodb.net/
   DB_NAME=cricket_booking
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   SESSION_SECRET=your-secret-key-change-in-production
   ```

2. **Install MongoDB driver:**
   ```bash
   cd server
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Verify connection:**
   - Check server console for: "✅ MongoDB connection successful"
   - Visit: `http://localhost:3001/api/health`
   - Should return: `{"status":"ok","database":"connected"}`

## Key Differences from MySQL

1. **No manual schema setup** - Collections are created automatically
2. **Document-based** - Uses JSON documents instead of rows
3. **`_id` field** - MongoDB uses `_id` instead of `id` (server transforms it)
4. **Query syntax** - Uses MongoDB query operators instead of SQL

## Collections Structure

### admin_users
```javascript
{
  _id: ObjectId,
  email: "admin@cricket.com",
  password: "bcrypt_hash",
  created_at: Date,
  updated_at: Date
}
```

### bookings
```javascript
{
  _id: "uuid-string",
  username: "John Doe",
  phone: "1234567890",
  email: "john@example.com",
  booking_date: "2024-01-15",
  start_time: "10:00",
  duration: 2,
  ground_size: "full",
  night_mode: false,
  status: "pending",
  amount: 3000,
  payment_status: "pending",
  created_at: Date,
  updated_at: Date
}
```

### payments
```javascript
{
  _id: "uuid-string",
  booking_id: "booking-uuid",
  razorpay_order_id: "...",
  razorpay_payment_id: "...",
  razorpay_signature: "...",
  amount: 300000,
  status: "success",
  created_at: Date
}
```

## MongoDB Atlas Setup

1. **Network Access:**
   - Go to MongoDB Atlas Dashboard
   - Navigate to Network Access
   - Add your IP address (or 0.0.0.0/0 for development)

2. **Database User:**
   - Username: `dhvani`
   - Password: `dhvani`
   - Already configured in connection string

3. **Database:**
   - Database name: `cricket_booking`
   - Will be created automatically if it doesn't exist

## Testing

1. **Health Check:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Test Database:**
   ```bash
   curl http://localhost:3001/api/test-db
   ```

3. **Login:**
   - Email: `admin@cricket.com`
   - Password: `admin123`
   - Admin user is created automatically on first server start

## Troubleshooting

**Connection Error:**
- Check MongoDB Atlas network access settings
- Verify connection string in `.env` file
- Check username/password are correct

**Collections Not Found:**
- Collections are created automatically on first insert
- No manual creation needed

**Authentication Error:**
- Verify MongoDB Atlas database user credentials
- Check connection string format

