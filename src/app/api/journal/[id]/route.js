
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/journal/[id] - Fetch single journal entry
export async function GET(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: entry, error } = await supabase
      .from('reflections')
      .select(`
        id,
        title,
        question_text,
        answer_text,
        reflection_type,
        mindset,
        tags,
        created_at,
        updated_at
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
      }
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch entry' }, { status: 500 })
    }

    // Transform entry to match journal interface
    const transformedEntry = {
      id: entry.id,
      title: entry.title || entry.question_text,
      content: entry.answer_text,
      reflection_type: entry.reflection_type,
      mindset: entry.mindset,
      tags: entry.tags || [],
      created_at: entry.created_at,
      updated_at: entry.updated_at
    }

    return NextResponse.json({ entry: transformedEntry })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/journal/[id] - Update journal entry
export async function PUT(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, reflection_type, tags, mindset } = body

    // Validate required fields
    if (!title?.trim() && !content?.trim()) {
      return NextResponse.json({ 
        error: 'Either title or content is required' 
      }, { status: 400 })
    }

    if (mindset && !['Natural', 'Transition', 'Spiritual'].includes(mindset)) {
      return NextResponse.json({ 
        error: 'Invalid mindset. Must be Natural, Transition, or Spiritual' 
      }, { status: 400 })
    }

    // Prepare update data
    const updateData = {
      title: title?.trim() || '',
      question_text: title?.trim() || 'Journal Entry',
      answer_text: content?.trim() || '',
      reflection_type: reflection_type || 'general',
      tags: Array.isArray(tags) ? tags : []
    }

    // Only update mindset if provided
    if (mindset) {
      updateData.mindset = mindset
    }

    const { data: entry, error } = await supabase
      .from('reflections')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        id,
        title,
        question_text,
        answer_text,
        reflection_type,
        mindset,
        tags,
        created_at,
        updated_at
      `)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
      }
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
    }

    // Transform response to match journal interface
    const transformedEntry = {
      id: entry.id,
      title: entry.title || entry.question_text,
      content: entry.answer_text,
      reflection_type: entry.reflection_type,
      mindset: entry.mindset,
      tags: entry.tags || [],
      created_at: entry.created_at,
      updated_at: entry.updated_at
    }

    return NextResponse.json({ entry: transformedEntry })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/journal/[id] - Delete journal entry
export async function DELETE(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('reflections')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Entry deleted successfully' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
