import type { Metadata } from "next";
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { LoadingIndicator } from '@/components/ui/loading-indicator';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';
import "./globals.css";

const AuthGuard = dynamic(() => import('@/components/auth-guard'), {
  loading: () => <LoadingIndicator fullscreen />
});

const ErrorHandler = dynamic(() => import('@/components/error-handler'), {
  ssr: false
});


export const metadata: Metadata = {
  title: "犀知",
  description: "犀知 智能学习流程 实现高效学习与能力提升",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Suspense fallback={<LoadingIndicator fullscreen />}>
          <SessionProvider>
            <Toaster position="top-center" />
            <ErrorHandler />
            <AuthGuard>
              {children}
            </AuthGuard>
          </SessionProvider>
        </Suspense>
      </body>
    </html>
  );
}
