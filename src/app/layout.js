import "./globals.css";

export const metadata = {
  title: "Renewed: The New Man Story",
  description: "An interactive guidebook for spiritual transformation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}