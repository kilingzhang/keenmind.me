import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/link";

const pricingPlans = [
    {
        name: "基础会员",
        price: "免费",
        description: "初步体验犀知的智能学习系统",
        features: [
            "基础AI问答功能",
            "每日限次模拟面试（1次）",
            "基础学习资源",
            "社区互动",
            "能力图谱基础版"
        ],
        popular: false,
        gradient: "from-indigo-50/80 via-purple-50/80 to-indigo-50/80",
        action: "立即开始",
        link: "/signup"
    },
    {
        name: "高级会员",
        price: "¥9.9",
        description: "全面提升技术能力，进阶职业发展",
        features: [
            "无限次AI问答",
            "每日限次模拟面试（2次）",
            "每周限次技术评估（1次）",
            "高级学习资源",
            "学习路径规划",
            "进度追踪与分析",
            "专项训练挑战"
        ],
        popular: true,
        gradient: "from-purple-50/80 via-pink-50/80 to-purple-50/80",
        action: "即将开放",
        link: "/waitlist"
    },
    {
        name: "企业会员",
        price: "定制",
        description: "为团队提供系统化能力提升方案",
        features: [
            "团队管理功能",
            "定制化内容",
            "批量评估报告",
            "企业知识图谱",
            "API接入",
            "团队学习路径",
            "定制Boss挑战",
            "团队数据分析",
            "专属客户支持"
        ],
        popular: false,
        gradient: "from-pink-50/80 via-indigo-50/80 to-pink-50/80",
        action: "联系我们",
        link: "/contact"
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className="relative py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-20">
                    <span className="inline-block text-2xl mb-4">💎</span>
                    <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
                        会员方案
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        选择适合您的学习方案，开启技术成长之旅
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
                                        推荐方案
                                        <span className="ml-1">⭐️</span>
                                    </span>
                                </div>
                            )}

                            <CardHeader className="pb-8">
                                <CardTitle className="text-2xl text-slate-800 mb-2">{plan.name}</CardTitle>
                                <CardDescription className="text-slate-600">{plan.description}</CardDescription>
                                <div className="mt-6 flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                                    {plan.price !== "免费" && plan.price !== "定制" && <span className="text-slate-600">/月</span>}
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
                                <Link href={plan.link} className="w-full">
                                    <Button
                                        className={`w-full ${plan.popular
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
                                            : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200"
                                            } transform hover:-translate-y-0.5 transition-all duration-300`}
                                        variant={plan.popular ? "default" : "secondary"}
                                        size="lg"
                                    >
                                        {plan.action}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-600">
                        高级会员支持7天无理由退款 · 按月支付随时可取消
                    </p>
                </div>
            </div>
        </section>
    );
}