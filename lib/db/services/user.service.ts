import { Prisma, UserStatus } from "@/prisma/client";
import { prisma } from '../index';
import { CreateUserData, DatabaseError, UserNotFoundError, ValidationError, ACTIVE_USER_FILTER } from './types';
import { stripUndefined } from './utils';

/**
 * 用户服务类 - 处理用户相关的数据库操作
 */
export class UserService {
    /**
     * 获取所有用户（分页）
     */
    static async getUsers({
        page = 1,
        pageSize = 10,
        keyword = '',
        where: customWhere,
    }: {
        page?: number
        pageSize?: number
        keyword?: string
        where?: Prisma.usersWhereInput
    } = {}) {
        try {
            const where: Prisma.usersWhereInput = customWhere || {
                deleted_at: null,
                ...(keyword ? {
                    OR: [
                        { username: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
                        { nickname: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
                        { email: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
                        { phone: { contains: keyword } },
                    ],
                } : {}),
            };

            const [total, users] = await Promise.all([
                prisma().users.count({ where }),
                prisma().users.findMany({
                    where,
                    select: {
                        id: true,
                        username: true,
                        nickname: true,
                        email: true,
                        phone: true,
                        email_verified: true,
                        phone_verified: true,
                        status: true,
                        created_at: true,
                        last_login_at: true,
                    },
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    orderBy: {
                        created_at: 'desc',
                    },
                })
            ]);

            return { items: users, total };
        } catch (error) {
            throw new DatabaseError('Failed to fetch users ' + (error as Error).message, 'FETCH_ERROR', error);
        }
    }

    /**
     * 根据ID获取用户
     */
    static async getUserById(id: number): Promise<any> {
        try {
            const user = await prisma().users.findFirst({
                where: {
                    id,
                    deleted_at: null
                },
                include: { auth_accounts: true },
            });
            if (!user) throw new UserNotFoundError();
            return user;
        } catch (error) {
            if (error instanceof UserNotFoundError) throw error;
            throw new DatabaseError('Failed to fetch user ' + (error as Error).message, 'FETCH_ERROR', error);
        }
    }

    /**
     * 创建新用户
     */
    static async createUser(data: CreateUserData) {
        try {
            if (!data.email) throw new ValidationError('Email is required');

            const userData = {
                ...data,
                status: data.status || UserStatus.ACTIVE,
            };

            return await prisma().users.create({
                data: userData,
            });
        } catch (error) {
            if (error instanceof ValidationError) throw error;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new DatabaseError('Failed to create user ' + errorMessage, 'CREATE_ERROR', error);
        }
    }

    /**
     * 获取活跃用户
     */
    static async getActiveUserById(id: number) {
        try {
            const user = await prisma().users.findFirst({
                where: {
                    id,
                    ...ACTIVE_USER_FILTER,
                },
            });
            if (!user) throw new UserNotFoundError();
            return user;
        } catch (error) {
            if (error instanceof UserNotFoundError) throw error;
            throw new DatabaseError('Failed to fetch active user ' + (error as Error).message, 'FETCH_ERROR', error);
        }
    }

    /**
     * 根据邮箱获取用户
     */
    static async getUserByEmail(email: string) {
        try {
            return await prisma().users.findFirst({
                where: {
                    email,
                    ...ACTIVE_USER_FILTER,
                },
            });
        } catch (error) {
            throw new DatabaseError('Failed to fetch user by email ' + (error as Error).message, 'FETCH_ERROR', error);
        }
    }

    /**
     * 更新用户信息
     */
    static async updateUser(id: number, data: Prisma.usersUpdateInput) {
        try {
            return await prisma().users.update({
                where: {
                    id: id,
                },
                data: stripUndefined(data),
            });
        } catch (error) {
            throw new DatabaseError('Failed to update user ' + (error as Error).message, 'UPDATE_ERROR', error);
        }
    }

    /**
     * 删除用户（软删除）
     */
    static async deepDeleteUser(id: number) {
        try {
            return await prisma().users.update({
                where: {
                    id,
                    deleted_at: null
                },
                data: {
                    deleted_at: new Date(),
                    status: 'INACTIVE',
                    auth_sessions: {
                        deleteMany: {},
                    },
                },
            });
        } catch (error) {
            throw new DatabaseError('Failed to delete user ' + (error as Error).message, 'DELETE_ERROR', error);
        }
    }

    /**
     * 删除用户（软删除）
     */
    static async deleteUser(id: number) {
        try {
            return await prisma().users.update({
                where: {
                    id,
                    deleted_at: null
                },
                data: {
                    deleted_at: new Date(),
                    status: 'INACTIVE',
                },
            });
        } catch (error) {
            throw new DatabaseError('Failed to delete user ' + (error as Error).message, 'DELETE_ERROR', error);
        }
    }

    /**
     * 更新用户状态
     */
    static async updateUserStatus(id: string, action: 'lock' | 'unlock') {
        try {
            return await this.updateUser(Number(id), {
                status: action === 'lock' ? UserStatus.LOCKED : UserStatus.ACTIVE,
                updated_at: new Date(),
            });
        } catch (error) {
            throw new DatabaseError('Failed to update user status ' + (error as Error).message, 'UPDATE_ERROR', error);
        }
    }
} 