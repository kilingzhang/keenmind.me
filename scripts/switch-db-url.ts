#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

// 数据库 URL 配置
const DB_URLS = {
    dev: 'postgresql://postgres.mdrkxqmfboidnxuqmuko:kWpxhe2RZuk3cn^@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres',
    edge: 'prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZTRkMWM0NWItMmYxNC00MTZiLWI2OGItN2UwODU4NjJiNWU4IiwidGVuYW50X2lkIjoiOWZkNDNmMGJhNjVjODVhNDQ4NjIyMTc0NjM2NzhiZDVlMjc3MTI0MjQ2YTI2ZDYxMmUyYmU1OTFlNzFiNDkwNCIsImludGVybmFsX3NlY3JldCI6ImUyNmRlMzFiLTdmMjItNDcxOS05ZDk0LTVkMjhmMWMwZTQxYyJ9.SySJ9dZuxO7mQ_uzTmoVof5AVIBpYbNW2b6JBKGRuC8'
};

// 环境变量文件路径
const ENV_FILE_PATH = path.join(process.cwd(), '.dev.vars');

// 更新环境变量文件中的数据库 URL
function updateDatabaseUrl(type: 'dev' | 'edge') {
    const dbUrl = DB_URLS[type];

    try {
        // 读取环境变量文件
        let envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');

        // 使用正则表达式替换 DATABASE_URL
        envContent = envContent.replace(
            /^DATABASE_URL=.*$/m,
            `DATABASE_URL="${dbUrl}"`
        );

        // 写回文件
        fs.writeFileSync(ENV_FILE_PATH, envContent);
        console.log(`已更新数据库 URL 为 ${type} 模式`);
    } catch (error) {
        console.error('更新数据库 URL 失败:', error);
        process.exit(1);
    }
}

// 主函数
function main() {
    // 获取命令行参数
    const args = process.argv.slice(2);
    const mode = args[0] || 'dev';
    const runCommand = args.slice(1);

    // 根据模式设置数据库 URL
    if (mode === 'edge') {
        updateDatabaseUrl('edge');
    } else {
        updateDatabaseUrl('dev');
    }

    // 如果有命令要运行，则执行它
    if (runCommand.length > 0) {
        const cmd = runCommand[0];
        const cmdArgs = runCommand.slice(1);

        const childProcess = spawn('bun', ['run', cmd, ...cmdArgs], {
            stdio: 'inherit',
            shell: true
        });

        childProcess.on('error', (error) => {
            console.error(`执行命令失败: ${error.message}`);
            process.exit(1);
        });

        childProcess.on('exit', (code) => {
            process.exit(code || 0);
        });
    }
}

main(); 