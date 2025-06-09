// src/components/Layout.js
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

async function getSidebarSections() {
  const { data, error } = await supabase
    .from('sections')
    .select('id, title, slug, order')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching sections for sidebar:', error.message);
    return [];
  }
  return data || [];
}

export default async function Layout({ children }) {
  const skyBgUrl = "https://images.pexels.com/photos/1531660/pexels-photo-1531660.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const sections = await getSidebarSections();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="w-72 bg-brand-blue-sidebar p-6 shadow-lg fixed top-0 left-0 h-full z-10 overflow-y-auto">
          <div className="mb-8 text-center">
            <Link href="/" className="text-brand-blue-dark font-serif text-2xl font-bold hover:opacity-80">
              Renewed
            </Link>
            {/* Corrected Text Below */}
            <p className="text-xs text-brand-text-muted font-sans">THE NEW MAN STORY</p>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="block py-2 px-3 rounded-md text-brand-text-main hover:bg-brand-blue-light hover:text-brand-blue-dark font-sans font-semibold text-base transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/book" className="block py-2 px-3 rounded-md text-brand-text-main hover:bg-brand-blue-light hover:text-brand-blue-dark font-sans font-semibold text-base transition-colors">
                  Guidebook Home
                </Link>
              </li>
              <hr className="my-3 border-brand-blue-medium/40" />
              <h3 className="px-3 text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-1">Sections</h3>
              {sections.map((section) => (
                <li key={section.id}>
                  <Link href={`/book/${section.slug}`} className="block py-1.5 px-3 rounded-md text-brand-text-main hover:bg-brand-blue-light hover:text-brand-blue-dark font-sans text-sm transition-colors">
                    {section.title}
                  </Link>
                </li>
              ))}
              <hr className="my-3 border-brand-blue-medium/40" />
              <li>
                <Link href="/full-audio-player" className="block py-2 px-3 rounded-md text-brand-text-main hover:bg-brand-blue-light hover:text-brand-blue-dark font-sans font-semibold text-base transition-colors">
                  Full Audiobook
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main
          className="flex-1 ml-72 p-6 lg:p-10 overflow-y-auto bg-cover bg-center"
          style={{ backgroundImage: `url('${skyBgUrl}')` }}
        >
          <div className="bg-brand-blue-content-bg/95 p-6 sm:p-8 md:p-10 rounded-xl shadow-xl min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}