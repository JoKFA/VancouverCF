# Event Recap System - Database Setup Guide

This guide will help you set up the database tables required for the new structured event recap system.

## 📋 Prerequisites

- Access to your Supabase dashboard
- Admin access to run SQL commands
- Existing `events` table (should already be set up)

## 🗄️ Database Tables Required

### New Tables to Create:
1. **`event_recaps`** - Stores structured event recap content

### Existing Tables (should already exist):
1. **`events`** - Your existing events table

## 🚀 Setup Instructions

### Step 1: Create Database Tables

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `database/create_recap_tables.sql`
4. Click **Run** to execute the SQL commands

### Step 2: Verify Setup

Run the database verification script to ensure everything is set up correctly:

```bash
# In your terminal, from the project root:
cd VancouverCF
npm run dev

# Then in browser console (F12):
window.runDatabaseVerification()
```

Or check manually in Supabase:
1. Go to **Table Editor**
2. Verify you can see the `event_recaps` table
3. Check that it has all the required columns

## 📊 Database Schema

### `event_recaps` Table Structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `event_id` | UUID | Foreign key to events table |
| `title` | TEXT | Recap title |
| `summary` | TEXT | Brief recap summary |
| `content_blocks` | JSONB | Structured content blocks |
| `featured_image_url` | TEXT | Optional hero image URL |
| `seo_meta` | JSONB | SEO metadata (description, keywords) |
| `published` | BOOLEAN | Publication status |
| `author_id` | UUID | Optional author reference |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |

### Content Blocks Structure (stored as JSONB):

```typescript
{
  id: string,
  type: 'text' | 'image_gallery' | 'statistics' | 'quote' | 'highlights' | 'attendee_feedback',
  order: number,
  content: {
    // Type-specific content structure
    // See TypeScript interfaces in src/lib/supabase.ts for details
  }
}
```

## 🔒 Row Level Security (RLS)

The setup includes these security policies:

- **Public Access**: Anyone can view published recaps
- **Admin Access**: Authenticated users can view, create, update, and delete all recaps
- **Draft Protection**: Unpublished recaps are only visible to authenticated users

## 🔄 Migration Process

After database setup, you can migrate existing events:

1. Go to **Admin Panel** (`/admin`)
2. Click **Event Recaps** tab
3. Click **Run Migration** button
4. Review migrated content and customize as needed

## ✅ Verification Checklist

- [ ] `event_recaps` table created successfully
- [ ] All columns present with correct data types
- [ ] RLS policies applied
- [ ] Indexes created for performance
- [ ] Triggers set up for `updated_at`
- [ ] Test insert/update/delete operations work
- [ ] Migration script runs without errors

## 🐛 Troubleshooting

### Common Issues:

1. **"relation 'event_recaps' does not exist"**
   - Solution: Run the SQL setup script in Supabase SQL Editor

2. **"permission denied for table event_recaps"**
   - Solution: Check RLS policies are set up correctly

3. **"foreign key constraint violation"**
   - Solution: Ensure the `events` table exists and has data

4. **Migration fails**
   - Check that events exist in your database
   - Verify Supabase connection is working
   - Check browser console for detailed error messages

### Getting Help:

If you encounter issues:
1. Check browser console for error messages
2. Verify Supabase connection settings
3. Ensure database user has necessary permissions
4. Run the verification script for detailed diagnostics

## 🎯 Next Steps

Once database setup is complete:

1. **Test the Admin Interface**: Go to `/admin` and check the Event Recaps tab
2. **Run Migration**: Migrate your existing events to the new system
3. **Create Sample Recaps**: Generate sample content to test the display
4. **Customize Content**: Replace sample data with real statistics and testimonials
5. **Publish Recaps**: Make them live on your events page

## 📚 Additional Resources

- **TypeScript Interfaces**: `src/lib/supabase.ts` - Complete type definitions
- **Migration Service**: `src/lib/migration.ts` - Handles converting legacy recaps
- **Admin Interface**: `src/components/admin/EventRecapManager.tsx` - Recap management UI
- **Public Display**: `src/pages/BlogPage.tsx` - How recaps are shown to users