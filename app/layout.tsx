import type {Metadata} from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { ThemeProvider } from '@/components/theme-provider';
import { ErrorInterceptor } from '@/components/error-interceptor';
import { SplashScreen } from '@/components/splash-screen';

export const metadata: Metadata = {
  title: 'Futurenomix | Business, Innovation & Community Growth Platform',
  description: 'Business, Innovation & Community Growth Platform',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-200 dark:from-zinc-800 dark:to-black text-foreground antialiased" suppressHydrationWarning>
        <ErrorInterceptor />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SplashScreen>
            <MainLayout>{children}</MainLayout>
          </SplashScreen>
        </ThemeProvider>
      </body>
    </html>
  );
}
