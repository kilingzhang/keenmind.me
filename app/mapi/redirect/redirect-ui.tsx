'use client';

import { useCallback, useEffect, useState } from "react";

export default function RedirectUI({ scheme }: { scheme: string }) {
    const [redirectFailed, setRedirectFailed] = useState(false);

    const handleRedirect = useCallback(() => {
        try {
            console.log('Attempting to open app:', scheme);

            // 尝试通过iframe打开
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = scheme;
            document.body.appendChild(iframe);

            // 同时尝试直接打开
            window.location.href = scheme;

            setTimeout(() => {
                document.body.removeChild(iframe);
                // 如果页面仍然可见,说明可能打开失败
                if (!document.hidden) {
                    setRedirectFailed(true);
                }
            }, 2000);
        } catch (error) {
            console.error('Failed to open app:', error);
            setRedirectFailed(true);
        }
    }, [scheme, setRedirectFailed]);

    useEffect(() => {
        handleRedirect();

        // 监听页面可见性变化
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // 页面被切换到后台,说明app已打开
                setRedirectFailed(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [handleRedirect]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
            <div className="w-full max-w-md mx-auto">
                {/* Card Container */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700/50">
                    {/* Logo or Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Title and Description */}
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Successfully connected
                            <br />to keenmind.me Account
                        </h1>

                        <p className="text-gray-400 text-sm">
                            You have successfully connected to keenmind.me Account. Now
                            it&apos;s time to open keenmind.me to use the new commands of the
                            extension.
                        </p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleRedirect}
                        className="mt-8 w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <span>Open keenmind.me</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </button>

                    {/* Error Message */}
                    {redirectFailed && (
                        <div className="mt-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-yellow-400 font-medium">It seems keenmind.me app didn&apos;t open correctly</p>
                                    <p className="mt-2 text-sm text-yellow-400/80">Possible reasons:</p>
                                    <ul className="mt-1 text-sm text-yellow-400/80 list-disc list-inside space-y-1">
                                        <li>keenmind.me app is not installed</li>
                                        <li>Browser blocked automatic app opening</li>
                                        <li>System permissions prevented app launch</li>
                                    </ul>
                                    <p className="mt-2 text-sm text-yellow-400/90">
                                        Please ensure keenmind.me app is installed, then click the button above to try again.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Text */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    Having issues?
                    <a href="#" className="text-blue-400 hover:text-blue-300 ml-1">
                        View Help Documentation
                    </a>
                </p>
            </div>
        </div>
    );
} 