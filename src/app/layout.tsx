import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Weather',
  description:
    'Current conditions, forecast, and air quality for any location.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-[var(--color-border)]/60 bg-[var(--color-surface)]/70 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4 sm:px-6">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-[var(--color-brand-400)]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6 14a4 4 0 1 1 1.5-7.7 6 6 0 0 1 11.6 1.7A4.5 4.5 0 0 1 18 18H7a4 4 0 0 1-1-4z" />
            </svg>
            <h1 className="text-lg font-semibold tracking-tight">Weather</h1>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-[var(--color-border)]/60 py-4 text-center text-xs text-[var(--color-muted)]">
          Data from OpenWeatherMap
        </footer>
      </body>
    </html>
  );
}
