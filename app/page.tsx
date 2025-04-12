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
                  开发者能力提升平台
                  <span className="ml-2 animate-bounce">→</span>
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 leading-tight tracking-tight animate-gradient">
                犀知 - 智能问答驱动成长
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                通过AI驱动的智能问答系统，帮助开发者构建结构化知识体系，持续提升技术能力，实现职业成长。告别枯燥学习，拥抱互动式进阶。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-200/50 transform hover:-translate-y-0.5 transition-all duration-300"
                  onClick={() => window.location.href = '/login'}
                >
                  立即体验
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
              <div className="relative w-[280px] h-[280px] lg:w-[480px] lg:h-[480px] mx-auto rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-full animate-spin-slow" />
                <img
                  src="/logo.png"
                  alt="犀知 Logo"
                  className={`w-full h-full object-cover transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    } hover:rotate-[360deg] hover:scale-105 transform-gpu rounded-full`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Why Choose 犀知 Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block text-2xl mb-4">🔆</span>
            <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
              为什么选择犀知
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              我们重新定义开发者学习体验，从传统学习模式突破，走向高效成长之路
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-10">
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-2xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">能力为本 vs. 应试技巧</h3>
                    <p className="text-slate-600 leading-relaxed">
                      我们不仅关注短期面试准备，更注重真实技术能力的持续提升与沉淀，让您的成长具有长期价值。
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-2xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">AI深度赋能 vs. 辅助工具</h3>
                    <p className="text-slate-600 leading-relaxed">
                      AI不仅是辅助工具，更是个性化学习体验的核心引擎，为您提供结构化反馈与智能化学习路径。
                    </p>
                  </div>
                </div>

                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-2xl">
                    🎮
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800">轻松有趣 vs. 枯燥压力</h3>
                    <p className="text-slate-600 leading-relaxed">
                      通过问答驱动、游戏化挑战和能力可视化，让学习过程变得轻松、有趣且充满成就感。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/30 via-purple-200/30 to-indigo-200/30 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-indigo-100">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div className="flex-1 p-4 bg-indigo-50 rounded-xl">
                      <p className="text-slate-700">什么是 Go 中的 race condition？</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 justify-end">
                    <div className="flex-1 p-4 bg-purple-50 rounded-xl">
                      <p className="text-slate-700">Race condition 是指多个 goroutine 并发访问同一资源时...</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                      😊
                    </div>
                  </div>

                  <div className="p-4 border border-indigo-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-sm">✓</span>
                      <h4 className="font-medium text-slate-800">结构分析</h4>
                    </div>
                    <ul className="space-y-2 pl-8">
                      <li className="text-green-600 text-sm flex items-center gap-1">
                        <span>✓</span>
                        <span>定义部分完整</span>
                      </li>
                      <li className="text-amber-600 text-sm flex items-center gap-1">
                        <span>!</span>
                        <span>缺少实际示例</span>
                      </li>
                      <li className="text-indigo-600 text-sm flex items-center gap-1">
                        <span>?</span>
                        <span>提示：可以提及 Mutex 解决方案</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">继续探索</button>
                    <button className="px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-sm">我有疑问</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <Pricing />

      {/* Footer */}
      <footer className="relative py-20 border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">关于犀知</h4>
              <p className="text-slate-600 leading-relaxed">AI驱动的开发者能力成长平台，让学习成为有趣的对话。</p>
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
              © {new Date().getFullYear()} 犀知 All rights reserved.
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