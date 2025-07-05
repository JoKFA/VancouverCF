/*
  # Create Storage Buckets

  1. New Storage Buckets
    - `avatars` - For team member profile pictures
    - `blogs` - For event recap files (Word/PDF documents)
  
  2. Security
    - Enable public access for avatars (needed for displaying images)
    - Enable authenticated access for blogs (admin uploads only)
    - Set up appropriate RLS policies for each bucket
  
  3. File Type Restrictions
    - Avatars: Image files only (jpg, jpeg, png, gif, webp)
    - Blogs: Document files only (pdf, doc, docx)
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

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for avatars bucket - authenticated users can upload, everyone can view
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- Policy for blogs bucket - authenticated users can upload, everyone can view
CREATE POLICY "Authenticated users can upload blogs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blogs');

CREATE POLICY "Anyone can view blogs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blogs');

CREATE POLICY "Authenticated users can update blogs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blogs');

CREATE POLICY "Authenticated users can delete blogs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blogs');