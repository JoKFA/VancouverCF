/*
  # Vancouver Career Fair Database Setup

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `date` (date, required)
      - `location` (text, required)
      - `description` (text, required)
      - `image_url` (text, optional)
      - `status` (text, required, default 'upcoming')
      - `recap_file_url` (text, optional)
      - `created_at` (timestamp)
    - `resumes`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, required)
      - `file_url` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public can view events and submit resumes
    - Authenticated users can manage events and view resumes

  3. Storage
    - Create buckets for resumes and blog files
    - Set appropriate access policies
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
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

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone"
  ON events
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Resumes policies
CREATE POLICY "Anyone can submit resumes"
  ON resumes
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view resumes"
  ON resumes
  FOR SELECT
  TO authenticated
  USING (true);

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