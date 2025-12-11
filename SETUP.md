# Supabase Configuration Guide

## Step-by-Step Setup

### 1. Create Supabase Project

1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: qr-image-app (or your preferred name)
   - **Database Password**: Save this securely
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for project initialization

### 2. Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

### 3. Verify Database Setup

Check that everything was created correctly:

#### Verify Tables
1. Go to **Table Editor** in the left sidebar
2. You should see the `images` table with columns:
   - id (uuid)
   - user_id (uuid)
   - storage_path (text)
   - created_at (timestamp)

#### Verify Storage Bucket
1. Go to **Storage** in the left sidebar
2. You should see an `images` bucket
3. Click on it - it should be set to **Private**

#### Verify RLS Policies
1. Go to **Authentication** > **Policies**
2. Select the `images` table
3. You should see three policies:
   - Users can view their own images (SELECT)
   - Users can insert their own images (INSERT)
   - Users can delete their own images (DELETE)

### 4. Configure Authentication

1. Go to **Authentication** > **Providers** in the left sidebar
2. Ensure **Email** is enabled
3. For development, disable email confirmation:
   - Go to **Authentication** > **Email Templates**
   - Click on **Confirm signup**
   - You can customize or disable confirmation emails

**For Development:**
- Go to **Authentication** > **Settings**
- Scroll to **Email Auth**
- **Disable** "Enable email confirmations"

### 5. Get Your API Keys

1. Go to **Settings** > **API** in the left sidebar
2. Find these two values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **Anon/Public Key** (under "Project API keys"):
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Copy both values

### 6. Update Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file
4. **Important**: Restart your dev server after updating environment variables

### 7. Test the Setup

1. Make sure your dev server is running:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173

3. Test the authentication:
   - Click "Sign Up"
   - Enter an email and password
   - Click "Sign up"
   - You should be redirected to the dashboard

4. Test image upload:
   - Click "Generate QR"
   - Drag and drop an image or click to upload
   - Wait for the QR code to generate
   - You should see the QR code and a short URL

5. Test the dashboard:
   - Click "Dashboard"
   - You should see your uploaded image with its QR code
   - Try clicking the "View" button to see the image
   - Try downloading the QR code

## Common Issues and Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Make sure `.env.local` exists and has the correct values. Restart the dev server.

### Issue: "Failed to upload image" or "Insert failed"
**Solution**: 
- Check that RLS policies are created correctly
- Verify the storage bucket exists and is named "images"
- Check browser console for specific error messages

### Issue: "Image not found" when scanning QR code
**Solution**:
- Make sure the image record was created in the database
- Check that the storage path is correct
- Verify storage policies allow reading

### Issue: Can't sign up - "Email not confirmed"
**Solution**: Disable email confirmation in Supabase dashboard:
- Authentication > Settings > Disable "Enable email confirmations"

### Issue: CORS errors
**Solution**: Supabase automatically handles CORS for your project URL. If you have issues:
- Make sure you're using the correct Project URL
- Check that the Anon key is correct

## Security Notes

1. **Never commit `.env.local`** to git (it's already in `.gitignore`)
2. **Never expose your service_role key** in frontend code
3. The **anon key** is safe to use in frontend - it's designed for public use
4. RLS policies protect your data even with the anon key
5. For production, consider additional security measures like rate limiting

## Storage Bucket Policies

The migration creates these storage policies automatically:

1. **Upload**: Users can upload to `images/{user_id}/*`
2. **Read**: Users can read from `images/{user_id}/*`
3. **Delete**: Users can delete from `images/{user_id}/*`

This ensures users can only access their own images.

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the browser console for error messages
- Check the Supabase dashboard logs
