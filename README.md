# Vancouver Career Fair 2025 - VIVA Events

A modern, responsive website for Vancouver's premier career development event, built with React, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Local Development
```bash
# Clone the repository
git clone <your-repo-url>
cd vancouver-career-fair

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel:**
   - Import your GitHub repository to Vercel
   - Vercel auto-detects Vite configuration

2. **Environment Variables:**
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_ENABLED=false (for production)
   ```

3. **Deploy:**
   ```bash
   # Production (no admin)
   npm run deploy:production
   
   # Staging (with admin)
   npm run deploy:staging
   ```

### Admin Access Strategy

**Production:** `yoursite.vercel.app` (public only)
**Staging:** `yoursite-git-staging.vercel.app` (with admin)

Team members access admin via staging URL: `/admin-login`

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend
- **Supabase** for database and authentication
- **Supabase Storage** for file uploads
- **Row Level Security** for data protection

### Database Schema
- `events` - Career fair events
- `resumes` - Resume submissions
- `team_members` - Team profiles

## 🔐 Admin Features

### Content Management
- ✅ Create and manage events
- ✅ Review resume submissions
- ✅ Manage team member profiles
- ✅ Upload event recaps and blogs

### Security
- ✅ Authentication required for admin access
- ✅ Row Level Security on all tables
- ✅ Environment-based admin access control
- ✅ Secure file upload with validation

## 📱 Features

### Public Features
- Modern, responsive design
- Event listings and details
- Resume submission form
- Team member profiles
- Contact information
- About page with organization info

### Admin Features (Staging Only)
- Event management dashboard
- Resume review and download
- Team member management
- File upload for event recaps
- Real-time content updates

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:staging # Build with admin features
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Environment Variables
```bash
# Required
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
VITE_ADMIN_ENABLED=true  # Enable admin features (default: true in dev)
```

## 📊 Database Setup

1. **Create Supabase Project**
2. **Run Migrations:**
   ```sql
   -- See supabase/migrations/ for all migration files
   ```
3. **Set up Storage Buckets:**
   - `avatars` (public) - Team member photos
   - `blogs` (public) - Event recap files  
   - `resumes` (private) - Resume submissions

4. **Configure Storage Policies** (via Supabase Dashboard)

## 🎨 Design System

### Colors
- **Primary:** Purple to Blue gradient
- **Secondary:** Orange accents
- **Neutral:** Gray scale

### Typography
- **Font:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700, 800, 900

### Components
- Consistent spacing (8px grid)
- Rounded corners (8px, 12px, 16px)
- Subtle shadows and blur effects
- Smooth animations and transitions

## 🔒 Security

### Data Protection
- Row Level Security on all tables
- Authenticated-only admin access
- Input validation and sanitization
- Secure file upload with type checking

### Environment Security
- Admin features disabled in production
- Environment-based access control
- No sensitive data in client bundle

## 📈 Performance

### Optimizations
- Code splitting by route and vendor
- Lazy loading for admin components
- Image optimization via CDN
- Efficient bundle management

### Monitoring
- Vercel Analytics integration
- Core Web Vitals tracking
- Error boundary implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions:
- Email: careerfairinvan@gmail.com
- Phone: 236-996-6136

## 🚀 Deployment Checklist

- [ ] Supabase project created and configured
- [ ] Environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Storage buckets and policies configured
- [ ] Admin user account created
- [ ] Production deployment tested
- [ ] Staging deployment with admin access verified
- [ ] Team member access confirmed

---

Built with ❤️ by the VIVA Events team for the Vancouver community.