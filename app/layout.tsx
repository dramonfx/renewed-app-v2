
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../src/components/theme-provider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-clean-sans',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-sacred-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Renewed App - Sacred Blue Theme',
  description: 'A peaceful and sacred onboarding experience with calming blue aesthetics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfairDisplay.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}