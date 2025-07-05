/*
  # Create storage buckets and policies

  1. Storage Buckets
    - `avatars` bucket for team member profile pictures (5MB limit, images only)
    - `blogs` bucket for event recap files (50MB limit, documents only)

  2. Storage Policies
    - Avatars: Authenticated users can manage, public can view
    - Blogs: Authenticated users can manage, public can view

  Note: RLS is already enabled on storage.objects in Supabase by default
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

-- Storage policies for avatars bucket
-- Check if policies exist before creating them
DO $$
BEGIN
  -- Policy for uploading avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload avatars'
  ) THEN
    CREATE POLICY "Authenticated users can upload avatars"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'avatars');
  END IF;

  -- Policy for viewing avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view avatars'
  ) THEN
    CREATE POLICY "Anyone can view avatars"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'avatars');
  END IF;

  -- Policy for updating avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update avatars'
  ) THEN
    CREATE POLICY "Authenticated users can update avatars"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'avatars');
  END IF;

  -- Policy for deleting avatars
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete avatars'
  ) THEN
    CREATE POLICY "Authenticated users can delete avatars"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'avatars');
  END IF;
END $$;

-- Storage policies for blogs bucket
DO $$
BEGIN
  -- Policy for uploading blogs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload blogs'
  ) THEN
    CREATE POLICY "Authenticated users can upload blogs"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'blogs');
  END IF;

  -- Policy for viewing blogs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can view blogs'
  ) THEN
    CREATE POLICY "Anyone can view blogs"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'blogs');
  END IF;

  -- Policy for updating blogs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update blogs'
  ) THEN
    CREATE POLICY "Authenticated users can update blogs"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'blogs');
  END IF;

  -- Policy for deleting blogs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete blogs'
  ) THEN
    CREATE POLICY "Authenticated users can delete blogs"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'blogs');
  END IF;
END $$;