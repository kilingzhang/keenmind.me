'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LoadingButton } from '@/components/ui/loading-button';
import { auth_accounts } from "@prisma/client";
import { useCallback, useMemo, useTransition } from 'react';
import { toast } from 'sonner';
import { bindGithubAccount, bindWechatAccount, deleteAccount, logout, unlinkAccount } from '@/lib/auth/actions';
import { useRouter } from 'next/navigation';

const PROVIDER_MAP = {
    github: {
        name: 'GitHub',
        icon: '/github.svg'
    },
    wechat: {
        name: 'WeChat',
        icon: '/wechat.svg'
    }
} as const;

interface ConnectedAccountButtonProps {
    provider: 'github' | 'wechat';
    account: auth_accounts | undefined;
    user: any;
}

const isWeChatBrowser = () => {
    if (typeof window === 'undefined') return false;
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.includes('micromessenger');
};

export function ConnectedAccountButton({ provider, account }: ConnectedAccountButtonProps) {
    const [isPending, startTransition] = useTransition();
    const isConnected = !!account;
    const providerName = PROVIDER_MAP[provider].name;
    const router = useRouter();

    const handleUnlink = async (formData: FormData) => {
        startTransition(async () => {
            try {
                await unlinkAccount(formData);
                toast.success(`${providerName} account unlinked successfully`);
                router.refresh();
            } catch (error: any) {
                // 检查是否为重定向错误
                if (error?.digest?.startsWith('NEXT_REDIRECT')) {
                    throw error; // Re-throw redirect to allow the OAuth flow to continue
                }
                toast.error(`Failed to unlink ${providerName} account`);
            }
        });
    };

    const handleBind = async () => {
        startTransition(async () => {
            try {
                if (provider === 'github') {
                    await bindGithubAccount();
                } else {
                    await bindWechatAccount();
                }
            } catch (error) {
                console.error('Failed to bind account:', error);
                toast.error(`Failed to link ${providerName} account`);
            }
        });
    };

    if (isConnected) {
        return (
            <form>
                <input type="hidden" name="provider" value={provider} />
                <input type="hidden" name="providerAccountId" value={account!.provider_account_id} />
                <LoadingButton
                    formAction={handleUnlink}
                    loading={isPending}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Unlink
                </LoadingButton>
            </form>
        );
    }

    if (provider === 'wechat' && !isConnected && !isWeChatBrowser()) {
        return (
            <p className="text-xs text-gray-500">
                Please open in WeChat to bind account
            </p>
        );
    }

    return (
        <LoadingButton
            onClick={handleBind}
            loading={isPending}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            Link Account
        </LoadingButton>
    );
}

interface ConnectedAccountProps {
    provider: 'github' | 'wechat';
    user: any;
}

const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(navigator.language);
};

export function ConnectedAccount({ provider, user }: ConnectedAccountProps) {
    const account = user?.auth_accounts?.find((acc: auth_accounts) => acc.provider === provider);
    const { name: providerName, icon: iconSrc } = PROVIDER_MAP[provider];

    return (
        <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                        <img src={iconSrc} alt={providerName} className="h-8 w-8" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">{providerName}</h4>
                        {account ? (
                            <p className="text-xs text-gray-500">
                                Connected on {formatDate(user.created_at)}
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500">Not connected to any account</p>
                        )}
                    </div>
                </div>
                <div>
                    <ConnectedAccountButton
                        provider={provider}
                        account={account}
                        user={user}
                    />
                </div>
            </div>
        </div>
    );
}

interface ProfileClientProps {
    user: any;
}

export default function ProfileClient({ user }: ProfileClientProps) {
    const [isPending, startTransition] = useTransition();
    const handleLogout = useCallback(() => {
        startTransition(async () => {
            try {
                await logout();
                toast.success('Logged out successfully');
                window.location.href = '/login';
            } catch (error) {
                console.error('Failed to logout:', error);
                toast.error('Failed to logout');
            }
        });
    }, []);

    const handleDeleteAccount = useCallback(() => {
        startTransition(async () => {
            try {
                await deleteAccount();
                toast.success('Account deleted successfully');
            } catch (error: any) {
                if (error?.digest?.startsWith('NEXT_REDIRECT')) {
                    throw error; // Re-throw redirect to allow the OAuth flow to continue
                }
                console.error('Failed to delete account:', error);
                toast.error('Failed to delete account');
            }
        });
    }, []);

    const userStatus = useMemo(() => ({
        className: user?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            user?.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                user?.status === 'LOCKED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800',
        text: user?.status || 'Unknown'
    }), [user?.status]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Basic Information */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
                        <div className="flex space-x-2">
                            <LoadingButton
                                onClick={handleLogout}
                                loading={isPending}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Logout
                            </LoadingButton>
                        </div>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.id}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.nickname || 'Not set'}</dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div className="flex items-center">
                                        <span>{user?.email || 'Not set'}</span>
                                        {user?.email_verified && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <div className="flex items-center">
                                        <span>{user?.phone || 'Not set'}</span>
                                        {user?.phone_verified && (
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Bio</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.bio || 'No bio provided'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Account Status */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Account Status</h3>
                    </div>
                    <div className="border-t border-gray-200">
                        <dl>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Status</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <span className={userStatus.className}>
                                        {userStatus.text}
                                    </span>
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>

                {/* Connected Accounts */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Connected Accounts</h3>
                        <p className="mt-1 text-sm text-gray-500">Manage your connected third-party accounts</p>
                    </div>
                    <div className="border-t border-gray-200">
                        <div className="divide-y divide-gray-200">
                            <ConnectedAccount provider="github" user={user} />
                            <ConnectedAccount provider="wechat" user={user} />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-red-600">Danger Zone</h3>
                        <p className="mt-1 text-sm text-gray-500">Irreversible and destructive actions</p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                                <p className="text-sm text-gray-500">
                                    Permanently delete your account and all associated data. This action cannot be undone.
                                </p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <LoadingButton
                                        loading={isPending}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Delete Account
                                    </LoadingButton>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Account Deletion?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action will permanently delete your account and all associated data. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDeleteAccount}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Confirm Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}