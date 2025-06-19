
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const pathname = usePathname();
  const [sections, setSections] = useState([]);

  // Check if current page should have full-screen layout (no sidebar)
  const isFullScreenPage = pathname === '/onboarding' || pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

  useEffect(() => {
    // Only fetch sections if not on a full-screen page
    if (!isFullScreenPage) {
      // Mock sections data for now since we're making this client-side
      setSections([
        { id: 1, title: 'Prologue', slug: '00_prologue', order: 1 },
        { id: 2, title: 'Introduction Through Next Steps', slug: '01_intro_through_next_steps', order: 2 },
        { id: 3, title: 'Kingdom Government', slug: '02_kingdom_government', order: 3 },
        { id: 4, title: 'Elephant in the Kingdom', slug: '03_elephant_in_the_kingdom', order: 4 },
        { id: 5, title: 'Characteristics of Principles', slug: '04_characteristics_of_principles', order: 5 },
        { id: 6, title: 'Approved', slug: '05_approved', order: 6 },
        { id: 7, title: '30 Key Principles (01–10)', slug: '06_key_principles_01-10', order: 7 },
        { id: 8, title: '30 Key Principles (11–20)', slug: '06_key_principles_11-20', order: 8 },
        { id: 9, title: '30 Key Principles (21–30)', slug: '06_key_principles_21-30', order: 9 },
        { id: 10, title: 'Conclusion', slug: '07_conclusion', order: 10 }
      ]);
    }
  }, [isFullScreenPage]);

  // Full-screen layout for onboarding and auth pages
  if (isFullScreenPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Sacred Journey Sidebar with Enhanced Glassmorphism */}
        <aside className="w-72 sacred-glass fixed top-0 left-0 h-full z-10 overflow-y-auto border-r border-white/20">
          <div className="p-6">
            {/* Sacred Journey Header */}
            <div className="mb-8 text-center">
              <Link href="/" className="text-sacred-blue-900 font-serif text-2xl font-bold hover:text-sacred-blue-600 transition-colors duration-300">
                Renewed
              </Link>
              <p className="text-xs text-sacred-blue-600 font-sans mt-1 tracking-wider uppercase">THE NEW MAN STORY</p>
            </div>

            {/* Sacred Journey Navigation */}
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="block py-3 px-4 rounded-lg text-sacred-blue-900 hover:bg-white/30 hover:text-sacred-blue-900 font-sans font-semibold text-base transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/30 hover:shadow-lg">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="block py-3 px-4 rounded-lg text-sacred-blue-900 hover:bg-white/30 hover:text-sacred-blue-900 font-sans font-semibold text-base transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/30 hover:shadow-lg">
                    Guidebook Home
                  </Link>
                </li>
                
                {/* Sacred Divider */}
                <hr className="my-4 border-white/30" />
                
                {/* Sections Header */}
                <h3 className="px-4 text-xs font-semibold text-sacred-blue-700 uppercase tracking-wider mb-2 font-sans">Sections</h3>
                
                {/* Dynamic Sections with Sacred Journey Styling */}
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link href={`/book/${section.slug}`} className="block py-2 px-4 rounded-lg text-sacred-blue-800 hover:bg-white/20 hover:text-sacred-blue-900 font-sans text-sm transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-white/20 hover:shadow-md">
                      {section.title}
                    </Link>
                  </li>
                ))}
                
                {/* Sacred Divider */}
                <hr className="my-4 border-white/30" />
                
                {/* Full Audiobook Link with Sacred Gold Accent */}
                <li>
                  <Link href="/full-audio-player" className="block py-3 px-4 rounded-lg text-sacred-blue-900 hover:bg-sacred-gold-100/50 hover:text-sacred-blue-900 font-sans font-semibold text-base transition-all duration-300 backdrop-blur-sm border border-sacred-gold-300/40 hover:border-sacred-gold-400/60 hover:shadow-lg bg-sacred-gold-50/30">
                    🎧 Full Audiobook
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Sacred Journey Main Content Area */}
        <main className="flex-1 ml-72 p-6 lg:p-10 overflow-y-auto">
          {/* Sacred Journey Content Container with Enhanced Glassmorphism */}
          <div className="sacred-glass-heavy p-6 sm:p-8 md:p-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
