/*
  # Initial Database Setup

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `date` (date)
      - `location` (text)
      - `description` (text)
      - `image_url` (text, optional)
      - `status` (text, check constraint for 'upcoming'/'past')
      - `recap_file_url` (text, optional)
      - `created_at` (timestamp)
    - `resumes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `file_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public can view events and submit resumes
    - Authenticated users can manage events and view resumes

  3. Storage
    - Create storage buckets for resumes and blogs
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

-- Events policies (use IF NOT EXISTS equivalent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'events' AND policyname = 'Events are viewable by everyone'
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
    WHERE tablename = 'events' AND policyname = 'Authenticated users can manage events'
  ) THEN
    CREATE POLICY "Authenticated users can manage events"
      ON events
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- Resumes policies (use IF NOT EXISTS equivalent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'resumes' AND policyname = 'Anyone can submit resumes'
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
    WHERE tablename = 'resumes' AND policyname = 'Authenticated users can view resumes'
  ) THEN
    CREATE POLICY "Authenticated users can view resumes"
      ON resumes
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('resumes', 'resumes', false),
  ('blogs', 'blogs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes bucket (use IF NOT EXISTS equivalent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Anyone can upload resumes'
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
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can view resumes'
  ) THEN
    CREATE POLICY "Authenticated users can view resumes"
      ON storage.objects
      FOR SELECT
      TO authenticated
      USING (bucket_id = 'resumes');
  END IF;
END $$;

-- Storage policies for blogs bucket (use IF NOT EXISTS equivalent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public can view blog files'
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
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can upload blog files'
  ) THEN
    CREATE POLICY "Authenticated users can upload blog files"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'blogs');
  END IF;
END $$;