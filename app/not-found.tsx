'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

function NotFoundContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700">页面未找到</h2>
          <Image
            src="/images/404/confused-travolta.gif"
            width={400}
            height={300}
            alt="404 Not Found"
            className="mx-auto mb-8"
            priority
          />
          <p className="text-slate-500">抱歉，您访问的页面不存在或已被移除。</p>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="default"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-200/50 transform hover:-translate-y-0.5 transition-all duration-300"
            onClick={() => window.history.back()}
          >
            返回上一页
          </Button>
          <Button
            variant="outline"
            className="border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-slate-50 transform hover:-translate-y-0.5 transition-all duration-300"
            onClick={() => window.location.href = '/'}
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <NotFoundContent />
  );
}
