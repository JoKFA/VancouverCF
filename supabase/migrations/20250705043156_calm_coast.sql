/*
  # Storage Buckets Setup

  1. Storage Buckets
    - `avatars` bucket for team member profile pictures (5MB limit, images only)
    - `blogs` bucket for event recap files (50MB limit, documents only)
  
  2. Security
    - Public read access for both buckets
    - Authenticated write access for both buckets
    - Proper file type and size restrictions
*/

-- Create avatars bucket for team member profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create blogs bucket for event recap files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blogs',
  'blogs',
  true,
  52428800, -- 50MB limit for documents
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Note: RLS is already enabled on storage.objects by default in Supabase
-- Storage policies are managed through the Supabase dashboard or via the storage API
-- The following policies would typically be created through the Supabase interface:

-- For avatars bucket:
-- - SELECT: Allow public read access
-- - INSERT: Allow authenticated users to upload
-- - UPDATE: Allow authenticated users to update their uploads
-- - DELETE: Allow authenticated users to delete their uploads

-- For blogs bucket:
-- - SELECT: Allow public read access  
-- - INSERT: Allow authenticated users to upload
-- - UPDATE: Allow authenticated users to update their uploads
-- - DELETE: Allow authenticated users to delete their uploads