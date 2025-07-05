/*
  # Safe Database Setup for Events and Resumes

  1. New Tables
    - `events` - Event management with title, date, location, description, image_url, status, recap_file_url
    - `resumes` - Resume submissions with name, email, phone, file_url
  
  2. Security
    - Enable RLS on both tables
    - Public can view events and submit resumes
    - Authenticated users can manage events and view resumes
  
  3. Storage
    - Create storage buckets for resumes and blogs
    - Set appropriate access policies for file uploads
  
  4. Safety
    - All operations check for existing objects to prevent conflicts
    - Uses conditional logic to avoid duplicate creation errors
*/

-- Create events table safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    CREATE TABLE events (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      date date NOT NULL,
      location text NOT NULL,
      description text NOT NULL,
      image_url text,
      status text NOT NULL CHECK (status IN ('upcoming', 'past')) DEFAULT 'upcoming',
      recap_file_url text,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Create resumes table safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'resumes') THEN
    CREATE TABLE resumes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      file_url text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable Row Level Security safely
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    ALTER TABLE events ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'resumes') THEN
    ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create events policies safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'events' 
    AND policyname = 'Events are viewable by everyone'
  ) THEN
    CREATE POLICY "Events are viewable by everyone"
      ON events
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'events' 
    AND policyname = 'Authenticated users can manage events'
  ) THEN
    CREATE POLICY "Authenticated users can manage events"
      ON events
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Create resumes policies safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'resumes' 
    AND policyname = 'Anyone can submit resumes'
  ) THEN
    CREATE POLICY "Anyone can submit resumes"
      ON resumes
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'resumes' 
    AND policyname = 'Authenticated users can view resumes'
  ) THEN
    CREATE POLICY "Authenticated users can view resumes"
      ON resumes
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create storage buckets safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'resumes') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'blogs') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('blogs', 'blogs', true);
  END IF;
END $$;

-- Storage policies for resumes bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Anyone can upload resumes'
  ) THEN
    CREATE POLICY "Anyone can upload resumes"
      ON storage.objects
      FOR INSERT
      TO public
      WITH CHECK (bucket_id = 'resumes');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can view resumes'
  ) THEN
    CREATE POLICY "Authenticated users can view resumes"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (bucket_id = 'resumes');
  END IF;
END $$;

-- Storage policies for blogs bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view blog files'
  ) THEN
    CREATE POLICY "Public can view blog files"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'blogs');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload blog files'
  ) THEN
    CREATE POLICY "Authenticated users can upload blog files"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'blogs');
  END IF;
END $$;