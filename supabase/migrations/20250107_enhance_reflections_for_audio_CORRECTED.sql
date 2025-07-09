
-- CORRECTED: Enhance reflections table for Deep Reflection Audio Features
-- Migration: 20250107_enhance_reflections_for_audio_CORRECTED.sql  
-- Created: 2025-01-07 (Corrected Version)
-- Purpose: Add audio timestamp and section reference support for Deep Reflections
-- 
-- FIXES:
-- - Ensures reflection_type column exists before adding constraints
-- - Proper SQL ordering (columns first, then constraints)
-- - Safe handling of existing data
-- - Better error handling and rollback safety

-- Begin transaction for safety
BEGIN;

-- STEP 1: Add base columns first (including reflection_type if missing)
DO $$ 
BEGIN
    -- Add reflection_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'reflection_type') THEN
        ALTER TABLE public.reflections ADD COLUMN reflection_type VARCHAR(50) DEFAULT 'general';
        RAISE NOTICE 'Added reflection_type column';
    END IF;
    
    -- Add tags column if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'tags') THEN
        ALTER TABLE public.reflections ADD COLUMN tags TEXT[] DEFAULT '{}';
        RAISE NOTICE 'Added tags column';
    END IF;
    
    -- Add section_id to link reflections to book sections
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'section_id') THEN
        ALTER TABLE public.reflections ADD COLUMN section_id TEXT;
        RAISE NOTICE 'Added section_id column';
    END IF;
    
    -- Add audio_timestamp for precise timing within audio tracks
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'audio_timestamp') THEN
        ALTER TABLE public.reflections ADD COLUMN audio_timestamp DECIMAL(10,2);
        RAISE NOTICE 'Added audio_timestamp column';
    END IF;
    
    -- Add section_title for easy display without joins
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'section_title') THEN
        ALTER TABLE public.reflections ADD COLUMN section_title TEXT;
        RAISE NOTICE 'Added section_title column';
    END IF;
    
    -- Add audio_title for the specific audio track title
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'audio_title') THEN
        ALTER TABLE public.reflections ADD COLUMN audio_title TEXT;
        RAISE NOTICE 'Added audio_title column';
    END IF;
    
    RAISE NOTICE 'All required columns have been added successfully';
END $$;

-- STEP 2: Now handle the reflection_type constraint (after column exists)
DO $$
BEGIN
    -- First, check if any existing constraint exists and drop it
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'reflections_reflection_type_check' 
               AND table_name = 'reflections') THEN
        ALTER TABLE public.reflections DROP CONSTRAINT reflections_reflection_type_check;
        RAISE NOTICE 'Dropped existing reflection_type constraint';
    END IF;
    
    -- Add the new constraint with 'deep_reflection' included
    ALTER TABLE public.reflections ADD CONSTRAINT reflections_reflection_type_check 
        CHECK (reflection_type IN ('general', 'assessment', 'daily', 'intention', 'completion', 'deep_reflection'));
    
    RAISE NOTICE 'Added updated reflection_type constraint with deep_reflection support';
END $$;

-- STEP 3: Create indexes for better query performance on audio reflections
CREATE INDEX IF NOT EXISTS idx_reflections_section_id ON public.reflections(section_id);
CREATE INDEX IF NOT EXISTS idx_reflections_user_section ON public.reflections(user_id, section_id);
CREATE INDEX IF NOT EXISTS idx_reflections_audio_timestamp ON public.reflections(audio_timestamp);
CREATE INDEX IF NOT EXISTS idx_reflections_user_section_timestamp ON public.reflections(user_id, section_id, audio_timestamp);
CREATE INDEX IF NOT EXISTS idx_reflections_type ON public.reflections(reflection_type);
CREATE INDEX IF NOT EXISTS idx_reflections_user_type ON public.reflections(user_id, reflection_type);

