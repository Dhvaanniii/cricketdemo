# MongoDB Database Setup

## Quick Setup Instructions

1. **MongoDB Connection:**
   - The MongoDB connection string is stored in `server/.env`:
     ```
     MONGODB_URI=mongodb+srv://dhvani:dhvani@admin.e61e8mi.mongodb.net/
     DB_NAME=cricket_booking
     ```

2. **Collections:**
   - Collections are created automatically when first document is inserted
   - No manual setup required
   - The server will create collections on first use

3. **Start the backend server:**
   ```bash
   cd server
   npm install
   npm start
   ```

## Database Schema

### Collections

#### admin_users
- Stores admin login credentials
- Default admin: `admin@cricket.com` / `admin123`
- Created automatically on server startup

#### bookings
- Stores all cricket ground bookings
- Fields: _id, username, phone, email, booking_date, start_time, duration, ground_size, night_mode, status, amount, payment_status, created_at, updated_at

#### payments
- Stores Razorpay payment information
- Linked to bookings via booking_id

## MongoDB Queries for Common Operations

### View all bookings
```javascript
db.bookings.find().sort({ booking_date: -1, start_time: -1 });
```

### View bookings by status
```javascript
db.bookings.find({ status: 'confirmed' });
```

### View total revenue
```javascript
db.bookings.aggregate([
  { $match: { payment_status: 'completed' } },
  { $group: { _id: null, total: { $sum: '$amount' } } }
]);
```

### View bookings for a specific date
```javascript
db.bookings.find({ booking_date: '2024-01-15' }).sort({ start_time: 1 });
```

### Update booking status
```javascript
db.bookings.updateOne(
  { _id: 'booking-id-here' },
  { $set: { status: 'confirmed', payment_status: 'completed', updated_at: new Date() } }
);
```

### Delete old cancelled bookings
```javascript
db.bookings.deleteMany({
  status: 'cancelled',
  created_at: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
});
```

### Create indexes for better performance
```javascript
// In MongoDB shell or Compass:
db.admin_users.createIndex({ email: 1 }, { unique: true });
db.bookings.createIndex({ booking_date: 1, start_time: 1 });
db.bookings.createIndex({ phone: 1 });
db.bookings.createIndex({ email: 1 });
db.bookings.createIndex({ status: 1 });
db.payments.createIndex({ booking_id: 1 });
```

## MongoDB Atlas Setup

1. **Network Access:**
   - Go to MongoDB Atlas Dashboard
   - Navigate to Network Access
   - Add your IP address or allow all IPs (0.0.0.0/0) for development

2. **Database User:**
   - Ensure database user has read/write permissions
   - Username and password are in the connection string

3. **Connection String:**
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/`
   - Stored in `server/.env` as `MONGODB_URI`

## Notes

- Collections are created automatically - no manual setup needed
- The server transforms MongoDB's `_id` to `id` for frontend compatibility
- All dates are stored as JavaScript Date objects
- UUID strings are used for booking and payment IDs
