'use client';

export const runtime = 'nodejs';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const VerifyRequestPage: FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
                <div className="flex flex-col items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={60}
                        height={60}
                        className="mb-4"
                    />
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        检查您的邮箱
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        验证链接已发送到您的邮箱。请检查您的收件箱，点击链接完成登录。
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">注意事项</h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>邮件可能需要几分钟才能到达</li>
                                        <li>请检查您的垃圾邮件文件夹</li>
                                        <li>验证链接有效期为10分钟</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            返回登录页面
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyRequestPage; 