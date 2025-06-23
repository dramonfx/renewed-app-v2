
// src/app/api/journal/route.js
// Sacred Journaling API - Main journal operations (GET, POST)

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/journal - Retrieve user's journal entries
export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50 entries per request
    const search = searchParams.get('search');
    const reflectionType = searchParams.get('type');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);

    // Build query
    let query = supabase
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Add filters
    if (reflectionType) {
      query = query.eq('reflection_type', reflectionType);
    }

    // Add search functionality
    if (search) {
      query = query.or(`question_text.ilike.%${search}%,answer_text.ilike.%${search}%`);
    }

    // Add tag filtering
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }

    // Add pagination
    const from = (page - 1) * limit;
    query = query.range(from, from + limit - 1);

    const { data: entries, error, count } = await query;

    if (error) {
      console.error('Error fetching journal entries:', error);
      return NextResponse.json({ error: 'Failed to fetch journal entries' }, { status: 500 });
    }

    // Transform entries to journal format
    const journalEntries = entries.map(entry => ({
      id: entry.id,
      title: entry.question_text,
      content: entry.answer_text,
      tags: entry.tags || [],
      reflection_type: entry.reflection_type,
      created_at: entry.created_at,
      updated_at: entry.updated_at
    }));

    return NextResponse.json({
      entries: journalEntries,
      pagination: {
        page,
        limit,
        total: count,
        hasMore: entries.length === limit
      }
    });

  } catch (error) {
    console.error('Journal API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/journal - Create new journal entry
export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const { title, content, tags, reflection_type } = body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    // Sanitize and prepare data
    const entryData = {
      user_id: user.id,
      question_text: title.trim(),
      answer_text: content.trim(),
      reflection_type: reflection_type || 'journal',
      tags: Array.isArray(tags) ? tags.filter(tag => tag && typeof tag === 'string') : []
    };

    // Insert new journal entry
    const { data: entry, error } = await supabase
      .from('reflections')
      .insert(entryData)
      .select()
      .single();

    if (error) {
      console.error('Error creating journal entry:', error);
      return NextResponse.json({ error: 'Failed to create journal entry' }, { status: 500 });
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

    return NextResponse.json({ entry: journalEntry }, { status: 201 });

  } catch (error) {
    console.error('Journal API POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
