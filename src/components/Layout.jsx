
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Layout({ children }) {
  const pathname = usePathname();
  const [sections, setSections] = useState([]);
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if current page should have full-screen layout (no sidebar)
  const isFullScreenPage = pathname === '/onboarding' || pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password';

  // Logout handler
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

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
    <div 
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: 'url("https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="flex flex-1">
        {/* Sacred Journey Sidebar with Stable Sacred Blue Background */}
        <aside className="w-72 bg-brand-blue-sidebar fixed top-0 left-0 h-full z-10 overflow-y-auto border-r border-sacred-blue-200 shadow-2xl">
          <div className="p-6">
            {/* Sacred Journey Header */}
            <div className="mb-8 text-center">
              <Link href="/" className="text-sacred-blue-900 font-serif text-2xl font-bold hover:text-sacred-gold-600 transition-colors duration-300">
                Renewed
              </Link>
              <p className="text-xs text-sacred-blue-700 font-sans mt-1 tracking-wider uppercase">THE NEW MAN STORY</p>
            </div>

            {/* Sacred Journey Navigation */}
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link href="/dashboard" className="block py-3 px-4 rounded-lg text-sacred-blue-900 hover:bg-white/50 hover:text-sacred-blue-900 font-sans font-semibold text-base transition-all duration-300 border border-transparent hover:border-sacred-blue-300 hover:shadow-lg">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="block py-3 px-4 rounded-lg text-sacred-blue-900 hover:bg-white/50 hover:text-sacred-blue-900 font-sans font-semibold text-base transition-all duration-300 border border-transparent hover:border-sacred-blue-300 hover:shadow-lg">
                    📖 Sacred Journal
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="block py-3 px-4 rounded-lg text-sacred-blue-900 hover:bg-white/50 hover:text-sacred-blue-900 font-sans font-semibold text-base transition-all duration-300 border border-transparent hover:border-sacred-blue-300 hover:shadow-lg">
                    Guidebook Home
                  </Link>
                </li>
                
                {/* Sacred Divider */}
                <hr className="my-4 border-sacred-blue-300" />
                
                {/* Sections Header */}
                <h3 className="px-4 text-xs font-semibold text-sacred-blue-700 uppercase tracking-wider mb-2 font-sans">Sections</h3>
                
                {/* Dynamic Sections with Sacred Journey Styling */}
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link href={`/book/${section.slug}`} className="block py-2 px-4 rounded-lg text-sacred-blue-800 hover:bg-white/50 hover:text-sacred-blue-900 font-sans text-sm transition-all duration-300 border border-transparent hover:border-sacred-blue-300 hover:shadow-md">
                      {section.title}
                    </Link>
                  </li>
                ))}
                
                {/* Sacred Divider */}
                <hr className="my-4 border-sacred-blue-300" />
                
                {/* Full Audiobook Link with Sacred Gold Accent */}
                <li>
                  <Link href="/full-audio-player" className="block py-3 px-4 rounded-lg text-sacred-blue-900 hover:bg-sacred-gold-200 hover:text-sacred-blue-900 font-sans font-semibold text-base transition-all duration-300 border border-sacred-gold-300 hover:border-sacred-gold-400 hover:shadow-lg bg-sacred-gold-100">
                    🎧 Full Audiobook
                  </Link>
                </li>
                
                {/* Logout Button - Only show when user is authenticated */}
                {user && (
                  <>
                    {/* Sacred Divider */}
                    <hr className="my-4 border-sacred-blue-300" />
                    
                    <li>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-left block py-3 px-4 rounded-lg text-sacred-blue-900 hover:bg-red-100 hover:text-red-800 font-sans font-semibold text-base transition-all duration-300 border border-transparent hover:border-red-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Log out of your account"
                      >
                        {isLoggingOut ? (
                          <>
                            <svg className="inline w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Logging out...
                          </>
                        ) : (
                          <>
                            <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </>
                        )}
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Sacred Journey Main Content Area */}
        <main className="flex-1 ml-72 p-6 lg:p-10 overflow-y-auto">
          {/* Sacred Journey Content Container with Solid Background */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
