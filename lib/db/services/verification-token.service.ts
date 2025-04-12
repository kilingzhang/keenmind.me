import { Prisma, TokenType } from "@prisma/client";
import { prisma } from '../index';
import { CreateVerificationTokenData, DatabaseError } from './types';

/**
 * 验证令牌服务类 - 处理验证令牌管理
 */
export class VerificationTokenService {
    /**
     * 创建验证令牌
     */
    static async createVerificationToken(data: CreateVerificationTokenData) {
        try {
            return await prisma().authVerificationToken.create({
                data: {
                    ...data,
                    type: data.type || TokenType.EMAIL_VERIFICATION,
                },
            });
        } catch (error) {
            throw new DatabaseError('Failed to create verification token ' + (error as Error).message, 'CREATE_ERROR', error);
        }
    }

    /**
     * 使用验证令牌
     */
    static async useVerificationToken(identifier: string, token: string) {
        try {
            return await prisma().authVerificationToken.update({
                where: { identifier_token: { identifier, token } },
                data: {
                    used: true,
                    used_at: new Date(),
                },
            });
        } catch (error) {
            if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") {
                return null;
            }
            throw new DatabaseError('Failed to use verification token ' + (error as Error).message, 'UPDATE_ERROR', error);
        }
    }
} 