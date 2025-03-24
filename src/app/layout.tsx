import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/auth/AuthProvider'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: true,
  display: 'swap',
});

const purgeCache = `
  // Forcefully remove my-listings
  (function() {
    // If on my-listings page, show a 404
    if (window.location.pathname.includes('my-listing')) {
      document.body.innerHTML = '404 Not Found';
      history.replaceState(null, '', '/marketplace');
      return;
    }

    // Purge all caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Force localStorage clear
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
  })();
`;

export const metadata: Metadata = {
  title: "HMC Senior Sale",
  description: "A marketplace for Harvey Mudd College seniors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <script dangerouslySetInnerHTML={{ __html: purgeCache }} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
