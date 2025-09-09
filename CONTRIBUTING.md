# Contributing

This guide covers local development and how to contribute to the Vancouver Career Fair website.

## Quick Start

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

## Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:staging # Build with admin features
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## Environment Variables
```bash
# Required
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional
VITE_ADMIN_ENABLED=true  # Enable admin features (default: true in dev)
```

## Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment options and security guidelines.

## Database Setup
Detailed database configuration instructions are available in [DATABASE_SETUP.md](DATABASE_SETUP.md).

## How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run lint and type checks
5. Submit a pull request

