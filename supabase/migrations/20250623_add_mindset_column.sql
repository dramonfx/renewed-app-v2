
-- Add mindset column to reflections table for spiritual discernment
-- Migration: 20250623_add_mindset_column.sql
-- Created: 2025-06-23
-- Purpose: Add mindset tracking for Natural Mind vs Spiritual Mind discernment

-- Add mindset column to reflections table
ALTER TABLE public.reflections 
ADD COLUMN IF NOT EXISTS mindset VARCHAR(20) 
CHECK (mindset IN ('Natural', 'Transition', 'Spiritual'));

-- Set a default value for existing records (optional - can be left NULL)
-- UPDATE public.reflections SET mindset = 'Transition' WHERE mindset IS NULL;

-- Create index for mindset filtering
CREATE INDEX IF NOT EXISTS idx_reflections_mindset ON public.reflections(mindset);
CREATE INDEX IF NOT EXISTS idx_reflections_user_mindset ON public.reflections(user_id, mindset);

-- Update the user_reflections view to include mindset
DROP VIEW IF EXISTS public.user_reflections;

CREATE OR REPLACE VIEW public.user_reflections AS
SELECT 
    r.id,
    r.question_text,
    r.answer_text,
    r.reflection_type,
    r.mindset,
    r.tags,
    r.created_at,
    r.updated_at,
    u.email as user_email,
    LENGTH(r.answer_text) as answer_length,
    DATE(r.created_at) as reflection_date
FROM public.reflections r
JOIN auth.users u ON r.user_id = u.id
WHERE r.user_id = auth.uid();

-- Grant access to the updated view
GRANT SELECT ON public.user_reflections TO authenticated;

-- Update the reflection statistics function to include mindset stats
CREATE OR REPLACE FUNCTION public.get_user_reflection_stats(target_user_id UUID DEFAULT auth.uid())
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    -- Ensure user can only get their own stats
    IF target_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Access denied: can only view own reflection statistics';
    END IF;
    
    SELECT json_build_object(
        'total_reflections', COUNT(*),
        'reflections_this_week', COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days'),
        'reflections_this_month', COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days'),
        'average_length', ROUND(AVG(LENGTH(answer_text))),
        'reflection_types', json_object_agg(
            reflection_type, 
            COUNT(*) FILTER (WHERE reflection_type IS NOT NULL)
        ),
        'mindset_distribution', json_object_agg(
            mindset, 
            COUNT(*) FILTER (WHERE mindset IS NOT NULL)
        ),
        'spiritual_growth_trend', (
            SELECT json_build_object(
                'natural_mind', COUNT(*) FILTER (WHERE mindset = 'Natural'),
                'in_transition', COUNT(*) FILTER (WHERE mindset = 'Transition'),
                'spiritual_mind', COUNT(*) FILTER (WHERE mindset = 'Spiritual'),
                'spiritual_percentage', ROUND(
                    (COUNT(*) FILTER (WHERE mindset = 'Spiritual')::FLOAT / 
                     NULLIF(COUNT(*) FILTER (WHERE mindset IS NOT NULL), 0) * 100), 1
                )
            )
        ),
        'first_reflection', MIN(created_at),
        'latest_reflection', MAX(created_at)
    ) INTO stats
    FROM public.reflections
    WHERE user_id = target_user_id;
    
    RETURN COALESCE(stats, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the search function to include mindset filtering
CREATE OR REPLACE FUNCTION public.search_user_reflections(
    search_query TEXT,
    reflection_type_filter VARCHAR(50) DEFAULT NULL,
    mindset_filter VARCHAR(20) DEFAULT NULL,
    limit_results INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    answer_text TEXT,
    reflection_type VARCHAR(50),
    mindset VARCHAR(20),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    relevance_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.question_text,
        r.answer_text,
        r.reflection_type,
        r.mindset,
        r.tags,
        r.created_at,
        r.updated_at,
        (
            ts_rank(
                to_tsvector('english', r.question_text || ' ' || r.answer_text),
                plainto_tsquery('english', search_query)
            )
        )::REAL as relevance_score
    FROM public.reflections r
    WHERE r.user_id = auth.uid()
        AND (
            to_tsvector('english', r.question_text || ' ' || r.answer_text) @@ plainto_tsquery('english', search_query)
            OR r.question_text ILIKE '%' || search_query || '%'
            OR r.answer_text ILIKE '%' || search_query || '%'
            OR search_query = ANY(r.tags)
        )
        AND (reflection_type_filter IS NULL OR r.reflection_type = reflection_type_filter)
        AND (mindset_filter IS NULL OR r.mindset = mindset_filter)
    ORDER BY relevance_score DESC, r.created_at DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add helpful comments for the mindset column
COMMENT ON COLUMN public.reflections.mindset IS 'Tracks spiritual discernment: Natural (fear/anxiety), Transition (moving toward spiritual), Spiritual (love/peace)';

