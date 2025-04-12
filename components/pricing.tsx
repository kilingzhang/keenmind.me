'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const pricingPlans = [
    {
        name: "基础版",
        price: "¥99",
        description: "适合个人用户和小型团队",
        features: [
            "每月100次AI对话",
            "基础文档管理",
            "标准客户支持",
            "1个用户账号",
            "基础数据分析"
        ],
        popular: false,
        gradient: "from-indigo-50/80 via-purple-50/80 to-indigo-50/80"
    },
    {
        name: "专业版",
        price: "¥299",
        description: "适合成长期企业和专业团队",
        features: [
            "每月1000次AI对话",
            "高级文档管理",
            "优先客户支持",
            "5个用户账号",
            "高级数据分析",
            "自定义模型训练",
            "API访问"
        ],
        popular: true,
        gradient: "from-purple-50/80 via-pink-50/80 to-purple-50/80"
    },
    {
        name: "企业版",
        price: "¥999",
        description: "适合大型企业和机构",
        features: [
            "无限AI对话",
            "企业级文档管理",
            "24/7专属支持",
            "无限用户账号",
            "企业级数据分析",
            "专属模型定制",
            "高级API集成",
            "专属服务器部署",
            "SLA保障"
        ],
        popular: false,
        gradient: "from-pink-50/80 via-indigo-50/80 to-pink-50/80"
    }
];

export default function Pricing() {
    return (
        <section className="relative py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <span className="inline-block text-2xl mb-4">💎</span>
                    <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
                        选择适合您的方案
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        灵活的定价方案，满足您的不同需求
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative bg-white/60 backdrop-blur-sm border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transform hover:-translate-y-1 transition-all duration-300 ${plan.popular
                                ? "ring-2 ring-indigo-400/30 scale-105"
                                : ""
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                                    <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
                                        最受欢迎
                                        <span className="ml-1">⭐️</span>
                                    </span>
                                </div>
                            )}

                            <CardHeader className="pb-8">
                                <CardTitle className="text-2xl text-slate-800 mb-2">{plan.name}</CardTitle>
                                <CardDescription className="text-slate-600">{plan.description}</CardDescription>
                                <div className="mt-6 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                                    <span className="text-slate-600">/月</span>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-700">
                                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-[12px] text-indigo-600 bg-indigo-50 rounded-full mt-0.5">✓</span>
                                            <span className="leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="pt-6">
                                <Button
                                    className={`w-full ${plan.popular
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                                        : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200"
                                        } transform hover:-translate-y-0.5 transition-all duration-300`}
                                    variant={plan.popular ? "default" : "secondary"}
                                    size="lg"
                                >
                                    即将开放
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-600">
                        所有方案均包含14天免费试用 · 随时取消
                    </p>
                </div>
            </div>
        </section>
    );
}