-- STEP 4: Add helpful comments for the new audio-specific fields
COMMENT ON COLUMN public.reflections.reflection_type IS 'Type of reflection: general, assessment, daily, intention, completion, deep_reflection';
COMMENT ON COLUMN public.reflections.section_id IS 'Reference to the book section where this reflection was captured';
COMMENT ON COLUMN public.reflections.audio_timestamp IS 'Timestamp in seconds where the reflection was captured in the audio';
COMMENT ON COLUMN public.reflections.section_title IS 'Title of the section for display purposes';
COMMENT ON COLUMN public.reflections.audio_title IS 'Title of the specific audio track';
COMMENT ON COLUMN public.reflections.tags IS 'Array of tags for categorizing and searching reflections';

-- STEP 5: Create a specialized view for deep reflections
DROP VIEW IF EXISTS public.deep_reflections_view;

CREATE OR REPLACE VIEW public.deep_reflections_view AS
SELECT 
    r.id,
    r.user_id,
    r.section_id,
    r.section_title,
    r.audio_title,
    r.audio_timestamp,
    r.answer_text as reflection_content,
    r.tags,
    r.created_at,
    r.updated_at,
    LENGTH(r.answer_text) as content_length,
    DATE(r.created_at) as reflection_date,
    -- Format timestamp as MM:SS for display
    CASE 
        WHEN r.audio_timestamp IS NOT NULL THEN
            LPAD(FLOOR(r.audio_timestamp / 60)::TEXT, 2, '0') || ':' || 
            LPAD(FLOOR(r.audio_timestamp % 60)::TEXT, 2, '0')
        ELSE NULL
    END as formatted_timestamp
FROM public.reflections r
WHERE r.user_id = auth.uid() 
    AND r.reflection_type = 'deep_reflection'
ORDER BY r.created_at DESC;

-- Grant access to the deep reflections view
GRANT SELECT ON public.deep_reflections_view TO authenticated;

COMMENT ON VIEW public.deep_reflections_view IS 'Specialized view for deep reflections captured during audio playback';

-- STEP 6: Create a function to get reflections for a specific section
CREATE OR REPLACE FUNCTION public.get_section_reflections(
    target_section_id TEXT,
    limit_results INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    section_title TEXT,
    audio_title TEXT,
    audio_timestamp DECIMAL(10,2),
    reflection_content TEXT,
    formatted_timestamp TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.section_title,
        r.audio_title,
        r.audio_timestamp,
        r.answer_text as reflection_content,
        CASE 
            WHEN r.audio_timestamp IS NOT NULL THEN
                LPAD(FLOOR(r.audio_timestamp / 60)::TEXT, 2, '0') || ':' || 
                LPAD(FLOOR(r.audio_timestamp % 60)::TEXT, 2, '0')
            ELSE NULL
        END as formatted_timestamp,
        r.created_at
    FROM public.reflections r
    WHERE r.user_id = auth.uid()
        AND r.section_id = target_section_id
        AND r.reflection_type = 'deep_reflection'
    ORDER BY r.audio_timestamp ASC, r.created_at DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_section_reflections TO authenticated;

COMMENT ON FUNCTION public.get_section_reflections IS 'Get all deep reflections for a specific section, ordered by audio timestamp';

-- STEP 7: Create a function to check if user has any deep reflections (for nav display)
CREATE OR REPLACE FUNCTION public.user_has_reflections(target_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
    has_reflections BOOLEAN;
BEGIN
    -- Ensure user can only check their own reflections
    IF target_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: can only check own reflections';
    END IF;
    
    SELECT EXISTS(
        SELECT 1 FROM public.reflections 
        WHERE user_id = target_user_id 
            AND reflection_type = 'deep_reflection'
    ) INTO has_reflections;
    
    RETURN COALESCE(has_reflections, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.user_has_reflections TO authenticated;

COMMENT ON FUNCTION public.user_has_reflections IS 'Check if user has any deep reflections for navigation display';

-- Commit the transaction
COMMIT;

-- Final verification queries (optional - can be run separately)
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'reflections' 
-- ORDER BY ordinal_position;

-- SELECT constraint_name, constraint_type 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'reflections';

RAISE NOTICE 'Migration completed successfully! Deep Reflections feature is now ready.';
