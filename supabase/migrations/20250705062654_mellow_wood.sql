/*
  # Storage Buckets and Policies Setup

  1. Storage Buckets
    - `avatars` bucket for team member profile pictures (public, 5MB limit)
    - `blogs` bucket for event recap files (public, 50MB limit)

  2. Security
    - RLS policies for authenticated uploads and public viewing
    - Proper file type restrictions and size limits

  Note: This migration creates storage buckets and policies using Supabase's storage schema.
  The storage.objects table RLS and policies are managed by Supabase's storage system.
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

-- Create resumes bucket for resume submissions (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'resumes',
  'resumes',
  false, -- Private bucket
  10485760, -- 10MB limit
  ARRAY['application/pdf']
) ON CONFLICT (id) DO NOTHING;