-- Create reflections table for storing user journal entries and assessment responses
-- Migration: 20240617_create_reflections_table.sql
-- Created: 2024-06-17
-- Purpose: Phase 2 journaling implementation for Renewed app

-- Create the reflections table
CREATE TABLE IF NOT EXISTS public.reflections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_reflections_user_id ON public.reflections(user_id);
CREATE INDEX IF NOT EXISTS idx_reflections_created_at ON public.reflections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reflections_user_created ON public.reflections(user_id, created_at DESC);

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
COMMENT ON TABLE public.reflections IS 'Stores user journal entries, assessment responses, and reflections';
COMMENT ON COLUMN public.reflections.id IS 'Unique identifier for each reflection entry';
COMMENT ON COLUMN public.reflections.user_id IS 'Foreign key to auth.users, identifies the reflection owner';
COMMENT ON COLUMN public.reflections.question_text IS 'The question or prompt that was presented to the user';
COMMENT ON COLUMN public.reflections.answer_text IS 'The user''s response or reflection text';
COMMENT ON COLUMN public.reflections.created_at IS 'Timestamp when the reflection was first created';
COMMENT ON COLUMN public.reflections.updated_at IS 'Timestamp when the reflection was last modified';

-- Create a view for easier querying (optional)
CREATE OR REPLACE VIEW public.user_reflections AS
SELECT 
    r.id,
    r.question_text,
    r.answer_text,
    r.created_at,
    r.updated_at,
    u.email as user_email
FROM public.reflections r
JOIN auth.users u ON r.user_id = u.id
WHERE r.user_id = auth.uid();

-- Grant access to the view
GRANT SELECT ON public.user_reflections TO authenticated;

COMMENT ON VIEW public.user_reflections IS 'Convenient view for users to access their own reflections with user context';