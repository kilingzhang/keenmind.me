import { Link } from "@/components/ui/link"

const WhyChooseUs = () => {
    return (
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
                                    <Link href="/explore" className="inline-block">
                                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">继续探索</button>
                                    </Link>
                                    <Link href="/ask" className="inline-block">
                                        <button className="px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-sm">我有疑问</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs; 