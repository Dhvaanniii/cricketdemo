# MySQL Database Setup

## Quick Setup Instructions

1. **Open MySQL Workbench** and connect to your MySQL server

2. **Run the SQL script:**
   - Open `database/schema.sql` in MySQL Workbench
   - Execute the entire script (or copy-paste into a new query tab)
   - This will create:
     - Database: `cricket_booking`
     - Tables: `admin_users`, `bookings`, `payments`
     - Default admin user: `admin@cricket.com` / `admin123`

3. **Update server configuration:**
   - Copy `server/.env.example` to `server/.env`
   - Update database credentials in `server/.env`:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=cricket_booking
     ```

4. **Start the backend server:**
   ```bash
   cd server
   npm install
   npm start
   ```

## Database Schema

### admin_users
- Stores admin login credentials
- Default admin: `admin@cricket.com` / `admin123`

### bookings
- Stores all cricket ground bookings
- Fields: id, username, phone, email, booking_date, start_time, duration, ground_size, night_mode, status, amount, payment_status

### payments
- Stores Razorpay payment information
- Linked to bookings via booking_id

## SQL Queries for Common Operations

### View all bookings
```sql
SELECT * FROM bookings ORDER BY booking_date DESC;
```

### View bookings by status
```sql
SELECT * FROM bookings WHERE status = 'confirmed';
```

### View total revenue
```sql
SELECT SUM(amount) as total_revenue 
FROM bookings 
WHERE payment_status = 'completed';
```

### View bookings for a specific date
```sql
SELECT * FROM bookings 
WHERE booking_date = '2024-01-15' 
ORDER BY start_time;
```

### Update booking status
```sql
UPDATE bookings 
SET status = 'confirmed', payment_status = 'completed' 
WHERE id = 'booking-id-here';
```

### Delete old cancelled bookings
```sql
DELETE FROM bookings 
WHERE status = 'cancelled' 
AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

