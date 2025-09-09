# Deployment Guide

## Vercel Deployment (Recommended)

1. **Connect to Vercel**
   - Import your GitHub repository into Vercel
   - Vercel automatically detects the Vite configuration

2. **Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_ENABLED=false (for production)
   ```

3. **Deploy**
   ```bash
   # Production (no admin)
   npm run deploy:production

   # Staging (with admin)
   npm run deploy:staging
   ```

### Admin Access Strategy

**Production:** `yoursite.vercel.app` (public only)

**Staging:** `yoursite-git-staging.vercel.app` (with admin)

Team members can access the admin dashboard using the staging URL: `/admin-login`.

## Quick Production Deployment

### 1. Environment Setup
For production deployment, you only need to change the `.env` file:

```env
# Production .env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_ADMIN_ENABLED=false
```

### 2. Build and Deploy
```bash
# Build for production (no admin functionality)
npm run build:production

# Deploy to your hosting platform
# The build will automatically exclude admin routes and functionality
```

## Environment Configuration

### Development (.env)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_ENABLED=true
```

### Production (.env)
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_ADMIN_ENABLED=false
```

## Security Features

### Production Build (VITE_ADMIN_ENABLED=false)
- ✅ No admin routes exposed
- ✅ No admin login functionality
- ✅ Admin components not included in bundle
- ✅ Smaller bundle size
- ✅ Clean public-facing URLs

### Development Build (VITE_ADMIN_ENABLED=true)
- ✅ Full admin functionality
- ✅ Protected admin routes
- ✅ Authentication required for admin access
- ✅ RLS policies protect database

## Database Security

### Row Level Security (RLS)
All tables have RLS enabled with proper policies:

- **Events**: Public read, authenticated write
- **Resumes**: Public insert, authenticated read
- **Team Members**: Public read, authenticated write

### Storage Security
- **Avatars bucket**: Public read, authenticated write
- **Blogs bucket**: Public read, authenticated write
- **Resumes bucket**: Authenticated access only

## Branch Management

### Main Branch (Production)
1. Set `VITE_ADMIN_ENABLED=false` in `.env`
2. Build and deploy
3. Only public functionality available

### Development Branch
1. Set `VITE_ADMIN_ENABLED=true` in `.env`
2. Full admin functionality available
3. Use for content management

## Content Management Workflow

### For Team Members:
1. Use development environment with `VITE_ADMIN_ENABLED=true`
2. Access admin panel at `/admin-login`
3. Manage content (events, team, resumes)
4. Changes reflect immediately in production database

### Database Strategy:
- Single production database for both environments
- Development admin changes appear live on production
- No data synchronization needed

## Hosting Platform Instructions

### Netlify
```bash
# Build command
npm run build:production

# Publish directory
dist

# Environment variables (set in Netlify dashboard)
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_ADMIN_ENABLED=false
```

### Vercel
```bash
# Build command
npm run build:production

# Output directory
dist

# Environment variables (set in Vercel dashboard)
VITE_SUPABASE_URL=your_production_url
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_ADMIN_ENABLED=false
```

## Security Checklist

- ✅ RLS enabled on all database tables
- ✅ Storage policies configured
- ✅ Admin routes protected by authentication
- ✅ Environment-based admin access control
- ✅ Input validation on all forms
- ✅ Error handling with user-friendly messages
- ✅ No sensitive data in client-side code

## Troubleshooting

### Common Issues:

1. **Admin routes not working in production**
   - Check `VITE_ADMIN_ENABLED=false` in production
   - This is expected behavior for security

2. **Database connection errors**
   - Verify Supabase URL and anon key
   - Check network connectivity

3. **File upload issues**
   - Ensure storage buckets exist
   - Check storage policies in Supabase dashboard

### Support:
For issues, check the browser console for detailed error messages and verify environment variables are set correctly.