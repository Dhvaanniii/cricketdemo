# Troubleshooting Guide

## Common Issues and Solutions

### 1. 500 Internal Server Error on Login

**Symptoms:**
- Login request returns 500 error
- No specific error message shown

**Debugging Steps:**

1. **Check Server Console:**
   - Look for error messages in the terminal where the server is running
   - The server now logs detailed error information

2. **Test Database Connection:**
   ```bash
   # Visit in browser or use curl:
   http://localhost:3001/api/health
   ```
   - Should return: `{"status":"ok","database":"connected"}`
   - If it shows "disconnected", check your database configuration

3. **Verify Database Setup:**
   - Make sure MySQL server is running
   - Verify database `cricket_booking` exists
   - Check that table `admin_users` exists
   - Run this in MySQL Workbench:
     ```sql
     USE cricket_booking;
     SHOW TABLES;
     SELECT * FROM admin_users;
     ```

4. **Check Environment Variables:**
   - Verify `server/.env` file exists
   - Check these values:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=cricket_booking
     ```

5. **Common Database Errors:**

   **Error: "Access denied for user"**
   - Solution: Check DB_USER and DB_PASSWORD in `.env`

   **Error: "Unknown database 'cricket_booking'"**
   - Solution: Run `database/schema.sql` in MySQL Workbench

   **Error: "Table 'admin_users' doesn't exist"**
   - Solution: Run `database/schema.sql` in MySQL Workbench

   **Error: "ER_NOT_SUPPORTED_AUTH_MODE"**
   - Solution: Update MySQL user password or use MySQL 8.0+ compatible authentication

### 2. Admin User Not Created

**Symptoms:**
- Can't login with default credentials
- No admin user in database

**Solution:**
1. Check server startup logs for admin initialization message
2. Manually create admin user:
   ```sql
   USE cricket_booking;
   -- Generate bcrypt hash for 'admin123' using Node.js:
   -- node -e "const bcrypt=require('bcrypt');bcrypt.hash('admin123',10).then(h=>console.log(h))"
   -- Then insert:
   INSERT INTO admin_users (email, password) 
   VALUES ('admin@cricket.com', 'paste_bcrypt_hash_here');
   ```

### 3. CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Requests blocked by browser

**Solution:**
- Check `FRONTEND_URL` in `server/.env` matches your frontend URL
- Default: `FRONTEND_URL=http://localhost:5173`

### 4. Session Not Working

**Symptoms:**
- Login succeeds but immediately logged out
- Can't access admin routes

**Solution:**
- Check browser allows cookies
- Verify `credentials: 'include'` in API requests (already set)
- Check session secret in `.env`: `SESSION_SECRET=your-secret-key`

## Quick Health Check

Run these commands to verify everything is set up:

```bash
# 1. Check if server is running
curl http://localhost:3001/api/health

# 2. Test database connection (in MySQL Workbench)
USE cricket_booking;
SELECT COUNT(*) FROM admin_users;

# 3. Check server logs
# Look for: "✅ Database connection successful"
# Look for: "✅ Default admin user created" or "✅ Admin user already exists"
```

## Manual Database Setup

If automatic setup fails, manually create the admin user:

```sql
USE cricket_booking;

-- Check if table exists
SHOW TABLES LIKE 'admin_users';

-- If table doesn't exist, run the full schema.sql

-- Create admin user (you'll need to generate bcrypt hash)
-- Option 1: Use Node.js to generate hash
-- node -e "const bcrypt=require('bcrypt');bcrypt.hash('admin123',10).then(h=>console.log(h))"

-- Option 2: Let the server create it (restart server after creating table)
```

## Getting Help

If issues persist:
1. Check server console for detailed error messages
2. Check browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MySQL server is running and accessible
5. Test database connection using MySQL Workbench

