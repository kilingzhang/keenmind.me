import { Prisma } from "@/prisma/client";
import { prisma } from '../index';
import { CreateSessionData, DatabaseError } from './types';
import { stripUndefined } from './utils';
import { KVService } from "@/lib/kv";

// 会话缓存配置
const SESSION_CACHE_TTL = 60 * 60; // 1小时过期时间（秒）
const SESSION_KEY_PREFIX = 'session:';

/**
 * 会话服务类 - 处理会话管理
 */
export class SessionService {
    /**
     * 获取会话和用户信息
     */
    static async getSessionAndUser(sessionToken: string) {
        try {
            // 尝试从KV缓存获取
            const cacheKey = SESSION_KEY_PREFIX + sessionToken;
            const cachedSession = await KVService.getJSON(cacheKey);

            if (cachedSession) {
                return cachedSession;
            }

            // 缓存未命中，从数据库获取
            const session = await prisma().auth_sessions.findUnique({
                where: { session_token: sessionToken },
                include: {
                    users: true
                },
            });

            if (!session || !session.users) {
                return null;
            }

            // 构建结果
            const result = {
                ...session,
                user: session.users
            };

            // 存入KV缓存
            await KVService.put(cacheKey, result, SESSION_CACHE_TTL);

            return result;
        } catch (error) {
            throw new DatabaseError('Failed to fetch session ' + (error as Error).message, 'FETCH_ERROR', error);
        }
    }

    /**
     * 创建新会话
     */
    static async createSession(data: CreateSessionData) {
        try {
            const session = await prisma().auth_sessions.create({
                data
            });

            // 新建会话后，预先存入KV缓存
            if (session && data.session_token) {
                // 需要获取完整数据（包括用户）再缓存
                const fullSession = await this.getSessionAndUser(data.session_token);
                if (fullSession) {
                    const cacheKey = SESSION_KEY_PREFIX + data.session_token;
                    await KVService.put(cacheKey, fullSession, SESSION_CACHE_TTL);
                }
            }

            return session;
        } catch (error) {
            throw new DatabaseError('Failed to create session ' + (error as Error).message, 'CREATE_ERROR', error);
        }
    }

    /**
     * 更新会话
     */
    static async updateSession(sessionToken: string, data: Prisma.auth_sessionsUpdateInput) {
        try {
            const session = await prisma().auth_sessions.update({
                where: { session_token: sessionToken },
                data: stripUndefined(data),
            });

            // 更新会话后，清除KV缓存，下次获取时重新缓存
            const cacheKey = SESSION_KEY_PREFIX + sessionToken;
            await KVService.delete(cacheKey);

            return session;
        } catch (error) {
            throw new DatabaseError('Failed to update session ' + (error as Error).message, 'UPDATE_ERROR', error);
        }
    }

    /**
     * 删除会话
     */
    static async deleteSession(sessionToken: string) {
        try {
            // 删除会话前，先清除KV缓存
            const cacheKey = SESSION_KEY_PREFIX + sessionToken;
            await KVService.delete(cacheKey);

            return await prisma().auth_sessions.delete({
                where: { session_token: sessionToken },
            });
        } catch (error) {
            throw new DatabaseError('Failed to delete session ' + (error as Error).message, 'DELETE_ERROR', error);
        }
    }
} 