const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dhvani:dhvani@admin.e61e8mi.mongodb.net/';
const DB_NAME = process.env.DB_NAME || 'cricket_booking';

let db;
let client;

// Connect to MongoDB
async function connectDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✅ MongoDB connection successful');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Helper function to transform MongoDB document (_id to id)
function transformDoc(doc) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id, ...rest };
}

// Helper function to transform array of documents
function transformDocs(docs) {
  return docs.map(transformDoc);
}

// Initialize default admin user
async function initAdmin() {
  try {
    const adminEmail = 'admin@cricket.com';
    const adminPassword = 'admin123';
    
    const adminUsers = db.collection('admin_users');
    const existing = await adminUsers.findOne({ email: adminEmail });
    
    if (!existing) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await adminUsers.insertOne({
        email: adminEmail,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date()
      });
      console.log('✅ Default admin user created: admin@cricket.com / admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error.message);
  }
}

// Initialize database connection
connectDB().then(() => {
  initAdmin();
}).catch((error) => {
  console.error('Failed to initialize database:', error);
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await db.admin().ping();
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

// Test database endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    // Test connection
    await db.admin().ping();
    
    // Test collection exists
    const collections = await db.listCollections({ name: 'admin_users' }).toArray();
    const collectionExists = collections.length > 0;
    
    if (!collectionExists) {
      return res.status(500).json({ 
        error: 'Collection admin_users does not exist',
        solution: 'Collections will be created automatically on first use'
      });
    }
    
    // Test query
    const users = await db.collection('admin_users').find({}).limit(1).toArray();
    
    res.json({ 
      status: 'ok',
      database: 'connected',
      collection_exists: collectionExists,
      users_count: users.length,
      message: 'Database is working correctly'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database error',
      message: error.message,
      code: error.code,
      solution: 'Check MongoDB connection string in .env file'
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
      await db.admin().ping();
    } catch (dbError) {
      console.error('Database connection failed:', dbError.message);
      return res.status(500).json({ 
        error: 'Database connection failed',
        message: dbError.message,
        code: dbError.code,
        solution: 'Check MongoDB connection string in .env file'
      });
    }

    console.log('Database connection OK, querying for user...');
    const user = await db.collection('admin_users').findOne({ email: email });
    console.log('Query result - User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('User found - ID:', user._id, 'Email:', user.email);
    
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
    req.session.userId = user._id.toString ? user._id.toString() : user._id;
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
    if (error.message.includes('authentication failed')) {
      userMessage = 'MongoDB authentication failed - check connection string in .env';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      userMessage = 'Cannot connect to MongoDB server - check connection string';
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
    const bookings = await db.collection('bookings')
      .find({})
      .sort({ booking_date: -1, start_time: -1 })
      .toArray();
    res.json(transformDocs(bookings));
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

    const query = {};
    if (phone) query.phone = phone;
    if (email) query.email = email;

    const bookings = await db.collection('bookings')
      .find(query)
      .sort({ booking_date: -1, start_time: -1 })
      .toArray();
    
    res.json(transformDocs(bookings));
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
    const existingBookings = await db.collection('bookings')
      .find({
        booking_date: booking_date,
        ground_size: ground_size,
        status: { $in: ['pending', 'confirmed'] }
      })
      .toArray();

    // Parse times
    const newStart = new Date(`2000-01-01T${start_time}`);
    const newEnd = new Date(newStart);
    newEnd.setHours(newEnd.getHours() + duration);

    // Check for conflicts
    const hasConflict = existingBookings.some(booking => {
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

    const booking = {
      _id: uuidv4(),
      username,
      phone,
      email,
      booking_date,
      start_time,
      duration,
      ground_size,
      night_mode: night_mode || false,
      amount,
      status,
      payment_status,
      created_at: new Date(),
      updated_at: new Date()
    };

    await db.collection('bookings').insertOne(booking);
    res.status(201).json(transformDoc(booking));
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

    // Build update object dynamically
    const allowedFields = ['status', 'payment_status', 'amount', 'username', 'phone', 'email', 'booking_date', 'start_time', 'duration', 'ground_size', 'night_mode'];
    const updateFields = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields[key] = updates[key];
      }
    });

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updateFields.updated_at = new Date();

    const result = await db.collection('bookings').findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
    
    if (!result || !result.value) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(transformDoc(result.value));
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Delete booking (admin only)
app.delete('/api/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('bookings').deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
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

    const payment = {
      _id: uuidv4(),
      booking_id,
      razorpay_order_id: razorpay_order_id || null,
      razorpay_payment_id: razorpay_payment_id || null,
      razorpay_signature: razorpay_signature || null,
      amount,
      status,
      created_at: new Date()
    };

    await db.collection('payments').insertOne(payment);
    res.status(201).json(transformDoc(payment));
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: MongoDB (${DB_NAME})`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test database: http://localhost:${PORT}/api/test-db`);
  console.log(`📝 Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`\n⚠️  If you see database errors, check:`);
  console.log(`   1. MongoDB connection string in .env file`);
  console.log(`   2. Network access is enabled in MongoDB Atlas`);
  console.log(`   3. Database name is correct\n`);
});
