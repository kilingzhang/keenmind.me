export const runtime = 'nodejs';

import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'
import { OptimizedImage } from '@/components/ui/optimized-image'
import { Link } from "@/components/ui/link"
import { Suspense } from "react";

// 设置页面元数据
export const metadata = {
  alternates: {
    canonical: 'https://keenmind.me'
  }
};

// 静态预取链接路径（仅在组件内部使用）
const PRELOADED_PATHS = ['/login', '/signup', '/explore', '/ask'];

// 懒加载组件，但使用优先级调整加载顺序
const Features = dynamic(() => import('@/components/features'), {
  loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-lg"></div>,
  ssr: true
})

const Pricing = dynamic(() => import('@/components/pricing'), {
  loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-lg"></div>,
  ssr: true
})

const HowItWorks = dynamic(() => import('../components/how-it-works'), {
  loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-lg"></div>,
  ssr: true
})

const WhyChooseUs = dynamic(() => import('../components/why-choose-us'), {
  loading: () => <div className="animate-pulse bg-slate-100 h-96 rounded-lg"></div>,
  ssr: true
})

export default function Page() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 overflow-hidden">
      {/* 预加载 React 资源 */}
      <link
        rel="preload"
        href="/logo.png"
        as="image"
        type="image/png"
        fetchPriority="high"
      />

      {/* 背景动效 */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_var(--tw-gradient-stops))] from-slate-100/50 via-white/25 to-slate-100/50 animate-spin-slow" />
      </div>

      {/* Hero Section - LCP 关键部分 */}
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
                <Link href="/login" prefetch={true}>
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-200/50 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    立即体验
                  </Button>
                </Link>
                <Link href="#features" prefetch={true}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-slate-50 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    了解更多
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200/30 via-purple-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse" />
              <div className="relative w-[280px] h-[280px] lg:w-[480px] lg:h-[480px] mx-auto rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-full animate-spin-slow" />
                <OptimizedImage
                  src="/logo.png"
                  alt="犀知 Logo"
                  className="w-full h-full object-cover opacity-100 scale-100 hover:rotate-[360deg] hover:scale-105 transform-gpu rounded-full transition-all duration-1000"
                  width={480}
                  height={480}
                  priority
                  sizes="(max-width: 768px) 280px, 480px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 其他非关键部分用Suspense包裹，优先渲染上面的关键内容 */}
      <Suspense fallback={<div className="h-20"></div>}>
        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Why Choose 犀知 Section */}
        <WhyChooseUs />

        {/* Pricing Section */}
        <Pricing />
      </Suspense>

      {/* Testimonials Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block text-2xl mb-4">💬</span>
            <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
              用户心声
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              听听开发者们如何通过犀知提升技术能力
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
                  👨‍💻
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">张明</h4>
                  <p className="text-slate-500 text-sm">后端开发工程师 · 2年经验</p>
                </div>
              </div>
              <p className="text-slate-600 italic mb-6">
                &quot;犀知帮我发现了Go并发编程中的盲点，通过持续问答和反馈，我的代码质量显著提升。最近的技术面试中，我能够流畅地讲解复杂概念，这在以前是难以想象的。&quot;
              </p>
              <div className="flex gap-1">
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
                  👩‍💻
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">李雪</h4>
                  <p className="text-slate-500 text-sm">计算机科学专业 · 应届毕业生</p>
                </div>
              </div>
              <p className="text-slate-600 italic mb-6">
                &quot;作为即将毕业的学生，我一直担心理论知识无法应用到实践中。犀知的问答系统和结构化反馈让我快速掌握了现实开发中的关键知识，顺利通过了几家知名公司的技术面试。&quot;
              </p>
              <div className="flex gap-1">
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-xl">
                  👨‍💻
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">王强</h4>
                  <p className="text-slate-500 text-sm">全栈开发者 · 技术团队负责人</p>
                </div>
              </div>
              <p className="text-slate-600 italic mb-6">
                &quot;我们团队将犀知作为技术培训的辅助工具。它不仅帮助新人快速上手，也让资深开发者能够系统化地巩固和拓展知识边界。高效、有趣且富有成效。&quot;
              </p>
              <div className="flex gap-1">
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
                <span className="text-amber-500">★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <h3 className="text-4xl font-bold text-indigo-600 mb-2">10,000+</h3>
              <p className="text-slate-600">技术问题库</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <h3 className="text-4xl font-bold text-purple-600 mb-2">85%</h3>
              <p className="text-slate-600">用户能力提升率</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <h3 className="text-4xl font-bold text-pink-600 mb-2">30+</h3>
              <p className="text-slate-600">技术领域覆盖</p>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 text-center">
              <h3 className="text-4xl font-bold text-indigo-600 mb-2">93%</h3>
              <p className="text-slate-600">用户满意度</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-white to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block text-2xl mb-4">❓</span>
            <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
              常见问题
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              解答您关于犀知的疑惑
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">犀知与传统学习平台有何不同？</h3>
              <p className="text-slate-600">
                犀知不是被动观看视频或阅读文档，而是通过AI驱动的交互式问答，引导您主动思考和表达。智能反馈系统会分析您的回答，提供多维度建议，让学习更高效、有趣且针对性强。
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">犀知适合什么水平的开发者？</h3>
              <p className="text-slate-600">
                犀知适合各个阶段的开发者，特别是有1-3年经验的工程师和计算机专业学生。系统会根据您的水平和学习历史智能调整问题难度，确保学习体验既有挑战性又不令人沮丧。
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">使用犀知需要特殊设备吗？</h3>
              <p className="text-slate-600">
                不需要。犀知可在任何现代浏览器中使用，支持PC、平板和手机。建议使用带麦克风的设备以便语音输入，但这不是必须的，文本输入同样有效。
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">犀知支持哪些编程语言和技术栈？</h3>
              <p className="text-slate-600">
                犀知当前重点支持主流后端语言（Go、Java、Python等）和前端技术（React、Vue等），以及数据库、系统设计、算法等核心领域。我们持续扩展技术覆盖面，确保与行业需求同步。
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-200/50 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              立即开始使用
            </Button>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-2xl mb-4">🛠️</span>
            <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
              技术覆盖领域
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              犀知助您掌握各种主流技术栈
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {["Go", "Java", "Python", "JavaScript", "TypeScript", "React", "Vue", "Node.js", "微服务", "Docker", "Kubernetes", "MySQL", "PostgreSQL", "MongoDB", "Redis", "算法", "系统设计", "并发编程", "网络协议", "安全", "Git", "CI/CD", "云原生", "设计模式"].map((tech, index) => (
              <span key={index} className="px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 cursor-pointer">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-24 px-6 bg-gradient-to-r from-indigo-100/50 to-purple-100/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            准备好提升您的技术能力了吗？
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            加入犀知，开启智能学习之旅，构建结构化知识体系，实现职业快速成长。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-200/50 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              免费开始使用
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-200 bg-white/50 backdrop-blur-sm text-slate-700 hover:bg-slate-50 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              预约演示
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 border-t border-slate-100 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">关于犀知</h4>
              <p className="text-slate-600 leading-relaxed">AI驱动的开发者能力成长平台，让学习成为有趣的对话。</p>
              <p className="text-slate-600 leading-relaxed mt-2">犀知是东莞市东城零七科技工作室（个体工商户）旗下品牌，致力于为开发者提供智能化的技术学习与成长服务。</p>
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
              © {new Date().getFullYear()} 东莞市东城零七科技工作室（个体工商户） All rights reserved.
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