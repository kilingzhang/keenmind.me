import fs from 'fs'
import path from 'path'

// 使用环境变量控制运行时
const RUNTIME = process.env.RUNTIME || 'nodejs'

// 递归获取所有 route.ts 文件
function findRouteFiles(dir: string): string[] {
    const files: string[] = []

    const items = fs.readdirSync(dir)
    for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
            files.push(...findRouteFiles(fullPath))
        } else if (item === 'route.ts' || item === 'page.tsx') {
            files.push(fullPath)
        }
    }

    return files
}

// 更新路由文件
function updateRouteFile(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf-8')
    console.log(`Updating runtime in ${filePath} to ${RUNTIME} ...`)
    // 检查是否已经有 runtime 声明
    if (content.includes('export const runtime')) {
        // 替换现有的 runtime 声明
        content = content.replace(
            /export const runtime.*?;/,
            `export const runtime = '${RUNTIME}';`
        )
    } else {
        // 在文件开头添加 runtime 声明
        content = `export const runtime = '${RUNTIME}';\n\n${content}`
    }

    fs.writeFileSync(filePath, content)
}

// 主函数
function main() {
    const apiDir = path.join(process.cwd(), 'app')
    const routeFiles = findRouteFiles(apiDir)

    // 添加 lib/define.ts 文件
    const defineFile = path.join(process.cwd(), 'lib', 'define.ts')
    if (fs.existsSync(defineFile)) {
        routeFiles.push(defineFile)
    }

    for (const file of routeFiles) {
        updateRouteFile(file)
        console.log(`Updated runtime in ${file} to ${RUNTIME}`)
    }
}

main()