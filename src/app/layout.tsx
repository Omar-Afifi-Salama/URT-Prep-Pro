
import type { Metadata } from 'next';
import { Inter, Space_Grotesk, Lora, Roboto_Mono, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FontProvider } from '@/context/font-provider';
import { UsageProvider } from '@/context/usage-provider';
import { Analytics } from '@vercel/analytics/react';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fontSpaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const fontLora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  weight: ['400', '700'],
});

const fontRobotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

const fontNotoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-sans-arabic',
  weight: ['400', '700'],
});


export const metadata: Metadata = {
  title: 'Catalyst URT Prep',
  description: 'AI-powered practice for university entrance test success.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontInter.variable,
          fontSpaceGrotesk.variable,
          fontLora.variable,
          fontRobotoMono.variable,
          fontNotoSansArabic.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <UsageProvider>
            <FontProvider>
              {children}
              <Toaster />
            </FontProvider>
          </UsageProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
