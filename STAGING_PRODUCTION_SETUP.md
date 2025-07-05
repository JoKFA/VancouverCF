# Staging/Production Environment Setup

## Architecture Overview

**Staging Environment (`/staging` or subdomain)**
- Full admin functionality
- Team member access for content management
- Database: Same production database
- URL: `yoursite.com/staging/admin-login` or `staging.yoursite.com/admin-login`

**Production Environment**
- Public-facing website only
- No admin routes or functionality
- Database: Same production database (read-only for public content)
- URL: `yoursite.com`

## Implementation Strategy

### Option 1: Path-Based Staging (Recommended)

Deploy the full application to production, but use environment variables to control admin access:

```javascript
// In vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  define: {
    'import.meta.env.VITE_ADMIN_ENABLED': JSON.stringify(
      process.env.VITE_ADMIN_ENABLED === 'true'
    )
  }
})
```

```javascript
// In App.tsx - Conditional Admin Routes
function App() {
  const adminEnabled = import.meta.env.VITE_ADMIN_ENABLED === 'true'
  
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:eventId" element={<BlogPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          
          {/* Admin routes only in staging */}
          {adminEnabled && (
            <>
              <Route path="admin-login" element={<AdminLoginPage />} />
              <Route 
                path="admin" 
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            </>
          )}
        </Route>
      </Routes>
    </AuthProvider>
  )
}
```

### Option 2: Subdomain-Based Staging

**Production Build** (`yoursite.com`):
- Environment: `VITE_ADMIN_ENABLED=false`
- No admin functionality

**Staging Build** (`staging.yoursite.com`):
- Environment: `VITE_ADMIN_ENABLED=true`
- Full admin functionality

## Deployment Configuration

### Environment Variables

**Production (.env.production)**
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_ADMIN_ENABLED=false
```

**Staging (.env.staging)**
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_ADMIN_ENABLED=true
```

### Build Scripts

```json
{
  "scripts": {
    "build:production": "vite build --mode production",
    "build:staging": "vite build --mode staging",
    "deploy:production": "npm run build:production && netlify deploy --prod --dir=dist",
    "deploy:staging": "npm run build:staging && netlify deploy --alias=staging --dir=dist"
  }
}
```

## Database Strategy

### Single Database Approach (Recommended)
- Use the same production Supabase database for both environments
- Staging admin changes immediately reflect on production
- Real-time content management

### Benefits:
- ✅ Immediate content updates
- ✅ Single source of truth
- ✅ No data synchronization needed
- ✅ Team can manage live content safely

### Security:
- RLS policies protect data access
- Admin authentication required for modifications
- Public users only see published content

## Team Workflow

### Content Management Process:
1. **Team Access**: Navigate to `staging.yoursite.com/admin-login`
2. **Login**: Use admin credentials
3. **Manage Content**: 
   - Create/edit events
   - Review resume submissions
   - Manage team profiles
4. **Publish**: Changes appear immediately on production site

### Event Management Example:
1. Create event in staging admin panel
2. Event appears on production events page
3. When event is complete, upload recap in staging
4. Event moves to "past events" on production

## Implementation Steps

### 1. Update App.tsx for Conditional Admin Routes
```javascript
// Add environment check for admin routes
const adminEnabled = import.meta.env.VITE_ADMIN_ENABLED === 'true'
```

### 2. Create Environment-Specific Builds
```bash
# Production build (no admin)
VITE_ADMIN_ENABLED=false npm run build

# Staging build (with admin)
VITE_ADMIN_ENABLED=true npm run build
```

### 3. Deploy Both Versions
- Production: `yoursite.com` (public only)
- Staging: `staging.yoursite.com` or `yoursite.com/staging` (with admin)

### 4. Team Access Instructions
**For Team Members:**
- Admin URL: `staging.yoursite.com/admin-login`
- Use provided credentials
- Manage content that appears live on production

## Security Considerations

### Production Site:
- ✅ No admin routes exposed
- ✅ No admin login functionality
- ✅ Clean, public-facing URLs
- ✅ No sensitive admin code in bundle

### Staging Site:
- ✅ Admin access protected by authentication
- ✅ Same database security (RLS policies)
- ✅ Can be password-protected at server level
- ✅ Team-only access

## Alternative: Server-Level Protection

### Option 3: Single Deployment with Server Protection
Deploy full app to production, but protect admin routes at server level:

**Netlify Example:**
```toml
# netlify.toml
[[redirects]]
  from = "/admin-login"
  to = "/admin-login"
  status = 200
  conditions = {Role = ["admin"]}

[[redirects]]
  from = "/admin/*"
  to = "/admin/:splat"
  status = 200
  conditions = {Role = ["admin"]}
```

**Cloudflare Example:**
- Use Cloudflare Access to protect `/admin*` routes
- Require team email authentication

## Recommended Setup

**Best Practice: Subdomain Staging**
1. Deploy public-only build to `yoursite.com`
2. Deploy full build to `staging.yoursite.com`
3. Team manages content via staging
4. Content appears immediately on production
5. Clean separation of concerns

This approach gives you:
- ✅ Clean production site with no admin code
- ✅ Secure staging environment for team
- ✅ Real-time content management
- ✅ Professional appearance for public users
- ✅ Easy team access for content updates