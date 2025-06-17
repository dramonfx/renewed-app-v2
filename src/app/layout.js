// src/app/layout.js - Root layout with minimal setup
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Renewed: The New Man Story",
  description: "An interactive guidebook for spiritual transformation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
