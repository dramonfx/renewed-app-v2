
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/journal/stats - Get user's journal statistics
export async function GET(request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      // Try to use the optimized stats function
      const { data: stats, error: statsError } = await supabase
        .rpc('get_journal_stats')

      if (statsError) {
        throw statsError
      }

      return NextResponse.json({ stats: stats || {} })
    } catch (rpcError) {
      // Fallback to manual calculation if RPC function isn't available
      console.warn('Stats RPC function not available, calculating manually:', rpcError)
      
      const { data: entries, error } = await supabase
        .from('reflections')
        .select('id, answer_text, mindset, reflection_type, created_at, tags')

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
      }

      // Calculate stats manually
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      const stats = {
        total_entries: entries.length,
        entries_this_week: entries.filter(e => new Date(e.created_at) >= weekAgo).length,
        entries_this_month: entries.filter(e => new Date(e.created_at) >= monthAgo).length,
        average_content_length: entries.length > 0 
          ? Math.round(entries.reduce((sum, e) => sum + (e.answer_text?.length || 0), 0) / entries.length)
          : 0,
        mindset_counts: {
          Natural: entries.filter(e => e.mindset === 'Natural').length,
          Transition: entries.filter(e => e.mindset === 'Transition').length,
          Spiritual: entries.filter(e => e.mindset === 'Spiritual').length
        },
        first_entry: entries.length > 0 ? entries.reduce((min, e) => e.created_at < min ? e.created_at : min, entries[0].created_at) : null,
        latest_entry: entries.length > 0 ? entries.reduce((max, e) => e.created_at > max ? e.created_at : max, entries[0].created_at) : null
      }

      return NextResponse.json({ stats })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
