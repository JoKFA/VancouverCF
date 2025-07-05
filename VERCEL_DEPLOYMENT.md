# Vercel Deployment Guide

## Quick Setup

### 1. Connect Repository to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

### 2. Environment Variables Setup

In your Vercel project settings, add these environment variables:

**For Production Deployment:**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_ENABLED=false
```

**For Staging/Preview Deployments:**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_ENABLED=true
```

### 3. Build Settings (Auto-configured)
Vercel will automatically detect:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Admin Access Strategy

### Option 1: Branch-Based Deployment (Recommended)

**Main Branch (Production):**
- Environment: `VITE_ADMIN_ENABLED=false`
- URL: `yoursite.vercel.app`
- Public-facing site only

**Staging Branch (Admin Access):**
- Environment: `VITE_ADMIN_ENABLED=true`
- URL: `yoursite-git-staging.vercel.app`
- Full admin functionality

### Option 2: Preview Deployments for Admin

1. Set production environment variables with `VITE_ADMIN_ENABLED=false`
2. For admin access, create preview deployments with `VITE_ADMIN_ENABLED=true`
3. Use preview URLs for team admin access

## Deployment Commands

### From Local Machine:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview (with admin)
vercel --env VITE_ADMIN_ENABLED=true

# Deploy to production (no admin)
vercel --prod --env VITE_ADMIN_ENABLED=false
```

### From Package Scripts:
```bash
# Deploy staging with admin
npm run deploy:staging

# Deploy production without admin
npm run deploy:production
```

## Environment Variable Management

### Vercel Dashboard Method:
1. Go to Project Settings → Environment Variables
2. Add variables for different environments:
   - **Production**: `VITE_ADMIN_ENABLED=false`
   - **Preview**: `VITE_ADMIN_ENABLED=true`
   - **Development**: `VITE_ADMIN_ENABLED=true`

### CLI Method:
```bash
# Set production environment
vercel env add VITE_ADMIN_ENABLED production
# Enter: false

# Set preview environment
vercel env add VITE_ADMIN_ENABLED preview
# Enter: true
```

## Admin Access URLs

### Production (No Admin):
- Main site: `https://yoursite.vercel.app`
- Admin routes redirect to home

### Staging/Preview (With Admin):
- Main site: `https://yoursite-git-staging.vercel.app`
- Admin login: `https://yoursite-git-staging.vercel.app/admin-login`
- Admin panel: `https://yoursite-git-staging.vercel.app/admin`

## Database Setup

### Supabase Configuration:
1. Create Supabase project
2. Run migrations (see database setup guide)
3. Get project URL and anon key
4. Add to Vercel environment variables

### Storage Buckets:
After deployment, manually create storage policies in Supabase dashboard:

**Avatars Bucket:**
- SELECT: Public access
- INSERT/UPDATE/DELETE: Authenticated users only

**Blogs Bucket:**
- SELECT: Public access
- INSERT/UPDATE/DELETE: Authenticated users only

**Resumes Bucket:**
- SELECT: Authenticated users only
- INSERT: Public access
- UPDATE/DELETE: Authenticated users only

## Team Workflow

### Content Management:
1. **Team Access**: Use staging URL with admin enabled
2. **Content Updates**: Changes reflect immediately on production database
3. **Public Site**: Production URL shows updated content

### Example Workflow:
1. Team accesses: `https://yoursite-git-staging.vercel.app/admin-login`
2. Manages events, team members, reviews resumes
3. Changes appear on: `https://yoursite.vercel.app`

## Security Features

### Production Build:
- ✅ No admin routes in bundle
- ✅ No admin components loaded
- ✅ Smaller bundle size
- ✅ Clean public URLs

### Staging Build:
- ✅ Full admin functionality
- ✅ Protected by authentication
- ✅ Team-only access URLs

## Troubleshooting

### Common Issues:

1. **Build Failures:**
   - Check TypeScript errors: `npm run type-check`
   - Verify environment variables are set

2. **Admin Routes Not Working:**
   - Verify `VITE_ADMIN_ENABLED=true` in environment
   - Check browser console for errors

3. **Database Connection Issues:**
   - Verify Supabase URL and key are correct
   - Check Supabase project is active

4. **File Upload Issues:**
   - Verify storage buckets exist in Supabase
   - Check storage policies are configured

### Debug Commands:
```bash
# Check build locally
npm run build:production
npm run preview

# Check staging build
npm run build:staging
npm run preview
```

## Performance Optimization

### Automatic Optimizations:
- ✅ Code splitting by route and vendor
- ✅ Asset optimization and caching
- ✅ Gzip compression
- ✅ CDN distribution

### Manual Optimizations:
- Images served from Pexels CDN
- Lazy loading for admin components
- Efficient bundle splitting

## Monitoring

### Vercel Analytics:
- Enable in project settings for performance insights
- Monitor Core Web Vitals
- Track user engagement

### Error Tracking:
- Check Vercel function logs for errors
- Monitor Supabase logs for database issues
- Use browser dev tools for client-side debugging

This setup ensures your Vancouver Career Fair website deploys smoothly to Vercel with full admin functionality available through staging deployments while keeping the production site clean and public-facing.