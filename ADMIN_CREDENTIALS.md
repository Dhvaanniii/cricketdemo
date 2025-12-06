# Default Admin Credentials

## Login Information

**Email:** `admin@cricket.com`  
**Password:** `admin123`

## How to Set Up

### Quick Setup (Automatic)

1. Make sure you have a `.env` file with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the setup script:
   ```bash
   npm run create-admin
   ```

### Manual Setup

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication > Users**
4. Click **"Add User"**
5. Enter:
   - Email: `admin@cricket.com`
   - Password: `admin123`
6. **Enable "Auto Confirm User"** ✅
7. Click **"Create User"**

## Login

After setup, go to `/admin-login` and use the credentials above.

## Security Note

⚠️ **IMPORTANT:** Change the password after your first login for security!

