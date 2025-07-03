import { NextRequest, NextResponse } from 'next/server';
import { ContentService } from '@/lib/db';
import type { SectionsResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sections = await ContentService.getAllSections();

    const response: SectionsResponse = {
      data: sections,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error - GET /api/book/sections:', error);

    const errorResponse: SectionsResponse = {
      error: 'Failed to fetch book sections',
      success: false,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.slug || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, content', success: false },
        { status: 400 }
      );
    }

    const section = await ContentService.createSection(body);

    if (!section) {
      const errorResponse: SectionsResponse = {
        error: 'Failed to create book section',
        success: false,
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const response: SectionsResponse = {
      data: [section],
      success: true,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('API Error - POST /api/book/sections:', error);

    const errorResponse: SectionsResponse = {
      error: 'Failed to create book section',
      success: false,
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
