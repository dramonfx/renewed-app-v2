
// Standalone layout for Sacred Journal Workshop - NO AUTH DEPENDENCIES
import "../globals.css";

export const metadata = {
  title: "Sacred Journal Workshop",
  description: "A sacred space for spiritual reflection and transformation.",
};

export default function WorkshopLayout({ children }) {
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
      <body className="font-body antialiased min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* NO AUTH PROVIDER - NO LAYOUT COMPONENT - STANDALONE */}
        {children}
      </body>
    </html>
  );
}
