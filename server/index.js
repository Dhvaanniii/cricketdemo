const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'cricket-booking-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Database connection
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'cricket_booking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Helper function to execute queries
async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    throw error;
  }
}

// Initialize default admin user
async function initAdmin() {
  try {
    // Test database connection first
    await pool.execute('SELECT 1');
    console.log('✅ Database connection successful');
    
    const adminEmail = 'admin@cricket.com';
    const adminPassword = 'admin123';
    
    const existing = await query('SELECT * FROM admin_users WHERE email = ?', [adminEmail]);
    
    if (!existing || existing.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await query('INSERT INTO admin_users (email, password) VALUES (?, ?)', [adminEmail, hashedPassword]);
      console.log('✅ Default admin user created: admin@cricket.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
    console.error('Make sure:');
    console.error('  1. MySQL server is running');
    console.error('  2. Database "cricket_booking" exists');
    console.error('  3. Table "admin_users" exists');
    console.error('  4. Database credentials in .env are correct');
  }
}

// Initialize admin on startup
initAdmin();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// ==================== AUTH ROUTES ====================

// Test database endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    // Test connection
    await pool.execute('SELECT 1');
    
    // Test table exists
    const [tables] = await pool.execute("SHOW TABLES LIKE 'admin_users'");
    if (tables.length === 0) {
      return res.status(500).json({ 
        error: 'Table admin_users does not exist',
        solution: 'Run database/schema.sql in MySQL Workbench'
      });
    }
    
    // Test query
    const users = await query('SELECT * FROM admin_users LIMIT 1');
    
    res.json({ 
      status: 'ok',
      database: 'connected',
      table_exists: true,
      users_count: users.length,
      message: 'Database is working correctly'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database error',
      message: error.message,
      code: error.code,
      solution: 'Check MySQL server is running and credentials are correct'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Test database connection first
    try {
      await pool.execute('SELECT 1');
    } catch (dbError) {
      console.error('Database connection failed:', dbError.message);
      return res.status(500).json({ 
        error: 'Database connection failed',
        message: dbError.message,
        code: dbError.code,
        solution: 'Check MySQL server is running and .env file has correct credentials'
      });
    }

    console.log('Database connection OK, querying for user...');
    const users = await query('SELECT * FROM admin_users WHERE email = ?', [email]);
    console.log('Query result - Users found:', users ? users.length : 0);
    
    if (!users || users.length === 0) {
      console.log('No user found with email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    console.log('User found - ID:', user.id, 'Email:', user.email);
    
    // Check if password hash exists
    if (!user.password) {
      console.error('User found but password hash is missing');
      return res.status(500).json({ error: 'Database configuration error - password hash missing' });
    }

    console.log('Comparing password...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password comparison result:', isValid);

    if (!isValid) {
      console.log('Password invalid');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Setting session...');
    req.session.isAdmin = true;
    req.session.userId = user.id;
    req.session.userEmail = user.email;

    console.log('✅ Login successful for:', user.email);
    res.json({ message: 'Login successful', user: { email: user.email } });
  } catch (error) {
    console.error('❌ LOGIN ERROR:');
    console.error('  Name:', error.name);
    console.error('  Message:', error.message);
    console.error('  Code:', error.code);
    console.error('  Stack:', error.stack);
    
    const errorMessage = error.message || 'Internal server error';
    const errorCode = error.code || 'UNKNOWN_ERROR';
    
    // Provide helpful error messages
    let userMessage = 'Internal server error';
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      userMessage = 'Database access denied - check DB_USER and DB_PASSWORD in .env';
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      userMessage = 'Database does not exist - run database/schema.sql';
    } else if (error.code === 'ECONNREFUSED') {
      userMessage = 'Cannot connect to MySQL server - check if MySQL is running';
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      userMessage = 'Table admin_users does not exist - run database/schema.sql';
    }
    
    res.status(500).json({ 
      error: userMessage,
      message: errorMessage,
      code: errorCode
    });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout successful' });
});

// Check session
app.get('/api/auth/session', (req, res) => {
  if (req.session && req.session.isAdmin) {
    res.json({ isAdmin: true, user: { email: req.session.userEmail } });
  } else {
    res.json({ isAdmin: false });
  }
});

// ==================== BOOKINGS ROUTES ====================

// Get all bookings (admin only)
app.get('/api/bookings', requireAuth, async (req, res) => {
  try {
    const bookings = await query(
      'SELECT * FROM bookings ORDER BY booking_date DESC, start_time DESC'
    );
    res.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get bookings by phone or email (public)
app.get('/api/bookings/search', async (req, res) => {
  try {
    const { phone, email } = req.query;
    
    if (!phone && !email) {
      return res.status(400).json({ error: 'Phone or email is required' });
    }

    let sql = 'SELECT * FROM bookings WHERE 1=1';
    const params = [];

    if (phone) {
      sql += ' AND phone = ?';
      params.push(phone);
    }
    if (email) {
      sql += ' AND email = ?';
      params.push(email);
    }

    sql += ' ORDER BY booking_date DESC, start_time DESC';

    const bookings = await query(sql, params);
    res.json(bookings);
  } catch (error) {
    console.error('Search bookings error:', error);
    res.status(500).json({ error: 'Failed to search bookings' });
  }
});

// Check slot availability
app.post('/api/bookings/check-availability', async (req, res) => {
  try {
    const { booking_date, start_time, duration, ground_size } = req.body;

    if (!booking_date || !start_time || !duration || !ground_size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get all bookings for the same date and ground size
    const existingBookings = await query(
      'SELECT * FROM bookings WHERE booking_date = ? AND ground_size = ? AND status IN (?, ?)',
      [booking_date, ground_size, 'pending', 'confirmed']
    );

    // Parse times
    const [startHour, startMinute] = start_time.split(':').map(Number);
    const newStart = new Date(`2000-01-01T${start_time}`);
    const newEnd = new Date(newStart);
    newEnd.setHours(newEnd.getHours() + duration);

    // Check for conflicts
    const hasConflict = existingBookings.some(booking => {
      const [bookingHour, bookingMinute] = booking.start_time.split(':').map(Number);
      const bookingStart = new Date(`2000-01-01T${booking.start_time}`);
      const bookingEnd = new Date(bookingStart);
      bookingEnd.setHours(bookingEnd.getHours() + booking.duration);

      return (
        (newStart >= bookingStart && newStart < bookingEnd) ||
        (newEnd > bookingStart && newEnd <= bookingEnd) ||
        (newStart <= bookingStart && newEnd >= bookingEnd)
      );
    });

    res.json({ available: !hasConflict });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      username,
      phone,
      email,
      booking_date,
      start_time,
      duration,
      ground_size,
      night_mode,
      amount,
      status = 'pending',
      payment_status = 'pending'
    } = req.body;

    if (!username || !phone || !email || !booking_date || !start_time || !duration || !ground_size || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    await query(
      `INSERT INTO bookings (id, username, phone, email, booking_date, start_time, duration, ground_size, night_mode, amount, status, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, username, phone, email, booking_date, start_time, duration, ground_size, night_mode || false, amount, status, payment_status]
    );

    const booking = await query('SELECT * FROM bookings WHERE id = ?', [id]);
    res.status(201).json(booking[0]);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Update booking (admin only)
app.put('/api/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build update query dynamically
    const allowedFields = ['status', 'payment_status', 'amount', 'username', 'phone', 'email', 'booking_date', 'start_time', 'duration', 'ground_size', 'night_mode'];
    const updateFields = [];
    const values = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    values.push(id);
    const sql = `UPDATE bookings SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;

    await query(sql, values);
    const booking = await query('SELECT * FROM bookings WHERE id = ?', [id]);
    
    res.json(booking[0]);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Delete booking (admin only)
app.delete('/api/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM bookings WHERE id = ?', [id]);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// ==================== PAYMENTS ROUTES ====================

// Create payment
app.post('/api/payments', async (req, res) => {
  try {
    const {
      booking_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      status = 'created'
    } = req.body;

    if (!booking_id || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    await query(
      `INSERT INTO payments (id, booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, booking_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, status]
    );

    const payment = await query('SELECT * FROM payments WHERE id = ?', [id]);
    res.status(201).json(payment[0]);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: ${dbConfig.database}@${dbConfig.host}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test database: http://localhost:${PORT}/api/test-db`);
  console.log(`📝 Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`\n⚠️  If you see database errors, check:`);
  console.log(`   1. MySQL server is running`);
  console.log(`   2. Database "cricket_booking" exists`);
  console.log(`   3. Table "admin_users" exists`);
  console.log(`   4. server/.env has correct credentials\n`);
});

