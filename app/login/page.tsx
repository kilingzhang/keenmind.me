'use client';
import { LoadingButton } from '@/components/ui/loading-button';
import { signInWithEmail, signInWithGithub, signInWithWechat } from '@/lib/auth/actions';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 p-6 sm:p-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Login</h2>
                    <p className="mt-2 text-sm sm:text-base text-gray-600">Please select login method</p>
                </div>

                <div className="space-y-3">
                    {isWechat && (
                        <form>
                            <SubmitButton
                                formAction={(formData: FormData) => {
                                    return signInWithWechat(formData, {
                                        redirectTo: redirectTo,
                                        redirect: true,
                                    });
                                }}
                                className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            >
                                Login with WeChat
                            </SubmitButton>
                        </form>
                    )}

                    <form>
                        <SubmitButton
                            formAction={(formData: FormData) => {
                                return signInWithGithub(formData, {
                                    redirectTo: redirectTo,
                                    redirect: true,
                                });
                            }}
                            className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                        >
                            Login with GitHub
                        </SubmitButton>
                    </form>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                <form className="space-y-4">
                    <div>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="Enter your email"
                            aria-label="Email"
                        />
                    </div>
                    <SubmitButton
                        formAction={(formData: FormData) => {
                            return signInWithEmail(formData, {
                                redirectTo: redirectTo,
                                redirect: true,
                            });
                        }}
                        className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        Send login link
                    </SubmitButton>
                </form>
            </div>
        </div>
    );
}
