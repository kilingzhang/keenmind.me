"use client"

export const runtime = 'nodejs';

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'

const Features = dynamic(() => import('@/components/features'), {
  loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-lg"></div>
})

const Pricing = dynamic(() => import('@/components/pricing'), {
  loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-lg"></div>
})



function ClientPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden">
      {/* 背景动效 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-slate-100/50 via-white/25 to-slate-100/50 animate-spin-slow" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-20 md:pt-0">
        <div className="max-w-6xl mx-auto z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2 text-center lg:text-left space-y-8">
              <div className="inline-block animate-fade-in">
                <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 ring-1 ring-inset ring-indigo-400/20">
                  <span className="mr-2">🚀</span>
                  现已开放测试申请
                  <span className="ml-2 animate-bounce">→</span>
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 leading-tight tracking-tight animate-gradient">
                思侣 - 您的智能记忆伙伴
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                让思侣成为您的外置大脑，智能管理生活的点点滴滴。记录、提醒、分析，一站式解决您的记忆需求。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-200/50 transform hover:-translate-y-0.5 transition-all duration-300"
                  onClick={() => window.location.href = '/login'}
                >
                  加入测试候补名单
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-slate-50 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  了解更多
                </Button>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/30 via-purple-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-[280px] h-[280px] lg:w-[480px] lg:h-[480px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-full animate-spin-slow" />
                <img
                  src="/laughing-man-logo.png"
                  alt="思侣 Logo"
                  className={`w-full h-full object-contain transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    } hover:rotate-[360deg] hover:scale-105 transform-gpu`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Pricing Section */}
      <Pricing />

      {/* Footer */}
      <footer className="relative py-20 border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">关于思侣</h4>
              <p className="text-slate-600 leading-relaxed">让思维飞扬！您的无限外置大脑。</p>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">联系方式</h4>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-center gap-3 group">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full group-hover:scale-110 transition-transform duration-300">📧</span>
                  <span>contact@keenmind.me</span>
                </li>
                <li className="flex items-center gap-3 group">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full group-hover:scale-110 transition-transform duration-300">📍</span>
                  <span>广东省深圳市南山区科技园</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">关注我们</h4>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full border-slate-200 bg-white hover:bg-slate-50 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="text-xl">📱</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full border-slate-200 bg-white hover:bg-slate-50 transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="text-xl">💬</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 mt-12 pt-8 text-center">
            <p className="text-slate-500">
              © {new Date().getFullYear()} 思侣 All rights reserved.
            </p>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-700 transition-colors"
            >
              粤ICP备2024325515号
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return <ClientPage />
}