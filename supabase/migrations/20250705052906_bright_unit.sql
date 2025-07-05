/*
  # Create storage buckets for avatars and blogs

  1. Storage Buckets
    - `avatars` bucket for team member profile pictures (5MB limit, images only)
    - `blogs` bucket for event recap files (50MB limit, documents only)
  
  2. Security
    - Public read access for both buckets
    - Authenticated write access for both buckets
    - Proper file type restrictions

  Note: Storage policies are managed through Supabase's storage system.
  The buckets and policies should be created through the Supabase dashboard
  or using the storage API, not through SQL migrations.
*/

-- Create a function to safely create storage buckets if they don't exist
-- This approach avoids direct table manipulation
DO $$
BEGIN
  -- Note: Storage buckets should be created through Supabase Dashboard
  -- Go to Storage > Create Bucket with these settings:
  
  -- Bucket: avatars
  -- - Public: true
  -- - File size limit: 5MB
  -- - Allowed MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp
  -- - Policies: 
  --   * SELECT: Allow public access
  --   * INSERT: Allow authenticated users
  --   * UPDATE: Allow authenticated users  
  --   * DELETE: Allow authenticated users
  
  -- Bucket: blogs
  -- - Public: true
  -- - File size limit: 50MB
  -- - Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
  -- - Policies:
  --   * SELECT: Allow public access
  --   * INSERT: Allow authenticated users
  --   * UPDATE: Allow authenticated users
  --   * DELETE: Allow authenticated users

  RAISE NOTICE 'Storage buckets should be created manually through Supabase Dashboard';
  RAISE NOTICE 'Required buckets: avatars (5MB, images), blogs (50MB, documents)';
END $$;