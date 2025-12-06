# MongoDB Database Schema

## Collections

### admin_users
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (bcrypt hash, required),
  created_at: Date,
  updated_at: Date
}
```

### bookings
```javascript
{
  _id: String (UUID),
  username: String (required),
  phone: String (required),
  email: String (required),
  booking_date: String (date format: YYYY-MM-DD),
  start_time: String (time format: HH:MM),
  duration: Number (required, > 0),
  ground_size: String ('full' or 'half', required),
  night_mode: Boolean (default: false),
  status: String ('pending', 'confirmed', 'cancelled', default: 'pending'),
  amount: Number (required, > 0),
  payment_status: String ('pending', 'completed', 'failed', default: 'pending'),
  created_at: Date,
  updated_at: Date
}
```

### payments
```javascript
{
  _id: String (UUID),
  booking_id: String (required, references bookings._id),
  razorpay_order_id: String (optional),
  razorpay_payment_id: String (optional),
  razorpay_signature: String (optional),
  amount: Number (required, > 0),
  status: String ('created', 'success', 'failed', default: 'created'),
  created_at: Date
}
```

## Indexes

Create these indexes for better performance:

```javascript
// In MongoDB shell or Compass:
db.admin_users.createIndex({ email: 1 }, { unique: true });
db.bookings.createIndex({ booking_date: 1, start_time: 1 });
db.bookings.createIndex({ phone: 1 });
db.bookings.createIndex({ email: 1 });
db.bookings.createIndex({ status: 1 });
db.payments.createIndex({ booking_id: 1 });
```

## Notes

- Collections are created automatically when first document is inserted
- The server will create the default admin user on startup
- All dates are stored as JavaScript Date objects
- IDs for bookings and payments use UUID strings instead of ObjectId

