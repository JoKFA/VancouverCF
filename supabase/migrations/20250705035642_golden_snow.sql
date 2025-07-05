/*
  # Create Storage Buckets for File Uploads

  1. Storage Buckets
    - `avatars` bucket for team member profile pictures (5MB limit, images only)
    - `blogs` bucket for event recap files (50MB limit, documents only)
  
  2. Security
    - Public read access for both buckets
    - Authenticated write access for both buckets
    - Proper RLS policies for file management
*/

-- Create avatars bucket for team member profile pictures
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Bucket already exists, do nothing
    NULL;
END $$;

-- Create blogs bucket for event recap files
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'blogs',
    'blogs',
    true,
    52428800, -- 50MB limit for documents
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Bucket already exists, do nothing
    NULL;
END $$;

-- Create storage policies for avatars bucket
DO $$
BEGIN
  -- Policy for authenticated users to upload avatars
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

  -- Policy for anyone to view avatars
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

  -- Policy for authenticated users to update avatars
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

  -- Policy for authenticated users to delete avatars
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

-- Create storage policies for blogs bucket
DO $$
BEGIN
  -- Policy for authenticated users to upload blogs
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

  -- Policy for anyone to view blogs
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

  -- Policy for authenticated users to update blogs
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

  -- Policy for authenticated users to delete blogs
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