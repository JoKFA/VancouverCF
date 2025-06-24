/*
  # Create sermons table

  1. New Tables
    - `sermons`
      - `id` (uuid, primary key) - Unique identifier for each sermon
      - `title` (text, required) - The sermon title
      - `speaker` (text, required) - Name of the speaker/pastor
      - `date` (date, required) - Date when the sermon was delivered
      - `description` (text, optional) - Brief description of the sermon content
      - `video_url` (text, optional) - URL to video recording
      - `audio_url` (text, optional) - URL to audio recording
      - `scripture_reference` (text, optional) - Bible verses referenced
      - `series` (text, optional) - Sermon series name
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - When the record was last updated

  2. Security
    - Enable RLS on `sermons` table
    - Add policy for public read access (anyone can view sermons)
    - Add policy for authenticated users to manage sermons (admin functionality)
*/

-- Create the sermons table
CREATE TABLE IF NOT EXISTS sermons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  speaker text NOT NULL,
  date date NOT NULL,
  description text DEFAULT '',
  video_url text DEFAULT '',
  audio_url text DEFAULT '',
  scripture_reference text DEFAULT '',
  series text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public read access to sermons
CREATE POLICY "Anyone can view sermons"
  ON sermons
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert sermons
CREATE POLICY "Authenticated users can create sermons"
  ON sermons
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update sermons
CREATE POLICY "Authenticated users can update sermons"
  ON sermons
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete sermons
CREATE POLICY "Authenticated users can delete sermons"
  ON sermons
  FOR DELETE
  TO authenticated
  USING (true);

-- Create an index on the date column for better query performance
CREATE INDEX IF NOT EXISTS idx_sermons_date ON sermons(date DESC);

-- Create an index on the series column for filtering
CREATE INDEX IF NOT EXISTS idx_sermons_series ON sermons(series);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_sermons_updated_at
  BEFORE UPDATE ON sermons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();