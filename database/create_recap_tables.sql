-- SQL commands to create the new event recap system tables
-- Run these commands in your Supabase SQL editor

-- Create event_recaps table
CREATE TABLE IF NOT EXISTS event_recaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT,
  content_blocks JSONB NOT NULL DEFAULT '[]',
  featured_image_url TEXT,
  seo_meta JSONB DEFAULT '{"description": "", "keywords": []}',
  published BOOLEAN DEFAULT false,
  author_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function (if it doesn't exist already)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_event_recaps_updated_at 
  BEFORE UPDATE ON event_recaps 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_event_recaps_event_id ON event_recaps(event_id);
CREATE INDEX IF NOT EXISTS idx_event_recaps_published ON event_recaps(published);
CREATE INDEX IF NOT EXISTS idx_event_recaps_created_at ON event_recaps(created_at);

-- Add Row Level Security (RLS) policies
ALTER TABLE event_recaps ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published recaps
CREATE POLICY "Anyone can view published recaps" ON event_recaps
  FOR SELECT USING (published = true);

-- Policy: Authenticated users can view all recaps (for admin)
CREATE POLICY "Authenticated users can view all recaps" ON event_recaps
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can insert recaps
CREATE POLICY "Authenticated users can insert recaps" ON event_recaps
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Authenticated users can update recaps
CREATE POLICY "Authenticated users can update recaps" ON event_recaps
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Authenticated users can delete recaps
CREATE POLICY "Authenticated users can delete recaps" ON event_recaps
  FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the table was created successfully
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'event_recaps' 
ORDER BY ordinal_position;