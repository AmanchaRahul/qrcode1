# Quick Start Guide - QR Image App

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd qr-image-app
npm install
```

### Step 2: Set Up Supabase

1. **Create Account**: Go to [supabase.com](https://supabase.com) and create a new project

2. **Run SQL Migration**:
   - Open Supabase Dashboard → SQL Editor
   - Copy & paste contents from `supabase/migrations/001_initial_schema.sql`
   - Click "Run"

3. **Get API Keys**:
   - Go to Settings → API
   - Copy your Project URL and Anon Key

4. **Update `.env.local`**:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 3: Run the App
```bash
npm run dev
```

Open http://localhost:5173

### Step 4: Test It Out

1. **Sign Up**: Click "Sign Up" and create an account
2. **Upload Image**: Go to "Generate QR" and upload an image
3. **Get QR Code**: Download the generated QR code
4. **View Dashboard**: Check all your uploads in the dashboard

## 🎯 What You Can Do

- ✅ Upload images securely
- ✅ Generate high-quality QR codes
- ✅ Share images via QR codes
- ✅ Manage all your uploads
- ✅ Delete images and QR codes

## 📱 How It Works

1. **Upload** → Image saved to private Supabase storage
2. **Generate** → QR code created with short URL
3. **Share** → Anyone scanning the QR gets secure access
4. **Secure** → Images accessed via temporary signed URLs (10 min expiry)

## ⚙️ Key Features

- **Drag & Drop Upload**: Easy file upload interface
- **Instant QR Generation**: 600x600px high-quality codes
- **Private Storage**: Your images are stored securely
- **Dashboard**: View and manage all uploads
- **Mobile Friendly**: Works on all devices

## 🔧 Tech Stack

- React 18 + TypeScript
- TailwindCSS
- Supabase (Auth + Database + Storage)
- React Router
- qrcode library

## 📖 Need More Help?

- **Full Setup Guide**: See `SETUP.md`
- **Detailed README**: See `README.md`
- **Supabase Issues**: Check Supabase dashboard logs

## 🐛 Common Issues

**"Missing environment variables"**
→ Make sure `.env.local` has your Supabase URL and key

**"Upload failed"**
→ Run the SQL migration in Supabase dashboard

**"Can't sign up"**
→ Disable email confirmation in Supabase: Authentication → Settings

## 🎨 Customize

- Update colors in `tailwind.config.js`
- Modify QR code size in `src/pages/Generate.tsx`
- Change signed URL expiry time (default: 10 min)

Enjoy building with QR Image App! 🎉
