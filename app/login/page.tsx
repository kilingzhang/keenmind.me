'use client';
import { LoadingButton } from '@/components/ui/loading-button';
import { signInWithEmail, signInWithGithub, signInWithWechat } from '@/lib/auth/actions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';

export const runtime = 'nodejs';

const isWechatBrowser = () => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('micromessenger') !== -1;
};

function SubmitButton({
    children,
    className,
    formAction,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    formAction?: (formData: FormData) => Promise<void>;
}) {
    const { pending } = useFormStatus();

    return (
        <LoadingButton
            loading={pending}
            className={className}
            formAction={formAction}
            {...props}
        >
            {children}
        </LoadingButton>
    );
}

export default function LoginPage() {
    const [isWechat, setIsWechat] = useState(false);
    const searchParams = useSearchParams();
    const [redirectTo, _] = useState(searchParams.get('redirectTo') || '/profile');
    useEffect(() => {
        setIsWechat(isWechatBrowser());
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* 极简背景效果 - 模拟图片效果 */}
            <div className="fixed inset-0 z-0">
                {/* 主背景 - 静态渐变 */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-pink-50 to-cyan-50" />

                {/* 顶部渐变装饰 */}
                <div className="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-cyan-50 to-transparent opacity-70" />

                {/* 底部渐变装饰 */}
                <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-pink-50 to-transparent opacity-70" />

                {/* 极简柔和流动效果 */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0 bg-gradient-radial from-pink-100/20 to-transparent animate-pulse-very-slow" style={{ transformOrigin: 'center' }} />
                    <div className="absolute inset-0 bg-gradient-radial from-cyan-100/20 to-transparent animate-pulse-very-slow delay-1000" style={{ transformOrigin: 'center' }} />
                </div>

                {/* 极淡的装饰线条 - 模拟图片中的波纹 */}
                <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200/20 to-transparent"></div>
            </div>

            {/* 内容区域 */}
            <div className="relative z-10 w-full max-w-[380px] sm:max-w-[480px] mx-auto px-4">
                {/* 品牌标识 */}
                <div className="mb-12 flex flex-col items-center animate-fade-in">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-4 relative">
                        <Image
                            src="/logo.png"
                            alt="犀知"
                            width={96}
                            height={96}
                            className="rounded-2xl shadow-sm transition-all duration-300 hover:scale-105 relative z-10"
                        />
                    </div>
                    <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-slate-800">犀知</h1>
                    <p className="mt-2 text-sm sm:text-base text-slate-600">AI驱动的开发者能力成长平台</p>
                </div>

                {/* 登录表单容器 */}
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-sm border border-pink-100/20 relative overflow-hidden">
                    {/* 微妙的内部光效 */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/30 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pink-200/30 to-transparent"></div>

                    <div className="relative z-10 space-y-6">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">登录</h2>
                            <p className="mt-2 text-sm text-slate-500">请选择登录方式</p>
                        </div>

                        <div className="space-y-4">
                            {isWechat && (
                                <form>
                                    <SubmitButton
                                        formAction={(_: FormData) => {
                                            return signInWithWechat({
                                                redirectTo: redirectTo,
                                                redirect: true,
                                            });
                                        }}
                                        className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm sm:text-base font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:scale-[1.01]"
                                    >
                                        <div className="flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">
                                                <path d="M12 0c-6.626 0-12 5.372-12 12 0 6.627 5.374 12 12 12 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12zm5.543 16.389c.889-.644 1.457-1.597 1.457-2.656 0-1.94-1.888-3.514-4.217-3.514-2.329 0-4.217 1.574-4.217 3.514 0 1.941 1.888 3.514 4.217 3.514.481 0 .946-.068 1.377-.192l.124-.019c.081 0 .154.025.224.065l.923.533.081.026c.078 0 .14-.063.14-.14l-.022-.103-.19-.709-.015-.09c0-.094.047-.178.118-.229zm-7.483-10.049c-2.794 0-5.06 1.888-5.06 4.217 0 1.27.682 2.414 1.748 3.187.086.061.142.161.142.275l-.018.107-.228.851-.027.123c0 .093.076.169.169.169l.097-.032 1.108-.639c.083-.048.172-.078.269-.078l.149.022c.516.149 1.074.231 1.651.231l.278-.006c-.11-.329-.17-.675-.17-1.034 0-2.123 2.066-3.845 4.615-3.845l.275.007c-.381-2.015-2.473-3.555-4.998-3.555zm3.317 6.831c-.31 0-.562-.252-.562-.562 0-.311.252-.562.562-.562.311 0 .563.251.563.562 0 .31-.252.562-.563.562zm2.812 0c-.311 0-.562-.252-.562-.562 0-.311.251-.562.562-.562.31 0 .562.251.562.562 0 .31-.252.562-.562.562zm-7.815-3.289c-.373 0-.675-.302-.675-.675 0-.372.302-.674.675-.674.372 0 .674.302.674.674 0 .373-.302.675-.674.675zm3.373 0c-.373 0-.675-.302-.675-.675 0-.372.302-.674.675-.674.373 0 .675.302.675.674 0 .373-.302.675-.675.675z" />
                                            </svg>
                                            <span className="ml-4">使用微信登录</span>
                                        </div>
                                    </SubmitButton>
                                </form>
                            )}

                            <form>
                                <SubmitButton
                                    formAction={(_: FormData) => {
                                        return signInWithGithub({
                                            redirectTo: redirectTo,
                                            redirect: true,
                                        });
                                    }}
                                    className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm sm:text-base font-medium text-white bg-gradient-to-r from-slate-700 to-slate-800 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-300 hover:scale-[1.01]"
                                >
                                    <div className="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"></path>
                                        </svg>
                                        <span className="ml-4">使用 GitHub 登录</span>
                                    </div>
                                </SubmitButton>
                            </form>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-3 bg-white/80 text-slate-400 rounded-full text-xs">或使用邮箱登录</span>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full pl-10 px-3 sm:px-4 py-2 sm:py-3 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-pink-200 focus:border-pink-200 transition-all duration-300 bg-white/70"
                                    placeholder="请输入您的邮箱"
                                    aria-label="邮箱"
                                />
                            </div>
                            <SubmitButton
                                formAction={(formData: FormData) => {
                                    const email = formData.get('email') as string;
                                    return signInWithEmail(email, {
                                        redirectTo: redirectTo,
                                        redirect: true,
                                    });
                                }}
                                className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm sm:text-base font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 hover:scale-[1.01]"
                            >
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="ml-4">发送登录链接</span>
                                </div>
                            </SubmitButton>
                        </form>

                        <div className="text-center text-[10px] sm:text-xs text-slate-400 pt-2">
                            登录即表示您同意犀知 <a href="/terms" className="text-pink-500 hover:text-pink-600 underline decoration-dotted underline-offset-2">服务条款</a> 和 <a href="/privacy" className="text-pink-500 hover:text-pink-600 underline decoration-dotted underline-offset-2">隐私政策</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 自定义动画效果 */}
            <style jsx global>{`
                @keyframes pulse-very-slow {
                    0% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.05); }
                    100% { opacity: 0.1; transform: scale(1); }
                }
                .animate-pulse-very-slow {
                    animation: pulse-very-slow 10s ease-in-out infinite;
                }
                .delay-1000 {
                    animation-delay: 5s;
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .bg-gradient-radial {
                    background-image: radial-gradient(var(--tw-gradient-stops));
                }
            `}</style>
        </div>
    );
}
