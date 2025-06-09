// src/app/layout.js
import "./globals.css"; // Your global styles
import Layout from "@/components/Layout"; // Your main site layout component
import { AuthProvider } from "@/contexts/AuthContext"; // Import the AuthProvider

export const metadata = {
  title: "Renewed: The New Man Story",
  description: "An interactive guidebook for spiritual transformation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider> {/* Wrap Layout (and thus children) with AuthProvider */}
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}