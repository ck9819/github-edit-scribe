
-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow anyone to upload images
CREATE POLICY "Allow upload of item images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'item-images');

-- Create policy to allow anyone to view images
CREATE POLICY "Allow public access to item images" ON storage.objects
FOR SELECT USING (bucket_id = 'item-images');

-- Create policy to allow delete of item images
CREATE POLICY "Allow delete of item images" ON storage.objects
FOR DELETE USING (bucket_id = 'item-images');
