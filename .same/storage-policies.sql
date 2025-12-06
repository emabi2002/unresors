-- STORAGE POLICIES FOR UNRE APPLICATION SYSTEM
-- Run this in Supabase SQL Editor

-- ============================================
-- APPLICATION-DOCUMENTS BUCKET POLICIES
-- ============================================

-- Allow anyone to upload (for application submissions)
CREATE POLICY "Allow public uploads to application-documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'application-documents');

-- Allow anyone to view their own uploads
CREATE POLICY "Allow public to view application-documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'application-documents');

-- Allow staff to view all application documents
CREATE POLICY "Allow staff to view all application-documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'application-documents'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('registrar', 'admissions', 'finance', 'ict_admin')
  )
);

-- ============================================
-- STUDENT-PHOTOS BUCKET POLICIES
-- ============================================

-- Allow anyone to upload (for application submissions)
CREATE POLICY "Allow public uploads to student-photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'student-photos');

-- Public bucket - anyone can view
CREATE POLICY "Allow public to view student-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'student-photos');

-- ============================================
-- OFFER-LETTERS BUCKET POLICIES
-- ============================================

-- Only authenticated users can upload offer letters
CREATE POLICY "Allow staff to upload offer-letters"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'offer-letters'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('registrar', 'admissions', 'ict_admin')
  )
);

-- Students can view their own offer letters
CREATE POLICY "Allow users to view offer-letters"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'offer-letters');

-- ============================================
-- RECEIPTS BUCKET POLICIES
-- ============================================

-- Only finance staff can upload receipts
CREATE POLICY "Allow finance to upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'receipts'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('finance', 'ict_admin')
  )
);

-- Students can view their own receipts
CREATE POLICY "Allow users to view receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'receipts');

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Storage policies created successfully!';
  RAISE NOTICE '✅ application-documents: Public upload enabled';
  RAISE NOTICE '✅ student-photos: Public upload enabled';
  RAISE NOTICE '✅ offer-letters: Staff upload only';
  RAISE NOTICE '✅ receipts: Finance upload only';
  RAISE NOTICE '========================================';
END $$;
