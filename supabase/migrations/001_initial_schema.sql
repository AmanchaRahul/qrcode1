-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_images_user_id ON images(user_id);

-- Enable Row Level Security
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own images
CREATE POLICY "Users can view their own images"
  ON images
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can only insert their own images
CREATE POLICY "Users can insert their own images"
  ON images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can only delete their own images
CREATE POLICY "Users can delete their own images"
  ON images
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage bucket for private images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Users can upload to their own folder
CREATE POLICY "Users can upload images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policy: Users can read their own images
CREATE POLICY "Users can view their own images"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policy: Users can delete their own images
CREATE POLICY "Users can delete their own images"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
