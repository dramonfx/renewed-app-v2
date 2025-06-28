
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AudioPlayer } from '@/components/audio-player'
import { ArrowLeft, BookOpen, Clock } from 'lucide-react'
import type { BookSection, AudioTrack } from '@/lib/types'

async function fetchSection(slug: string): Promise<BookSection | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/book/sections/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch section')
    }
    
    const result = await response.json()
    return result.data || null
  } catch (error) {
    console.error('Error fetching section:', error)
    return null
  }
}

export default async function SectionPage({ params }: { params: { sectionSlug: string } }) {
  const section = await fetchSection(params.sectionSlug)

  if (!section) {
    notFound()
  }

  const categoryColors = {
    'prologue': 'bg-purple-100 text-purple-800 border-purple-200',
    'introduction': 'bg-blue-100 text-blue-800 border-blue-200', 
    'foundations': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'principles': 'bg-green-100 text-green-800 border-green-200',
    'conclusion': 'bg-amber-100 text-amber-800 border-amber-200'
  }

  const categoryLabels = {
    'prologue': 'Prologue',
    'introduction': 'Introduction',
    'foundations': 'Foundations', 
    'principles': 'Key Principles',
    'conclusion': 'Conclusion'
  }

  const backgroundGradients = {
    'prologue': 'from-purple-50 via-white to-pink-50',
    'introduction': 'from-blue-50 via-white to-indigo-50',
    'foundations': 'from-indigo-50 via-white to-purple-50',
    'principles': 'from-green-50 via-white to-emerald-50',
    'conclusion': 'from-amber-50 via-white to-orange-50'
  }

  // Create audio track if available
  const audioTrack: AudioTrack | undefined = section.audioUrl ? {
    id: section.id,
    title: section.audioTitle || section.title,
    url: section.audioUrl,
    duration: section.audioDuration,
    sectionId: section.id
  } : undefined

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradients[section.category]}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link href="/book">
            <Button variant="ghost" className="hover:bg-white/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Guidebook
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Badge 
              variant="outline" 
              className={`${categoryColors[section.category]} font-medium`}
            >
              {categoryLabels[section.category]}
            </Badge>
            {section.audioDuration && (
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{Math.ceil(section.audioDuration / 60)} min read</span>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {section.title}
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            {section.description}
          </p>

          {/* Audio Player */}
          {audioTrack && (
            <div className="mb-8">
              <AudioPlayer track={audioTrack} />
            </div>
          )}
        </div>

        {/* Content */}
        <Card className="shadow-lg border-2 border-white/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed space-y-6">
                {section.content.split('\n\n').map((paragraph, index) => (
                  <div 
                    key={index}
                    className="mb-4"
                    dangerouslySetInnerHTML={{ 
                      __html: paragraph.replace(/\n/g, '<br>') 
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="mt-12 flex justify-center">
          <Link href="/book">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <BookOpen className="h-4 w-4 mr-2" />
              Continue Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function generateMetadata({ params }: { params: { sectionSlug: string } }) {
  return {
    title: `${params.sectionSlug.replace(/-/g, ' ')} | RENEWED: The New Man Story`,
    description: 'A spiritual teaching from the RENEWED guidebook for transformation.'
  }
}
