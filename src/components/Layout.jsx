// src/components/Layout.jsx
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
  const sereneBackgroundUrl = "https://images.unsplash.com/photo-1643661100639-de5cdf7bcb80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const sections = await getSidebarSections();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="w-72 bg-sacred-indigo-900/20 backdrop-blur-md border-r border-sacred-indigo-300/20 p-6 shadow-xl fixed top-0 left-0 h-full z-10 overflow-y-auto">
          <div className="mb-8 text-center">
            <Link href="/" className="text-sacred-indigo-800 font-serif text-2xl font-bold hover:text-sacred-indigo-600 transition-colors">
              Renewed
            </Link>
            {/* Corrected Text Below */}
            <p className="text-xs text-sacred-indigo-600/80 font-sans mt-1">THE NEW MAN STORY</p>
          </div>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="block py-2 px-3 rounded-md text-sacred-indigo-700 hover:bg-sacred-indigo-100/50 hover:text-sacred-indigo-900 font-sans font-semibold text-base transition-all duration-200 backdrop-blur-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/book" className="block py-2 px-3 rounded-md text-sacred-indigo-700 hover:bg-sacred-indigo-100/50 hover:text-sacred-indigo-900 font-sans font-semibold text-base transition-all duration-200 backdrop-blur-sm">
                  Guidebook Home
                </Link>
              </li>
              <hr className="my-3 border-sacred-indigo-300/30" />
              <h3 className="px-3 text-xs font-semibold text-sacred-indigo-600/70 uppercase tracking-wider mb-1">Sections</h3>
              {sections.map((section) => (
                <li key={section.id}>
                  <Link href={`/book/${section.slug}`} className="block py-1.5 px-3 rounded-md text-sacred-indigo-600 hover:bg-sacred-indigo-100/40 hover:text-sacred-indigo-800 font-sans text-sm transition-all duration-200 backdrop-blur-sm">
                    {section.title}
                  </Link>
                </li>
              ))}
              <hr className="my-3 border-sacred-indigo-300/30" />
              <li>
                <Link href="/full-audio-player" className="block py-2 px-3 rounded-md text-sacred-indigo-700 hover:bg-sacred-amber-100/40 hover:text-sacred-amber-800 font-sans font-semibold text-base transition-all duration-200 backdrop-blur-sm border border-sacred-amber-200/30">
                  Full Audiobook
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <main
          className="flex-1 ml-72 p-6 lg:p-10 overflow-y-auto bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url('${sereneBackgroundUrl}')` }}
        >
          <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-xl shadow-xl min-h-full border border-sacred-indigo-100/50">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}