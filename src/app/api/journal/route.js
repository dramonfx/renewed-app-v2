import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/journal - Fetch user's journal entries
export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const mindset = searchParams.get('mindset');
    const reflectionType = searchParams.get('reflection_type');
    const search = searchParams.get('search');

    try {
      // If search query is provided, use the search function
      if (search && search.trim()) {
        const { data: entries, error: searchError } = await supabase.rpc(
          'search_user_reflections',
          {
            search_query: search.trim(),
            reflection_type_filter: reflectionType,
            limit_results: limit,
          }
        );

        if (searchError) {
          console.error('Search error:', searchError);
          return NextResponse.json({ error: 'Search failed' }, { status: 500 });
        }

        // Transform search results to match journal interface
        const transformedEntries = entries.map((entry) => ({
          id: entry.id,
          title: entry.title || entry.question_text?.substring(0, 100) || 'Untitled',
          content: entry.answer_text,
          reflection_type: entry.reflection_type,
          mindset: entry.mindset,
          tags: entry.tags || [],
          created_at: entry.created_at,
          updated_at: entry.updated_at,
        }));

        return NextResponse.json({
          entries: transformedEntries,
          count: transformedEntries.length,
          isSearch: true,
        });
      }

      // Use optimized function for filtered queries
      const { data: entries, error } = await supabase.rpc('get_journal_entries', {
        mindset_filter: mindset,
        reflection_type_filter: reflectionType,
        limit_entries: limit,
        offset_entries: offset,
      });

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
      }

      return NextResponse.json({ entries: entries || [], count: entries?.length || 0 });
    } catch (rpcError) {
      // Fallback to direct query if RPC functions aren't available
      console.warn('RPC function not available, using direct query:', rpcError);

      let query = supabase
        .from('reflections')
        .select(
          `
          id,
          title,
          question_text,
          answer_text,
          reflection_type,
          mindset,
          tags,
          created_at,
          updated_at
        `
        )
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (mindset) query = query.eq('mindset', mindset);
      if (reflectionType) query = query.eq('reflection_type', reflectionType);

      const { data: entries, error } = await query;

      if (error) {
        console.error('Fallback query error:', error);
        return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
      }

      // Transform entries to match journal interface
      const transformedEntries = (entries || []).map((entry) => ({
        id: entry.id,
        title: entry.title || entry.question_text?.substring(0, 100) || 'Untitled',
        content: entry.answer_text,
        reflection_type: entry.reflection_type,
        mindset: entry.mindset,
        tags: entry.tags || [],
        created_at: entry.created_at,
        updated_at: entry.updated_at,
      }));

      return NextResponse.json({
        entries: transformedEntries,
        count: transformedEntries.length,
      });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/journal - Create new journal entry
export async function POST(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verify authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { title, content, reflection_type, tags, mindset } = body;

    // Validate required fields
    if (!title?.trim() && !content?.trim()) {
      return NextResponse.json(
        {
          error: 'Either title or content is required',
        },
        { status: 400 }
      );
    }

    if (mindset && !['Natural', 'Transition', 'Spiritual'].includes(mindset)) {
      return NextResponse.json(
        {
          error: 'Invalid mindset. Must be Natural, Transition, or Spiritual',
        },
        { status: 400 }
      );
    }

    // Prepare entry data
    const entryData = {
      user_id: user.id,
      title: title?.trim() || '',
      question_text: title?.trim() || 'Journal Entry',
      answer_text: content?.trim() || '',
      reflection_type: reflection_type || 'general',
      tags: Array.isArray(tags) ? tags : [],
      mindset: mindset || null,
    };

    // Create journal entry
    const { data: entry, error } = await supabase
      .from('reflections')
      .insert(entryData)
      .select(
        `
        id,
        title,
        question_text,
        answer_text,
        reflection_type,
        mindset,
        tags,
        created_at,
        updated_at
      `
      )
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
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
      updated_at: entry.updated_at,
    };

    return NextResponse.json({ entry: transformedEntry }, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
