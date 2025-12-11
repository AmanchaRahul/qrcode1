# QR Image App - Image to QR Code Web Application

A secure web application that allows users to upload images, store them securely in Supabase, and generate QR codes that redirect to the images via temporary signed URLs.

## Features

- **User Authentication**: Email/password authentication via Supabase Auth
- **Secure Image Upload**: Drag-and-drop interface with client-side validation
- **QR Code Generation**: Instant high-quality QR code generation (600x600px)
- **Private Storage**: Images stored in private Supabase buckets
- **Dashboard**: Manage all your uploaded images and QR codes
- **Temporary Access**: Secure image access via 10-minute signed URLs
- **Clean URLs**: Short redirect URLs (`/i/:id`) for easy sharing

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage)
- **QR Generation**: qrcode library
- **File Upload**: react-dropzone

## Prerequisites

- Node.js 18+ installed
- Supabase account
- npm or yarn package manager

## Setup Instructions

### 1. Supabase Setup

#### Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be initialized

#### Run Database Migration
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL migration

This will:
- Create the `images` table
- Set up Row Level Security (RLS) policies
- Create the `images` storage bucket
- Configure storage policies

#### Get API Keys
1. Go to Project Settings > API
2. Copy the following:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - Anon/Public Key

#### Update Environment Variables
1. Open `.env.local` file
2. Replace with your actual values:
```
VITE_SUPABASE_URL=your_actual_project_url
VITE_SUPABASE_ANON_KEY=your_actual_anon_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
qr-image-app/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Generate.tsx
│   │   ├── Dashboard.tsx
│   │   └── ImageRedirect.tsx
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local
└── package.json
```

## User Flows

### Upload and Generate QR Code
1. User navigates to `/generate`
2. Uploads image via drag-and-drop or file picker
3. Image is validated and uploaded to Supabase
4. System generates a short URL (`/i/:id`)
5. QR code is generated for the short URL
6. User can download QR code or copy the link

### View Dashboard
1. User navigates to `/dashboard`
2. Sees all uploaded images with QR code previews
3. Can view images, download QR codes, or delete entries

### Scan QR Code
1. User scans QR code
2. Redirects to `/i/:id`
3. System generates temporary signed URL (10 min expiry)
4. User is redirected to the image

## Security Features

1. **Private Storage**: Images stored in private Supabase bucket
2. **RLS Policies**: Users can only access their own images
3. **Signed URLs**: Temporary 10-minute access links
4. **Protected Routes**: Dashboard and Generate pages require authentication
5. **Client-side Validation**: File size and type validation

## Troubleshooting

### Images not uploading
- Check Supabase storage bucket exists and is named "images"
- Verify RLS policies are correctly set
- Check browser console for errors

### Authentication issues
- Verify Supabase URL and Anon Key in .env.local
- Check if email confirmations are required in Supabase Auth settings
- For development, disable email confirmation in Supabase dashboard

### QR codes not working
- Ensure the application URL is correct
- Check that image records are being created in database
- Verify storage paths are correct

## Deployment

### Vercel
1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Netlify
1. Push code to GitHub
2. Import project to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

## License
MIT

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
"# qrcode1" 
