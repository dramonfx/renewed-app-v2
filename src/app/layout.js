// src/app/layout.js
import './globals.css';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Renewed: The New Man Story',
  description: 'An interactive guidebook for spiritual transformation.',
};

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
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
