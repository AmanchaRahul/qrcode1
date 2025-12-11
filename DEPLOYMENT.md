# Deployment Guide - QR Image App

## 🚀 Deployment Options

This guide covers deploying your QR Image App to popular hosting platforms.

---

## Option 1: Vercel (Recommended)

Vercel offers the easiest deployment for React + Vite apps.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite configuration

3. **Add Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL=https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app is live!

5. **Update Supabase URLs** (Important!)
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your Vercel URL to "Site URL"
   - Add `https://your-app.vercel.app/**` to "Redirect URLs"

### Vercel Configuration

No additional configuration needed! Vite is automatically detected.

---

## Option 2: Netlify

### Steps:

1. **Push to GitHub** (same as above)

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 18 or higher

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     ```
     VITE_SUPABASE_URL=https://xxxxx.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

5. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

6. **Configure Redirects** (Important for SPA routing)
   - Create `public/_redirects` file:
     ```
     /*    /index.html   200
     ```
   - Commit and push

7. **Update Supabase URLs**
   - Add your Netlify URL to Supabase Auth settings

### netlify.toml (Optional)

Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Option 3: GitHub Pages

### Steps:

1. **Install gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **Update vite.config.ts**
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',
   })
   ```

3. **Update package.json**
   Add scripts:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Configure GitHub Pages**
   - Go to repo Settings → Pages
   - Source: Deploy from branch
   - Branch: gh-pages
   - Folder: / (root)

6. **Update Supabase URLs**
   - Add your GitHub Pages URL to Supabase Auth settings

**Note**: GitHub Pages doesn't support server-side redirects well for SPAs. Consider using Vercel or Netlify instead.

---

## Option 4: Railway

### Steps:

1. **Push to GitHub**

2. **Import to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add Environment Variables**
   - Click on your service
   - Go to Variables tab
   - Add Supabase credentials

4. **Configure Build**
   Railway auto-detects Vite projects

5. **Deploy**
   - Railway automatically deploys
   - Get your public URL

---

## Option 5: Render

### Steps:

1. **Push to GitHub**

2. **Create Static Site on Render**
   - Go to [render.com](https://render.com)
   - Click "New" → "Static Site"
   - Connect your GitHub repository

3. **Configure Build**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Add Environment Variables**
   - Add VITE_SUPABASE_URL
   - Add VITE_SUPABASE_ANON_KEY

5. **Deploy**
   - Click "Create Static Site"

---

## Post-Deployment Checklist

### 1. Update Supabase Settings

After deployment, configure Supabase:

1. **Go to Supabase Dashboard → Authentication → URL Configuration**

2. **Update Site URL**
   ```
   https://your-app-domain.com
   ```

3. **Add Redirect URLs**
   ```
   https://your-app-domain.com/**
   ```

4. **Test Authentication**
   - Sign up with a test account
   - Verify email redirects work
   - Test login/logout

### 2. Test All Features

- ✅ Sign up / Login
- ✅ Upload image
- ✅ Generate QR code
- ✅ Download QR code
- ✅ View dashboard
- ✅ Delete image
- ✅ Scan QR code (from phone)
- ✅ Image redirect works

### 3. Performance Optimization

1. **Enable Production Mode**
   - Vite automatically optimizes for production

2. **Check Build Size**
   ```bash
   npm run build
   ```
   - Check `dist/` folder size
   - Should be under 1MB for fast loading

3. **Test Loading Speed**
   - Use Google PageSpeed Insights
   - Test from different locations

### 4. Security Verification

- ✅ `.env.local` is in `.gitignore`
- ✅ No sensitive keys in frontend code
- ✅ HTTPS enabled (automatic on most platforms)
- ✅ Supabase RLS policies active
- ✅ CORS configured correctly

---

## Environment Variables Reference

Required for all deployments:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: 
- Never commit these to Git
- Use platform-specific environment variable settings
- Prefix with `VITE_` for Vite to include them

---

## Custom Domain Setup

### Vercel
1. Go to Settings → Domains
2. Add your domain
3. Update DNS records as shown
4. Wait for propagation (5-30 min)

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Update DNS records
4. Enable HTTPS (automatic)

### Update Supabase
- Add custom domain to Supabase Auth URLs
- Test authentication with new domain

---

## Continuous Deployment

All platforms support automatic deployments:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Auto-Deploy**
   - Vercel/Netlify/Railway detect push
   - Automatically rebuild and deploy
   - Takes 1-3 minutes

---

## Troubleshooting

### Issue: Build fails
**Solution**: 
- Check Node version (needs 18+)
- Run `npm install` to ensure dependencies are installed
- Check build logs for specific errors

### Issue: Environment variables not working
**Solution**:
- Ensure they start with `VITE_`
- Rebuild after adding variables
- Check variable names match exactly

### Issue: 404 on page refresh
**Solution**:
- Add redirect rules (see Netlify section)
- Configure SPA fallback on your platform

### Issue: Authentication not working
**Solution**:
- Update Supabase URL configuration
- Add deployed URL to redirect URLs
- Check CORS settings

### Issue: Images not loading
**Solution**:
- Verify Supabase storage bucket exists
- Check RLS policies are active
- Test signed URL generation

---

## Performance Tips

1. **Use CDN**: Most platforms provide CDN automatically
2. **Enable Compression**: Gzip/Brotli (automatic on Vercel/Netlify)
3. **Optimize Images**: Before upload, compress images
4. **Cache Static Assets**: Configured by default in Vite
5. **Monitor Performance**: Use platform analytics

---

## Cost Estimates

- **Vercel**: Free tier (100GB bandwidth, unlimited projects)
- **Netlify**: Free tier (100GB bandwidth, 300 build minutes/month)
- **Railway**: Free $5/month credit
- **Render**: Free tier available
- **Supabase**: Free tier (500MB storage, 50,000 users)

**Total**: Free for small projects! 🎉

---

## Monitoring & Analytics

### Add Analytics (Optional)

1. **Google Analytics**
   - Add GA4 tracking code to `index.html`

2. **Vercel Analytics**
   - Enable in Vercel dashboard (free)

3. **Supabase Metrics**
   - View usage in Supabase dashboard

---

## Backup Strategy

1. **Database Backups**: Supabase provides automatic daily backups
2. **Code Backups**: Keep code in GitHub
3. **Storage Backups**: Export from Supabase storage if needed

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev

---

## Quick Deploy Commands

```bash
# Build locally
npm run build

# Preview build
npm run preview

# Deploy to Vercel (with Vercel CLI)
npm i -g vercel
vercel

# Deploy to Netlify (with Netlify CLI)
npm i -g netlify-cli
netlify deploy --prod
```

---

**You're ready to deploy! 🚀**

Choose your preferred platform and follow the steps above. Vercel is recommended for the easiest setup.
