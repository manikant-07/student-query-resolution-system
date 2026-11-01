-- ==============================================================================
-- MIGRATION: Add course and is_profile_complete to public.profiles
-- Supports Student Academic Profile Completion & Google OAuth Onboarding
-- ==============================================================================

-- 1. Add course/degree column if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS course TEXT DEFAULT 'B.Tech - Artificial Intelligence & Data Science';

-- 2. Add is_profile_complete flag if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_profile_complete BOOLEAN DEFAULT FALSE;

-- 3. Update existing profiles that already have full academic records
UPDATE public.profiles 
SET is_profile_complete = TRUE 
WHERE enrollment_number IS NOT NULL 
  AND department IS NOT NULL 
  AND semester IS NOT NULL;

-- 4. Refresh schema cache
NOTIFY pgrst, 'reload schema';

