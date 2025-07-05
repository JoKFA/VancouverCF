/*
  # Create Storage Buckets for File Uploads

  1. Storage Buckets
    - `avatars` bucket for team member profile pictures (5MB limit, images only)
    - `blogs` bucket for event recap files (50MB limit, documents only)

  2. Security
    - Buckets are configured as public for read access
    - Upload restrictions based on file types and sizes
    - Supabase handles default storage policies automatically

  Note: Storage bucket policies are managed by Supabase's built-in system.
  Custom policies can be added through the Supabase dashboard if needed.
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