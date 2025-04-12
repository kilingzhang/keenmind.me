import { prisma } from '../index';
import { LinkAccountData, DatabaseError } from './types';

/**
 * 账号服务类 - 处理账号关联操作
 */
export class AccountService {
    /**
     * 获取关联账号的用户信息
     */
    static async getUserByAccount(provider: string, providerAccountId: string) {
        try {
            return await prisma().authAccount.findUnique({
                where: {
                    provider_provider_account_id: {
                        provider,
                        provider_account_id: providerAccountId,
                    }
                },
                select: {
                    user: true
                },
            });
        } catch (error) {
            throw new DatabaseError('Failed to fetch user by account ' + (error as Error).message, 'FETCH_ERROR', error);
        }
    }

    /**
     * 关联账号
     */
    static async linkAccount(data: LinkAccountData) {
        try {
            const { user_id, ...accountData } = data;
            return await prisma().authAccount.create({
                data: {
                    ...accountData,
                    user: {
                        connect: { id: user_id }
                    }
                }
            });
        } catch (error) {
            throw new DatabaseError('Failed to link account ' + (error as Error).message, 'LINK_ERROR', error);
        }
    }

    /**
     * 解除账号关联
     */
    static async unlinkAccount(provider: string, providerAccountId: string) {
        try {
            await prisma().authAccount.delete({
                where: {
                    provider_provider_account_id: {
                        provider,
                        provider_account_id: providerAccountId,
                    }
                },
            });
        } catch (error) {
            throw new DatabaseError('Failed to unlink account ' + (error as Error).message, 'UNLINK_ERROR', error);
        }
    }
} 