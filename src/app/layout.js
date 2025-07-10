// src/app/layout.js
'use client';
import './globals.css';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';
import { SpiritualJourneyProvider, SacredCelebrationManager } from '@/components/sacred-simplicity';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Sacred Journey Fonts - Playfair Display + Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <title>Renewed: The New Man Story</title>
        <meta name="description" content="An interactive guidebook for spiritual transformation." />
      </head>
      <body className="font-body antialiased">
        <ErrorBoundary>
          <AuthProvider>
            <SpiritualJourneyProvider>
              <Layout>{children}</Layout>
              <SacredCelebrationManager />
            </SpiritualJourneyProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
