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
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-indigo-50/40 to-purple-50/40 px-2 sm:px-4 lg:px-8">
            {/* 装饰性背景元素 - 在小屏幕上隐藏或缩小 */}
            <div className="hidden sm:block absolute top-20 left-20 w-32 sm:w-64 h-32 sm:h-64 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="hidden sm:block absolute bottom-20 right-20 w-40 sm:w-80 h-40 sm:h-80 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="hidden sm:block absolute top-1/3 right-1/4 w-20 sm:w-40 h-20 sm:h-40 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* 几何装饰 - 在小屏幕上隐藏 */}
            <div className="hidden sm:block absolute top-10 right-10 w-8 sm:w-12 h-8 sm:h-12 border-4 border-indigo-200/40 rounded-lg rotate-12 animate-spin-slow"></div>
            <div className="hidden sm:block absolute bottom-10 left-10 w-10 sm:w-16 h-10 sm:h-16 border-4 border-purple-200/40 rounded-full animate-bounce-slow"></div>

            {/* 品牌标识 - 调整大小 */}
            <div className="mb-4 sm:mb-8 flex flex-col items-center animate-fade-in">
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-2">
                    <Image
                        src="/logo.png"
                        alt="犀知"
                        width={80}
                        height={80}
                        className="rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
                    />
                </div>
                <h1 className="mt-2 text-xl sm:text-2xl font-bold text-slate-800">犀知</h1>
                <p className="text-xs sm:text-sm text-slate-500">AI驱动的开发者能力成长平台</p>
            </div>

            <div className="w-full max-w-[320px] sm:max-w-md space-y-6 sm:space-y-8 bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-slate-100 shadow-md hover:shadow-lg transition-all duration-300 relative z-10 mx-2 sm:mx-0">
                <div className="text-center">
                    <h2 className="text-xl sm:text-3xl font-bold text-slate-800">登录</h2>
                    <p className="mt-1 sm:mt-2 text-sm text-slate-600">请选择登录方式</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                    {isWechat && (
                        <form>
                            <SubmitButton
                                formAction={(_: FormData) => {
                                    return signInWithWechat({
                                        redirectTo: redirectTo,
                                        redirect: true,
                                    });
                                }}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 hover:scale-[1.02] group"
                            >
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 group-hover:animate-bounce" fill="currentColor" viewBox="0 0 24 24" fill-rule="evenodd" clip-rule="evenodd">
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
                            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-300 hover:scale-[1.02] group"
                        >
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z"></path>
                                </svg>
                                <span className="ml-4">使用 GitHub 登录</span>
                            </div>
                        </SubmitButton>
                    </form>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white/80 text-slate-500 rounded-full">或使用邮箱登录</span>
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
                            className="w-full pl-10 px-3 sm:px-4 py-2 sm:py-3 border border-slate-200 rounded-lg sm:rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/80"
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
                        className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm sm:text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-[1.02] group"
                    >
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 group-hover:animate-pulse" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                            </svg>
                            <span className="ml-4">发送登录链接</span>
                        </div>
                    </SubmitButton>
                </form>

                <div className="text-center text-[10px] sm:text-xs text-slate-500 pt-2 sm:pt-4">
                    登录即表示您同意犀知 <a href="/terms" className="text-indigo-600 hover:text-indigo-800 underline decoration-dotted underline-offset-2">服务条款</a> 和 <a href="/privacy" className="text-indigo-600 hover:text-indigo-800 underline decoration-dotted underline-offset-2">隐私政策</a>
                </div>
            </div>

            {/* 底部波浪动效 - 在小屏幕上减小高度 */}
            <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16 w-full animate-wave">
                    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-full">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-indigo-400"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-purple-400"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-indigo-400"></path>
                    </svg>
                </div>
            </div>

            {/* 添加全局动画样式 */}
            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes wave {
                    0% { transform: translateX(0) translateZ(0) scaleY(1) }
                    50% { transform: translateX(-25%) translateZ(0) scaleY(0.8) }
                    100% { transform: translateX(-50%) translateZ(0) scaleY(1) }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 5s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                .animate-wave {
                    animation: wave 12s -3s linear infinite;
                    transform-origin: 50% 50%;
                    width: 200%;
                }
                .group:hover svg {
                    transform: scale(1.1);
                    transition: transform 0.2s ease-in-out;
                }
            `}</style>
        </div>
    );
}
