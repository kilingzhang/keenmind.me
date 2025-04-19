
// 管理员 ID 列表
const ADMIN_IDS: string[] = [
    '872817149208',
];

/**
 * 检查用户是否为管理员
 * @param user - 可选参数，如果提供则直接使用，否则调用getCurrentUser获取
 * @returns Promise<boolean> - 如果用户是管理员返回 true，否则返回 false
 */
export async function isUserAdmin(user?: any): Promise<boolean> {
    try {
        if (!user || !user.id) {
            return false;
        }

        return checkAdminById(user.id);
    } catch (error) {
        console.error('检查管理员权限时出错:', error);
        return false;
    }
}

/**
 * 根据特定用户ID检查是否为管理员
 * @param userId - 要检查的用户ID
 * @returns boolean - 如果用户是管理员返回 true，否则返回 false
 */
export function checkAdminById(userId: string | number): boolean {
    if (!userId) return false;

    const userIdStr = userId.toString();
    return ADMIN_IDS.includes(userIdStr);
} 