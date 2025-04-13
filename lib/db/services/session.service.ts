import { Prisma } from "@/prisma/client";
import { prisma } from '../index';
import { CreateSessionData, DatabaseError } from './types';
import { stripUndefined } from './utils';

/**
 * 会话服务类 - 处理会话管理
 */
export class SessionService {
    /**
     * 获取会话和用户信息
     */
    static async getSessionAndUser(sessionToken: string) {
        try {
            const session = await prisma().auth_sessions.findUnique({
                where: { session_token: sessionToken },
                include: {
                    users: true
                },
            });

            if (!session || !session.users) {
                return null;
            }

            return {
                ...session,
                user: session.users
            };
        } catch (error) {
            throw new DatabaseError('Failed to fetch session ' + (error as Error).message, 'FETCH_ERROR', error);
        }
    }

    /**
     * 创建新会话
     */
    static async createSession(data: CreateSessionData) {
        try {
            return await prisma().auth_sessions.create({
                data
            });
        } catch (error) {
            throw new DatabaseError('Failed to create session ' + (error as Error).message, 'CREATE_ERROR', error);
        }
    }

    /**
     * 更新会话
     */
    static async updateSession(sessionToken: string, data: Prisma.auth_sessionsUpdateInput) {
        try {
            return await prisma().auth_sessions.update({
                where: { session_token: sessionToken },
                data: stripUndefined(data),
            });
        } catch (error) {
            throw new DatabaseError('Failed to update session ' + (error as Error).message, 'UPDATE_ERROR', error);
        }
    }

    /**
     * 删除会话
     */
    static async deleteSession(sessionToken: string) {
        try {
            return await prisma().auth_sessions.delete({
                where: { session_token: sessionToken },
            });
        } catch (error) {
            throw new DatabaseError('Failed to delete session ' + (error as Error).message, 'DELETE_ERROR', error);
        }
    }
} 