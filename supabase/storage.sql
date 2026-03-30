-- Run this in your Supabase SQL editor to set up storage buckets

-- Create buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true) ON CONFLICT DO NOTHING;

-- Allow public read on both buckets
CREATE POLICY "Public read avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Public read portfolio" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Auth upload avatars" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Auth upload portfolio" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own files
CREATE POLICY "Auth delete avatars" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Auth delete portfolio" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
