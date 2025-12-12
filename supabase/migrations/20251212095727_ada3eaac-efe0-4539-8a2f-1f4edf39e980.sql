-- Create trigger for new user registration if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Create RLS policies for storage buckets to allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

CREATE POLICY "Public can view videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Admins and editors can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (public.is_admin_or_editor(auth.uid()));

CREATE POLICY "Admins and editors can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (public.is_admin_or_editor(auth.uid()));