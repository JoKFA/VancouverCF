/*
  # Create storage buckets for avatars and blogs

  1. New Storage Buckets
    - `avatars` bucket for team member profile pictures
      - Public access for viewing
      - 5MB file size limit
      - Image file types only
    - `blogs` bucket for event recap files
      - Public access for viewing
      - 50MB file size limit
      - Document file types (PDF, Word)

  2. Security
    - Buckets configured with appropriate access levels
    - File size and type restrictions applied
    - Storage policies will be managed through Supabase dashboard

  Note: Storage policies for these buckets should be configured in the Supabase dashboard:
  - Avatars: Allow authenticated users to upload, everyone to view
  - Blogs: Allow authenticated users to upload, everyone to view
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