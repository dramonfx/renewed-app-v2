
// src/app/api/journal/[id]/route.js
// Sacred Journaling API - Individual journal entry operations (GET, PUT, DELETE)

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/journal/[id] - Retrieve specific journal entry
export async function GET(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
    }

    // Fetch the specific entry (RLS ensures user can only access their own)
    const { data: entry, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
      }
      console.error('Error fetching journal entry:', error);
      return NextResponse.json({ error: 'Failed to fetch journal entry' }, { status: 500 });
    }

    // Transform to journal format
    const journalEntry = {
      id: entry.id,
      title: entry.question_text,
      content: entry.answer_text,
      tags: entry.tags || [],
      reflection_type: entry.reflection_type,
      created_at: entry.created_at,
      updated_at: entry.updated_at
    };

    return NextResponse.json({ entry: journalEntry });

  } catch (error) {
    console.error('Journal API GET [id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/journal/[id] - Update specific journal entry
export async function PUT(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { title, content, tags, reflection_type } = body;

    // Validation
    if (title !== undefined && (!title || typeof title !== 'string' || title.trim().length === 0)) {
      return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    }

    if (content !== undefined && (!content || typeof content !== 'string' || content.trim().length === 0)) {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    }

    // Prepare update data (only include provided fields)
    const updateData = {};
    
    if (title !== undefined) {
      updateData.question_text = title.trim();
    }
    
    if (content !== undefined) {
      updateData.answer_text = content.trim();
    }
    
    if (reflection_type !== undefined) {
      updateData.reflection_type = reflection_type;
    }
    
    if (tags !== undefined) {
      updateData.tags = Array.isArray(tags) ? tags.filter(tag => tag && typeof tag === 'string') : [];
    }

    // Update the entry (RLS ensures user can only update their own)
    const { data: entry, error } = await supabase
      .from('reflections')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
      }
      console.error('Error updating journal entry:', error);
      return NextResponse.json({ error: 'Failed to update journal entry' }, { status: 500 });
    }

    // Transform to journal format
    const journalEntry = {
      id: entry.id,
      title: entry.question_text,
      content: entry.answer_text,
      tags: entry.tags || [],
      reflection_type: entry.reflection_type,
      created_at: entry.created_at,
      updated_at: entry.updated_at
    };

    return NextResponse.json({ entry: journalEntry });

  } catch (error) {
    console.error('Journal API PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/journal/[id] - Delete specific journal entry
export async function DELETE(request, { params }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Invalid entry ID' }, { status: 400 });
    }

    // Delete the entry (RLS ensures user can only delete their own)
    const { error } = await supabase
      .from('reflections')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting journal entry:', error);
      return NextResponse.json({ error: 'Failed to delete journal entry' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Journal entry deleted successfully' });

  } catch (error) {
    console.error('Journal API DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
