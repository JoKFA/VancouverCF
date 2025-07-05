# Staging/Production Deployment Setup Guide

## Overview

This setup creates two environments:
- **Production** (Main branch): Public website without admin functionality
- **Staging** (Dev branch): Full website with admin access for team management

## Branch Structure

```
main (production)     ← Public website (yoursite.com)
  ↑
dev (staging)         ← Admin management (dev--yoursite.netlify.app)
```

## Environment Configuration

### Production Environment (Main Branch)
- **URL**: `yoursite.com`
- **Admin Access**: Disabled (`VITE_ADMIN_ENABLED=false`)
- **Purpose**: Public-facing website
- **Features**: Events, Resume submission, About, Contact

### Staging Environment (Dev Branch)
- **URL**: `dev--yoursite.netlify.app` (or custom staging domain)
- **Admin Access**: Enabled (`VITE_ADMIN_ENABLED=true`)
- **Purpose**: Team content management
- **Features**: Full site + Admin panel at `/admin-login`

## Setup Instructions

### 1. Repository Setup

```bash
# Ensure you're on dev branch
git checkout dev

# Push dev branch to remote
git push origin dev

# Switch to main branch
git checkout main

# Merge dev into main (for initial setup)
git merge dev

# Push main branch
git push origin main
```

### 2. Netlify Deployment Setup

#### Option A: Single Site with Branch Deploys (Recommended)

1. **Connect Repository to Netlify**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set production branch to `main`

2. **Configure Build Settings**
   - Build command: `npm run build:production`
   - Publish directory: `dist`
   - Production branch: `main`

3. **Enable Branch Deploys**
   - Go to Site settings → Build & deploy → Continuous deployment
   - Enable "Deploy previews" for `dev` branch
   - Dev branch will auto-deploy to `dev--yoursite.netlify.app`

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_production_supabase_url
     VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
     ```

#### Option B: Two Separate Sites

1. **Production Site**
   - Create new Netlify site
   - Connect to `main` branch
   - Build command: `npm run build:production`
   - Set `VITE_ADMIN_ENABLED=false`

2. **Staging Site**
   - Create second Netlify site
   - Connect to `dev` branch
   - Build command: `npm run build:staging`
   - Set `VITE_ADMIN_ENABLED=true`

### 3. Database Setup

Both environments use the **same production database**:
- Staging admin changes appear immediately on production
- Single source of truth for all content
- No data synchronization needed

### 4. Team Workflow

#### For Content Management:
1. **Access Staging**: Go to `dev--yoursite.netlify.app/admin-login`
2. **Login**: Use admin credentials
3. **Manage Content**: 
   - Create/edit events
   - Review resume submissions
   - Manage team profiles
4. **Publish**: Changes appear immediately on production site

#### For Code Changes:
```bash
# Work on dev branch
git checkout dev

# Make changes and commit
git add .
git commit -m "Update feature"
git push origin dev

# When ready for production
git checkout main
git merge dev
git push origin main
```

## Admin Access URLs

### Staging (Team Management)
- **URL**: `dev--yoursite.netlify.app/admin-login`
- **Purpose**: Team content management
- **Access**: Admin credentials required

### Production (Public)
- **URL**: `yoursite.com`
- **Admin Routes**: Not available (404)
- **Purpose**: Public website only

## Security Features

### Production Site
✅ No admin code in bundle  
✅ No admin routes exposed  
✅ Clean public URLs  
✅ Optimized for public users  

### Staging Site
✅ Admin access protected by authentication  
✅ Same database security (RLS policies)  
✅ Team-only access  
✅ Real-time content management  

## Testing the Setup

### 1. Test Production
```bash
# Build and test production locally
npm run build:production
npm run preview

# Visit http://localhost:4173
# Verify /admin-login returns 404
```

### 2. Test Staging
```bash
# Build and test staging locally
npm run build:staging
npm run preview:staging

# Visit http://localhost:4173
# Verify /admin-login is accessible
```

## Deployment Commands

```bash
# Deploy to production (main branch)
git checkout main
git push origin main

# Deploy to staging (dev branch)
git checkout dev
git push origin dev
```

## Troubleshooting

### Admin Routes Not Working in Staging
- Check `VITE_ADMIN_ENABLED` environment variable
- Verify build command uses `--mode staging`
- Check browser console for errors

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check RLS policies are properly configured
- Ensure storage buckets exist

### Build Failures
- Check all environment variables are set
- Verify Node.js version compatibility
- Review build logs for specific errors

## Maintenance

### Regular Updates
1. Develop features on `dev` branch
2. Test on staging environment
3. Merge to `main` when ready
4. Production deploys automatically

### Content Management
- Team uses staging admin panel
- Changes appear immediately on production
- No manual deployment needed for content updates

This setup provides a professional staging/production workflow while maintaining security and ease of use for your team.