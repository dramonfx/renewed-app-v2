'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="left-1/6 absolute top-1/4 h-32 w-32 rounded-full bg-blue-400/20 opacity-60 blur-2xl"></div>
        <div className="right-1/6 absolute bottom-1/4 h-48 w-48 rounded-full bg-amber-400/20 opacity-40 blur-2xl"></div>
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-purple-400/10 opacity-30 blur-3xl"></div>
      </div>

      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="sacred-glass-heavy p-12 md:p-16">
          {/* Sacred Mountain Icon */}
          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <span className="text-4xl text-white">🏔️</span>
            </div>
            <h1 className="mb-4 font-serif text-4xl leading-tight text-blue-900 md:text-5xl">
              Path{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Not Found
              </span>
            </h1>
            <p className="mx-auto mb-2 max-w-xl text-xl leading-relaxed text-blue-700 md:text-2xl">
              The path you seek has wandered into uncharted territory.
            </p>
            <p className="mx-auto max-w-lg text-lg leading-relaxed text-blue-600">
              Every journey has unexpected turns. Let us guide you back to your sacred path of
              transformation and renewal.
            </p>
          </div>

          {/* Journey Stats */}
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                <span className="text-lg text-white">🧭</span>
              </div>
              <h3 className="mb-1 font-serif text-lg text-blue-900">Find Direction</h3>
              <p className="text-sm leading-relaxed text-blue-600">
                Return to your spiritual compass
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-md">
                <span className="text-lg text-white">📖</span>
              </div>
              <h3 className="mb-1 font-serif text-lg text-blue-900">Continue Reading</h3>
              <p className="text-sm leading-relaxed text-blue-600">Your guidebook awaits</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
                <span className="text-lg text-white">✨</span>
              </div>
              <h3 className="mb-1 font-serif text-lg text-blue-900">Resume Journey</h3>
              <p className="text-sm leading-relaxed text-blue-600">Your transformation continues</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4 text-center">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/" className="sacred-gold-button px-8 py-4 text-lg">
                Return Home 🏠
              </Link>
              <Link href="/dashboard" className="sacred-button px-8 py-4 text-lg">
                Continue Journey ✨
              </Link>
            </div>

            <p className="mt-6 text-sm italic text-blue-600">
              &ldquo;Not all who wander are lost, but all who seek shall find their way.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
