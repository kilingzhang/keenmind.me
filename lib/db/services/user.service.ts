import { Prisma, UserStatus } from "@prisma/client";
import { prisma } from '../index';
import { CreateUserData, DatabaseError, UserNotFoundError, ValidationError, ACTIVE_USER_FILTER } from './types';
import { stripUndefined } from './utils';

/**
 * 用户服务类 - 处理用户相关的数据库操作
 */
export class UserService {
    /**
     * 获取所有用户
     */
    static async getUsers() {
        try {
            return await prisma().user.findMany({
                where: {
                    deleted_at: null
                }
            });
        } catch (error) {
            throw new DatabaseError('Failed to fetch users ' + (error as Error).message, 'FETCH_ERROR', error);
        }
    }

    /**
     * 根据ID获取用户
     */
    static async getUserById(id: string): Promise<any> {
        try {
            const user = await prisma().user.findFirst({
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

            return await prisma().user.create({
                data: {
                    ...data,
                    status: data.status || UserStatus.ACTIVE,
                },
            });
        } catch (error) {
            if (error instanceof ValidationError) throw error;
            throw new DatabaseError('Failed to create user ' + (error as Error).message, 'CREATE_ERROR', error);
        }
    }

    /**
     * 获取活跃用户
     */
    static async getActiveUserById(id: string) {
        try {
            const user = await prisma().user.findFirst({
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
            return await prisma().user.findFirst({
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
    static async updateUser(id: string, data: Prisma.UserUpdateInput) {
        try {
            return await prisma().user.update({
                where: {
                    id,
                    deleted_at: null
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
    static async deepDeleteUser(id: string) {
        try {
            return await prisma().user.update({
                where: {
                    id,
                    deleted_at: null
                },
                data: {
                    deleted_at: new Date(),
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
    static async deleteUser(id: string) {
        try {
            return await prisma().user.update({
                where: {
                    id,
                    deleted_at: null
                },
                data: {
                    deleted_at: new Date(),
                },
            });
        } catch (error) {
            throw new DatabaseError('Failed to delete user ' + (error as Error).message, 'DELETE_ERROR', error);
        }
    }
} 