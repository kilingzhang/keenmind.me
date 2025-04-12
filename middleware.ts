import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // if (request.nextUrl.pathname.startsWith('/mapi/')) {
  //   const { auth } = await import('@/lib/auth/jwt')
  //   // @ts-ignore
  //   return auth(request)
  // } else {
  //   const { auth } = await import('@/lib/auth/session')
  //   // @ts-ignore
  //   return auth(request)
  // }
}


export const config = {
  matcher: [
    // 匹配所有路径，但排除:
    // - Next.js 静态资源 (_next/static)
    // - Next.js 图片资源 (_next/image) 
    // - 网站图标 (favicon.ico)
    // - robots.txt
    // - sitemap.xml
    // - 所有图片文件 (.svg|.png|.jpg|.jpeg)
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|ico|txt)).*)',
  ]
}