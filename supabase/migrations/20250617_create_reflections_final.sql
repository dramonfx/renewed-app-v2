-- Create reflections table for storing user journal entries and assessment responses
-- Migration: 20250617_create_reflections_final.sql
-- Created: 2025-06-17
-- Purpose: Final journaling implementation for Renewed app with enhanced features

-- Create the reflections table (if not exists from previous migration)
CREATE TABLE IF NOT EXISTS public.reflections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    reflection_type VARCHAR(50) DEFAULT 'general' CHECK (reflection_type IN ('general', 'assessment', 'daily', 'intention', 'completion')),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add new columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'reflection_type') THEN
        ALTER TABLE public.reflections ADD COLUMN reflection_type VARCHAR(50) DEFAULT 'general' CHECK (reflection_type IN ('general', 'assessment', 'daily', 'intention', 'completion'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reflections' AND column_name = 'tags') THEN
        ALTER TABLE public.reflections ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON public.reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_created_at ON public.reflections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_user_created ON public.reflections(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_type ON public.reflections(reflection_type);
CREATE INDEX IF NOT EXISTS idx_reflections_user_type ON public.reflections(user_id, reflection_type);
CREATE INDEX IF NOT EXISTS idx_reflections_tags ON public.reflections USING GIN(tags);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS trigger_reflections_updated_at ON public.reflections;
CREATE TRIGGER trigger_reflections_updated_at
    BEFORE UPDATE ON public.reflections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.reflections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can insert their own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can update their own reflections" ON public.reflections;
DROP POLICY IF EXISTS "Users can delete their own reflections" ON public.reflections;

-- Create RLS policies

-- Policy: Users can only view their own reflections
CREATE POLICY "Users can view their own reflections" ON public.reflections
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can only insert their own reflections
CREATE POLICY "Users can insert their own reflections" ON public.reflections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own reflections
CREATE POLICY "Users can update their own reflections" ON public.reflections
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own reflections
CREATE POLICY "Users can delete their own reflections" ON public.reflections
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reflections TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Add helpful comments
COMMENT ON TABLE public.reflections IS 'Stores user journal entries, assessment responses, and reflections with enhanced categorization';
COMMENT ON COLUMN public.reflections.id IS 'Unique identifier for each reflection entry';
COMMENT ON COLUMN public.reflections.user_id IS 'Foreign key to auth.users, identifies the reflection owner';
COMMENT ON COLUMN public.reflections.question_text IS 'The question or prompt that was presented to the user';
COMMENT ON COLUMN public.reflections.answer_text IS 'The user''s response or reflection text';
COMMENT ON COLUMN public.reflections.reflection_type IS 'Type of reflection: general, assessment, daily, intention, completion';
COMMENT ON COLUMN public.reflections.tags IS 'Array of tags for categorizing and searching reflections';
COMMENT ON COLUMN public.reflections.created_at IS 'Timestamp when the reflection was first created';
COMMENT ON COLUMN public.reflections.updated_at IS 'Timestamp when the reflection was last modified';

-- Create enhanced views for easier querying

-- Drop existing view if it exists
DROP VIEW IF EXISTS public.user_reflections;

-- Create enhanced user reflections view
CREATE OR REPLACE VIEW public.user_reflections AS
SELECT 
    r.id,
    r.question_text,
    r.answer_text,
    r.reflection_type,
    r.tags,
    r.created_at,
    r.updated_at,
    u.email as user_email,
    LENGTH(r.answer_text) as answer_length,
    DATE(r.created_at) as reflection_date
FROM public.reflections r
JOIN auth.users u ON r.user_id = u.id
WHERE r.user_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON public.user_reflections TO authenticated;

COMMENT ON VIEW public.user_reflections IS 'Enhanced view for users to access their own reflections with additional computed fields';

-- Create a function for reflection statistics
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
        'first_reflection', MIN(created_at),
        'latest_reflection', MAX(created_at)
    ) INTO stats
    FROM public.reflections
    WHERE user_id = target_user_id;
    
    RETURN COALESCE(stats, '{}'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_user_reflection_stats TO authenticated;

COMMENT ON FUNCTION public.get_user_reflection_stats IS 'Returns comprehensive statistics about a user''s reflections';

-- Create a function for searching reflections with full-text search
CREATE OR REPLACE FUNCTION public.search_user_reflections(
    search_query TEXT,
    reflection_type_filter VARCHAR(50) DEFAULT NULL,
    limit_results INTEGER DEFAULT 20
)
RETURNS TABLE (
    id UUID,
    question_text TEXT,
    answer_text TEXT,
    reflection_type VARCHAR(50),
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
    ORDER BY relevance_score DESC, r.created_at DESC
    LIMIT limit_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the search function
GRANT EXECUTE ON FUNCTION public.search_user_reflections TO authenticated;

COMMENT ON FUNCTION public.search_user_reflections IS 'Full-text search function for user reflections with relevance scoring';