# Production Deployment Guide

## Database Setup

### 1. Supabase Production Project
1. Create a new Supabase project for production
2. Run all migrations in the production database
3. Set up the same storage buckets (`resumes`, `avatars`, `blogs`)
4. Configure RLS policies (already included in migrations)

### 2. Environment Variables
Create production environment variables:
```
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Admin Access in Production

### 1. Create Admin Users
In your production Supabase project:
1. Go to Authentication > Users
2. Create admin user accounts manually
3. Use strong passwords and official email addresses

### 2. Admin Access Methods

**Option A: Hidden Admin Login Page (Recommended)**
- Keep the `/admin-login` route
- Share this URL only with team members
- No public links to admin functionality

**Option B: Remove Admin from Public Build**
- Create separate admin build for internal use
- Use environment variables to conditionally include admin routes

### 3. Security Best Practices

**Database Security:**
- RLS policies are already configured
- Only authenticated users can manage content
- Public users can only view public content

**Admin Route Protection:**
- All admin routes require authentication
- Automatic redirect to home if not authenticated
- Session management handled by Supabase

**Access Control:**
- Share admin credentials only with authorized team members
- Use strong, unique passwords
- Consider enabling 2FA in Supabase

## Deployment Options

### Option 1: Full Deployment (Recommended)
Deploy everything including admin functionality:
- Admins access via `/admin-login` URL
- Regular users never see admin features
- Secure and convenient for team management

### Option 2: Public-Only Deployment
Remove admin functionality from public build:
```javascript
// In vite.config.ts
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.INCLUDE_ADMIN': JSON.stringify(process.env.NODE_ENV === 'development')
  }
})
```

Then conditionally include admin routes:
```javascript
// In App.tsx
{process.env.INCLUDE_ADMIN && (
  <>
    <Route path="admin-login" element={<AdminLoginPage />} />
    <Route path="admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
  </>
)}
```

## Content Management Workflow

### For Events:
1. Admin logs in via `/admin-login`
2. Creates/manages events in admin panel
3. Events appear automatically on public site

### For Resumes:
1. Users submit resumes via public form
2. Admins review submissions in admin panel
3. Download and process resumes as needed

### For Team Members:
1. Admin adds team members via admin panel
2. Team members appear on contact page
3. Upload profile pictures through admin interface

## Recommended Production Setup

1. **Deploy Full Application**: Include all admin functionality
2. **Secure Admin Access**: Use `/admin-login` URL (don't link publicly)
3. **Create Admin Users**: Set up team member accounts in Supabase
4. **Monitor Access**: Use Supabase analytics to monitor admin usage
5. **Regular Backups**: Supabase handles this automatically

## Security Checklist

- ✅ RLS policies enabled on all tables
- ✅ Admin routes protected by authentication
- ✅ No public links to admin functionality
- ✅ Strong admin passwords
- ✅ Environment variables properly configured
- ✅ Storage buckets secured with proper policies

## Team Access Instructions

**For Team Members:**
1. Navigate to: `https://yoursite.com/admin-login`
2. Use provided admin credentials
3. Access admin panel at: `https://yoursite.com/admin`

**Admin Capabilities:**
- Manage events (create, edit, delete)
- View and download resume submissions
- Manage team member profiles
- Move events to past status with blog uploads