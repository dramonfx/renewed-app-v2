'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Define interfaces
interface LayoutProps {
  children: ReactNode;
}

interface Section {
  id: number;
  title: string;
  slug: string;
  order: number;
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);
  const { user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Check if current page should have full-screen layout (no sidebar)
  const isFullScreenPage =
    pathname === '/onboarding' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password';

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    // Only fetch sections if not on a full-screen page
    if (!isFullScreenPage) {
      // Mock sections data for now since we're making this client-side
      const mockSections: Section[] = [
        { id: 1, title: 'Prologue', slug: '00_prologue', order: 1 },
        {
          id: 2,
          title: 'Introduction Through Next Steps',
          slug: '01_intro_through_next_steps',
          order: 2,
        },
        { id: 3, title: 'Kingdom Government', slug: '02_kingdom_government', order: 3 },
        { id: 4, title: 'Elephant in the Kingdom', slug: '03_elephant_in_the_kingdom', order: 4 },
        {
          id: 5,
          title: 'Characteristics of Principles',
          slug: '04_characteristics_of_principles',
          order: 5,
        },
        { id: 6, title: 'Approved', slug: '05_approved', order: 6 },
        { id: 7, title: '30 Key Principles (01–10)', slug: '06_key_principles_01-10', order: 7 },
        { id: 8, title: '30 Key Principles (11–20)', slug: '06_key_principles_11-20', order: 8 },
        { id: 9, title: '30 Key Principles (21–30)', slug: '06_key_principles_21-30', order: 9 },
        { id: 10, title: 'Conclusion', slug: '07_conclusion', order: 10 },
      ];
      setSections(mockSections);
    }
  }, [isFullScreenPage]);

  // Full-screen layout for onboarding and auth pages
  if (isFullScreenPage) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="flex flex-1">
        {/* Sacred Journey Sidebar with Stable Sacred Blue Background */}
        <aside className="fixed left-0 top-0 z-10 h-full w-72 overflow-y-auto border-r border-sacred-blue-200 bg-brand-blue-sidebar shadow-2xl">
          <div className="p-6">
            {/* Sacred Journey Header */}
            <div className="mb-8 text-center">
              <Link
                href="/"
                className="font-serif text-2xl font-bold text-sacred-blue-900 transition-colors duration-300 hover:text-sacred-gold-600"
              >
                Renewed
              </Link>
              <p className="mt-1 font-sans text-xs uppercase tracking-wider text-sacred-blue-700">
                THE NEW MAN STORY
              </p>
            </div>

            {/* Sacred Journey Navigation */}
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard"
                    className="block rounded-lg border border-transparent px-4 py-3 font-sans text-base font-semibold text-sacred-blue-900 transition-all duration-300 hover:border-sacred-blue-300 hover:bg-white/50 hover:text-sacred-blue-900 hover:shadow-lg"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/journal"
                    className="block rounded-lg border border-transparent px-4 py-3 font-sans text-base font-semibold text-sacred-blue-900 transition-all duration-300 hover:border-sacred-blue-300 hover:bg-white/50 hover:text-sacred-blue-900 hover:shadow-lg"
                  >
                    📖 Sacred Journal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/book"
                    className="block rounded-lg border border-transparent px-4 py-3 font-sans text-base font-semibold text-sacred-blue-900 transition-all duration-300 hover:border-sacred-blue-300 hover:bg-white/50 hover:text-sacred-blue-900 hover:shadow-lg"
                  >
                    Guidebook Home
                  </Link>
                </li>

                {/* Sacred Divider */}
                <hr className="my-4 border-sacred-blue-300" />

                {/* Sections Header */}
                <h3 className="mb-2 px-4 font-sans text-xs font-semibold uppercase tracking-wider text-sacred-blue-700">
                  Sections
                </h3>

                {/* Dynamic Sections with Sacred Journey Styling */}
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link
                      href={`/book/${section.slug}`}
                      className="block rounded-lg border border-transparent px-4 py-2 font-sans text-sm text-sacred-blue-800 transition-all duration-300 hover:border-sacred-blue-300 hover:bg-white/50 hover:text-sacred-blue-900 hover:shadow-md"
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}

                {/* Sacred Divider */}
                <hr className="my-4 border-sacred-blue-300" />

                {/* Full Audiobook Link with Sacred Gold Accent */}
                <li>
                  <Link
                    href="/full-audio-player"
                    className="block rounded-lg border border-sacred-gold-300 bg-sacred-gold-100 px-4 py-3 font-sans text-base font-semibold text-sacred-blue-900 transition-all duration-300 hover:border-sacred-gold-400 hover:bg-sacred-gold-200 hover:text-sacred-blue-900 hover:shadow-lg"
                  >
                    🎧 Full Audiobook
                  </Link>
                </li>
              </ul>
            </nav>

            {/* User Profile Section */}
            {user && (
              <div className="mt-8 border-t border-sacred-blue-300 pt-6">
                <div className="px-4 pb-4">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sacred-gold-200">
                      <svg
                        className="h-6 w-6 text-sacred-blue-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-sacred-blue-900">
                        {user.email}
                      </p>
                      <p className="text-xs text-sacred-blue-700">Sacred Journey Member</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center justify-center rounded-lg border border-sacred-blue-300 bg-white/50 px-4 py-2 text-sm font-medium text-sacred-blue-700 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoggingOut ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Signing Out...
                      </>
                    ) : (
                      <>
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Sacred Journey Main Content Area */}
        <main className="ml-72 flex-1 overflow-y-auto p-6 lg:p-10">
          {/* Sacred Journey Content Container with Solid Background */}
          <div className="min-h-full rounded-2xl bg-white p-6 shadow-xl sm:p-8 md:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Export prop types
export type { LayoutProps, Section };
