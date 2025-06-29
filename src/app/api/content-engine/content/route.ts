import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const principle = searchParams.get('principle');
    
    let query = supabase
      .from('content_engine')
      .select('*')
      .order('order_index');
    
    if (section) {
      query = query.eq('section', section);
    }
    
    if (principle) {
      query = query.eq('principle_number', parseInt(principle));
    }
    
    const { data: content, error } = await query;

    if (error) {
      console.error('Error fetching content:', error);
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    const { data: content, error } = await supabase
      .from('content_engine')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating content:', error);
      return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
    }

    return NextResponse.json({ content }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}