"use client"

import { Button } from "@/components/ui/button"

const HowItWorks = () => {
    return (
        <section className="relative py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <span className="inline-block text-2xl mb-4">🔄</span>
                    <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
                        智能学习流程
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        体验无限问答闭环流，实现高效学习与能力提升
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="relative">
                        <div className="absolute top-1/2 left-full w-24 h-1 bg-gradient-to-r from-indigo-300 to-transparent -translate-y-1/2 hidden md:block"></div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                            <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 text-2xl font-bold">1</div>
                            <h3 className="text-xl font-semibold mb-4 text-slate-800">智能提问</h3>
                            <p className="text-slate-600">系统结合图谱、历史和上下文，智能生成针对性技术问题，激发思考。</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute top-1/2 left-full w-24 h-1 bg-gradient-to-r from-indigo-300 to-transparent -translate-y-1/2 hidden md:block"></div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                            <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 text-2xl font-bold">2</div>
                            <h3 className="text-xl font-semibold mb-4 text-slate-800">用户回答</h3>
                            <p className="text-slate-600">支持语音或文字输入，表达您的思考，锻炼解释复杂概念的能力。</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute top-1/2 left-full w-24 h-1 bg-gradient-to-r from-indigo-300 to-transparent -translate-y-1/2 hidden md:block"></div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                            <div className="w-14 h-14 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-6 text-2xl font-bold">3</div>
                            <h3 className="text-xl font-semibold mb-4 text-slate-800">多维反馈</h3>
                            <p className="text-slate-600">AI提供结构化分析、改进建议、标准答案和相关知识点链接。</p>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                            <div className="w-14 h-14 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 text-2xl font-bold">4</div>
                            <h3 className="text-xl font-semibold mb-4 text-slate-800">持续深入</h3>
                            <p className="text-slate-600">选择继续探索或追问深入，系统根据您的反应智能调整学习路径。</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-200/50 transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                        开始您的学习旅程
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks; 