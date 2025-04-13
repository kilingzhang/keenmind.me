import type { Metadata } from "next";
import { Suspense } from "react";
import { SessionProvider } from "next-auth/react";
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';
import "./globals.css";
import { Analytics } from '@/components/analytics'

// 动态加载组件
const ErrorHandler = dynamic(() => import('@/components/error-handler'), {
  ssr: false,
});

const AuthGuard = dynamic(() => import('@/components/auth-guard'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: {
    template: '%s | 犀知',
    default: '犀知 - 智能问答驱动成长',
  },
  description: '通过AI驱动的智能问答系统，帮助开发者构建结构化知识体系，持续提升技术能力，实现职业成长',
  metadataBase: new URL('https://keenmind.me'),
  manifest: '/manifest.json',
  applicationName: '犀知',
  keywords: ['AI学习', '智能问答', '开发者成长', '技术学习', '面试准备'],
  authors: [{ name: 'KeenMind Team' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://keenmind.me',
    title: '犀知 - 智能问答驱动成长',
    description: '通过AI驱动的智能问答系统，帮助开发者构建结构化知识体系，持续提升技术能力，实现职业成长',
    siteName: '犀知',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Suspense fallback={<div className="min-h-screen bg-slate-50 animate-pulse"></div>}>
          <SessionProvider>
            <Toaster position="top-center" />
            <ErrorHandler />
            <AuthGuard>
              {children}
            </AuthGuard>
          </SessionProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
