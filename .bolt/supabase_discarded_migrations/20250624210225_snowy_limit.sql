/*
  # Initial Schema Setup for Vancouver Career Fair Website

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, event title)
      - `date` (date, event date)
      - `location` (text, event location)
      - `description` (text, event description)
      - `image_url` (text, optional event image)
      - `status` (text, either 'upcoming' or 'past')
      - `recap_file_url` (text, optional blog file URL)
      - `created_at` (timestamp)

    - `resumes`
      - `id` (uuid, primary key)
      - `name` (text, applicant name)
      - `email` (text, applicant email)
      - `phone` (text, applicant phone)
      - `file_url` (text, resume file URL)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to events
    - Add policies for public insert access to resumes
    - Add policies for authenticated admin access to all operations

  3. Storage
    - Create storage buckets for resumes and blog files
    - Set up appropriate policies for file access
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

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('resumes', 'resumes', false),
  ('blogs', 'blogs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for resumes bucket
CREATE POLICY "Anyone can upload resumes"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can view resumes"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes');

-- Storage policies for blogs bucket
CREATE POLICY "Public can view blog files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blogs');

CREATE POLICY "Authenticated users can upload blog files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blogs');

-- Create admin user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'careerfairinvan@gmail.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;