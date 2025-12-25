-- Allow authenticated users to submit stories as drafts (not published)
CREATE POLICY "Authenticated users can submit draft stories"
ON public.stories
FOR INSERT
WITH CHECK (
  auth.uid() = author_id
  AND COALESCE(is_published, false) = false
);

-- (Optional safety) Ensure existing published stories policy still applies (no change)
-- No other policies modified.