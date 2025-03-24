import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/auth/AuthProvider'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

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
