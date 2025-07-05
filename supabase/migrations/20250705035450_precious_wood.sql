/*
  # Create team_members table

  1. New Tables
    - `team_members`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `title` (text, required) 
      - `bio` (text, required)
      - `avatar_url` (text, optional)
      - `order_index` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `team_members` table
    - Add policy for public to read team members
    - Add policy for authenticated users to manage team members
*/

CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text NOT NULL,
  avatar_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are viewable by everyone"
  ON team_members
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);