import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { PlaylistProvider } from '@/contexts/PlaylistContext'
import ErrorBoundary from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Renewed App V2',
  description: 'Sacred Path to Renewal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <PlaylistProvider>
              {children}
            </PlaylistProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
