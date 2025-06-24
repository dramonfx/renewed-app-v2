
-- Enhance reflections table for Sacred Journaling Workshop
-- Migration: 20250624004609_enhance_reflections_for_journal.sql
-- Created: 2025-06-24
-- Purpose: Add mindset field and optimize reflections table for journal interface

-- Add mindset column to existing reflections table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'mindset') THEN
        ALTER TABLE public.reflections ADD COLUMN mindset VARCHAR(50) CHECK (mindset IN ('Natural', 'Transition', 'Spiritual'));
    END IF;
END $$;

-- Add title column for better journal interface (maps to question_text but shorter)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'title') THEN
        ALTER TABLE public.reflections ADD COLUMN title TEXT;
    END IF;
END $$;

-- Create additional indexes for the new fields
CREATE INDEX IF NOT EXISTS idx_reflections_mindset ON public.reflections(mindset);
CREATE INDEX IF NOT EXISTS idx_reflections_user_mindset ON public.reflections(user_id, mindset);
CREATE INDEX IF NOT EXISTS idx_reflections_title ON public.reflections USING GIN(to_tsvector('english', title));

-- Update the existing RLS policies to be compatible with journal interface
-- (The existing policies already cover what we need, but let's ensure they're optimal)

-- Add helpful comments for the new fields
COMMENT ON COLUMN public.reflections.mindset IS 'Spiritual mindset classification: Natural, Transition, or Spiritual';
COMMENT ON COLUMN public.reflections.title IS 'Short title for the journal entry (optional, can fallback to question_text)';

-- Create a view specifically for journal entries that provides a cleaner interface
DROP VIEW IF EXISTS public.journal_entries_view;

CREATE OR REPLACE VIEW public.journal_entries_view AS
SELECT 
    r.id,
    r.user_id,
    COALESCE(r.title, LEFT(r.question_text, 100)) as title,
    r.question_text,
    r.answer_text as content,
    r.reflection_type,
    r.mindset,
    r.tags,
    r.created_at,
    r.updated_at,
    LENGTH(r.answer_text) as content_length,
    DATE(r.created_at) as entry_date
FROM public.reflections r
WHERE r.user_id = auth.uid()
ORDER BY r.created_at DESC;

-- Grant access to the journal view
GRANT SELECT ON public.journal_entries_view TO authenticated;

-- Enable RLS on the view (inherits from base table)
COMMENT ON VIEW public.journal_entries_view IS 'Journal-focused view of reflections with cleaner field names and computed fields';

-- Create a function for journal-specific statistics
CREATE OR REPLACE FUNCTION public.get_journal_stats(target_user_id UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    -- Ensure user can only get their own stats
    IF target_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: can only view own journal statistics';
    END IF;
    
    SELECT json_build_object(
        'total_entries', COUNT(*),
        'entries_this_week', COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'),
        'entries_this_month', COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days'),
        'average_content_length', ROUND(AVG(LENGTH(answer_text))),
        'mindset_counts', json_build_object(
            'Natural', COUNT(*) FILTER (WHERE mindset = 'Natural'),
            'Transition', COUNT(*) FILTER (WHERE mindset = 'Transition'),
            'Spiritual', COUNT(*) FILTER (WHERE mindset = 'Spiritual')
        ),
        'reflection_types', json_object_agg(
            reflection_type, 
            COUNT(*) FILTER (WHERE reflection_type IS NOT NULL)
        ),
        'first_entry', MIN(created_at),
        'latest_entry', MAX(created_at),
        'total_tags', array_length(array_agg(DISTINCT unnest(tags)), 1)
    ) INTO stats
    FROM public.reflections
    WHERE user_id = target_user_id;
    
    RETURN COALESCE(stats, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the journal stats function
GRANT EXECUTE ON FUNCTION public.get_journal_stats TO authenticated;

COMMENT ON FUNCTION public.get_journal_stats IS 'Returns comprehensive statistics about a user''s journal entries including mindset distribution';

-- Create a function for filtering journal entries by mindset and reflection type
CREATE OR REPLACE FUNCTION public.get_journal_entries(
    mindset_filter VARCHAR(50) DEFAULT NULL,
    reflection_type_filter VARCHAR(50) DEFAULT NULL,
    limit_entries INTEGER DEFAULT 50,
    offset_entries INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content TEXT,
    reflection_type VARCHAR(50),
    mindset VARCHAR(50),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    content_length INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        COALESCE(r.title, LEFT(r.question_text, 100)) as title,
        r.answer_text as content,
        r.reflection_type,
        r.mindset,
        r.tags,
        r.created_at,
        r.updated_at,
        LENGTH(r.answer_text)::INTEGER as content_length
    FROM public.reflections r
    WHERE r.user_id = auth.uid()
        AND (mindset_filter IS NULL OR r.mindset = mindset_filter)
        AND (reflection_type_filter IS NULL OR r.reflection_type = reflection_type_filter)
    ORDER BY r.created_at DESC
    LIMIT limit_entries
    OFFSET offset_entries;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the journal entries function
GRANT EXECUTE ON FUNCTION public.get_journal_entries TO authenticated;

COMMENT ON FUNCTION public.get_journal_entries IS 'Filtered retrieval of journal entries with pagination and mindset/type filtering';
