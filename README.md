# Cricket Ground Booking System

A complete cricket ground slot-booking system with React, MongoDB, Express, and Razorpay integration.

## 🔐 Default Admin Login

**Email:** `admin@cricket.com`  
**Password:** `admin123`

> See [SETUP.md](./SETUP.md) for detailed setup instructions.

## Quick Start

### 1. Database Setup
1. MongoDB connection string is configured in `server/.env`
2. Collections are created automatically on first use
3. Default admin user is created automatically on server startup

### 2. Backend Setup
```bash
cd server
npm install
# MongoDB connection string is already in server/.env.example
npm start
```

### 3. Frontend Setup
```bash
npm install
# Create .env file with: VITE_API_URL=http://localhost:3001/api
npm run dev
```

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (MongoDB Atlas)
- **Payment**: Razorpay

## Features

- Book cricket ground slots (Full/Half ground)
- Night mode lighting option
- Real-time slot availability checking
- Razorpay payment integration
- Admin dashboard for managing bookings
- Export bookings to CSV
- View booking history by phone/email

## Project Structure

```
├── src/              # Frontend React app
├── server/           # Backend Express API
├── database/         # MongoDB schema and queries
└── scripts/          # Utility scripts
```

For detailed setup instructions, see [SETUP.md](./SETUP.md).
