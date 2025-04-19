import { PrismaClient } from '../prisma/client';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { generateText } from 'ai';
// @ts-ignore
import chalk from 'chalk';
// @ts-ignore
const Table = require('cli-table3');

// 加载环境变量
dotenv.config();
console.log('🚀 启动 generate-domain-topics 脚本...');

// 初始化 Prisma 客户端
const prisma = new PrismaClient();

// DEBUG 模式（设置环境变量 DEBUG=true 开启）
const DEBUG = process.env.DEBUG === 'true';

// OpenAI 配置
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || 'https://api.openai.com/v1';

// 检查 API 密钥是否存在
if (!OPENAI_API_KEY) {
    console.error('错误: 未设置 OPENAI_API_KEY 环境变量');
    process.exit(1);
}

console.log(`📡 API 连接配置: ${GATEWAY_BASE_URL ? '使用代理' : '直连 OpenAI'}`);
if (DEBUG && GATEWAY_BASE_URL) {
    console.log(`[DEBUG] 使用网关: ${GATEWAY_BASE_URL}`);
}

// 结构化 topic schema
type TopicGen = {
    name_zh: string;
    name_en: string;
    slug: string;
    description_zh: string;
    description_en: string;
};

const TopicSchema = z.object({
    topics: z.array(
        z.object({
            name_zh: z.string().min(1),
            name_en: z.string().min(1),
            slug: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
            description_zh: z.string().min(1),
            description_en: z.string().min(1),
        })
    ),
});

// 调试日志函数
function debug(...args: any[]) {
    if (DEBUG) {
        console.log(`[DEBUG ${new Date().toISOString()}]`, ...args);
    }
}

// 创建 OpenAI 客户端
const openai = createOpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: GATEWAY_BASE_URL,
});

// 字符串简单相似度检测（移到块外）
function simpleSimilarity(a: string, b: string) {
    if (!a || !b) return 0;
    a = a.toLowerCase(); b = b.toLowerCase();
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return 0.8;
    return 0;
}

// 调用 LLM 生成话题建议
async function generateTopicSuggestions(domain: any, existingTopics: any[], allTopics: any[]): Promise<z.infer<typeof TopicSchema>["topics"]> {
    if (DEBUG) console.log('📝 为域名创建话题建议:', domain.name);

    try {
        if (DEBUG) console.log('🔑 使用 API 密钥:', OPENAI_API_KEY?.substring(0, 5) + '...');
        if (DEBUG) console.log('🌐 使用基础 URL:', GATEWAY_BASE_URL);

        const badCase = `
  - name_zh: 前端测试与调试
    name_en: Frontend Testing and Debugging
    slug: frontend-testing-debugging
    description_zh: 前端相关的测试与调试内容。
    description_en: Testing and debugging in frontend.
`;
        const goodCase = `
  - name_zh: 测试与调试
    name_en: Testing and Debugging
    slug: testing-debugging
    description_zh: 包含软件开发中的测试方法与调试技巧。
    description_en: Covers testing methods and debugging techniques in software development.
  - name_zh: React
    name_en: React
    slug: react
    description_zh: React 是一个用于构建用户界面的 JavaScript 库。
    description_en: React is a JavaScript library for building user interfaces.
`;

        const allTopicNamesZh = allTopics.map(t => t.name_zh).join('、');
        const allTopicNamesEn = allTopics.map(t => t.name_en).join(', ');

        const prompt = `
你是资深技术内容专家，正在为开发者平台的"${domain.name_zh}"领域设计主题（topics）。

【领域描述】
${domain.description_zh || '(无描述)'}

【已有主题】
${existingTopics.length ? existingTopics.map(t => t?.name_zh).join('、') : '无'}

【严格要求】
- 主题名称（name_zh, name_en）必须是最短、最核心的词或短语，禁止出现"领域+主题"组合（如"前端测试与调试"），直接用"测试与调试"或"React"。
- 主题名称不得包含本领域名称或其英文（如领域为"前端"，主题不能叫"前端框架"，只能叫"框架"或"React"）。
- 主题需全局唯一、全局去重，若与其他领域已有主题同义或高度相关，直接复用已有主题，不要重复生成。
- 主题名称要专业、简洁，避免长句、修饰语和泛泛而谈。
- 主题之间不得出现同义、近义、重复。
- 主题 slug 也需全局唯一。
- 参考所有领域已有主题（中英文）：${allTopicNamesZh} / ${allTopicNamesEn}

【英文补充】
- The topic name (name_zh, name_en) must be the shortest and most essential word or phrase, never a combination like "Frontend Testing and Debugging". Use "Testing and Debugging" or "React" directly.
- The topic name must NOT contain the domain name or its English translation. For example, if the domain is "Frontend", the topic cannot be "Frontend Framework", only "Framework" or "React".
- Topics must be globally unique and deduplicated. If a topic with the same or similar meaning already exists in other domains, reuse the existing topic instead of generating a new one.
- Topic names must be professional, concise, and avoid long sentences or modifiers.
- No synonyms, near-synonyms, or duplicates among topics.
- Topic slugs must also be globally unique.

【Bad case】
${badCase}
【Good case】
${goodCase}

请以如下JSON格式输出：
{
  "topics": [
    {
      "name_zh": "",
      "name_en": "",
      "slug": "",
      "description_zh": "",
      "description_en": ""
    }
  ]
}
`;

        // 记录开始调用
        console.log('🤖 调用 OpenAI API...');

        const { text: content } = await generateText({
            model: openai('gpt-4.1'),
            prompt,
            temperature: 0.7,
        });

        // 记录调用成功
        console.log('✅ OpenAI API 调用成功');

        if (!content) {
            throw new Error('OpenAI 返回内容为空');
        }

        // 尝试提取 JSON 部分
        let jsonStr = content;
        if (!content.trim().startsWith('{')) {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            } else {
                throw new Error('无法从响应中提取有效的 JSON');
            }
        }

        // 解析 JSON 数据
        const suggested = JSON.parse(jsonStr);
        const topics = TopicSchema.parse(suggested).topics;

        // 1. 检查本轮 slug 是否有重复
        const slugSet = new Set<string>();
        const duplicateSlugs: string[] = [];
        for (const t of topics) {
            if (slugSet.has(t.slug)) duplicateSlugs.push(t.slug);
            slugSet.add(t.slug);
        }
        if (duplicateSlugs.length > 0) {
            console.log(chalk.red(`❌ 检测到本轮生成的 slug 有重复: ${duplicateSlugs.join(', ')}`));
            throw new Error('本轮生成的 slug 有重复，请重新生成');
        }

        // 2. 检查与已有主题的相似度和领域名冗余
        const similarTopics: { topic: TopicGen, exist: any, field: string, reason: string }[] = [];
        for (const t of topics) {
            // 检查 name_zh/name_en 是否包含 domain 名
            if (domain.name_zh && t.name_zh.includes(domain.name_zh)) {
                similarTopics.push({ topic: t, exist: null, field: 'name_zh', reason: `包含领域名"${domain.name_zh}"` });
            }
            if (domain.name_en && t.name_en.toLowerCase().includes(domain.name_en.toLowerCase())) {
                similarTopics.push({ topic: t, exist: null, field: 'name_en', reason: `包含领域名"${domain.name_en}"` });
            }
            // 检查与全局 topics 的同义/重复
            for (const exist of allTopics) {
                if (simpleSimilarity(t.name_zh, exist.name_zh) > 0.7) {
                    similarTopics.push({ topic: t, exist, field: 'name_zh', reason: '与全局已有主题高度相似' });
                } else if (simpleSimilarity(t.name_en, exist.name_en) > 0.7) {
                    similarTopics.push({ topic: t, exist, field: 'name_en', reason: '与全局已有主题高度相似' });
                }
            }
        }
        if (similarTopics.length > 0) {
            console.log(chalk.yellow('⚠️ 检测到以下主题存在领域名冗余或与全局主题同义/重复：'));
            similarTopics.forEach(({ topic, exist, field, reason }) => {
                if (exist) {
                    // @ts-ignore
                    console.log(chalk.yellow(`  新主题 ${field}: ${(topic as any)[field]}  ≈ 已有主题: ${(exist as any)[field]}，原因：${reason}`));
                } else {
                    // @ts-ignore
                    console.log(chalk.yellow(`  新主题 ${field}: ${(topic as any)[field]}，原因：${reason}`));
                }
            });
        }

        // 3. 表格展示 topics
        const table = new Table({ head: ['#', 'name_zh', 'name_en', 'slug', 'description_zh', 'description_en'] });
        topics.forEach((t, i) => {
            table.push([
                i + 1,
                t.name_zh,
                t.name_en,
                chalk.cyan(t.slug),
                t.description_zh.slice(0, 20) + (t.description_zh.length > 20 ? '...' : ''),
                t.description_en.slice(0, 20) + (t.description_en.length > 20 ? '...' : '')
            ]);
        });
        console.log(table.toString());

        return topics;

    } catch (error: any) {
        // 详细错误处理和日志记录
        if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
            console.error('❌ 网络错误：无法连接到 OpenAI API。请检查您的网络连接和代理设置。');
        } else if (error.response?.status === 401) {
            console.error('❌ 认证错误：OpenAI API 密钥无效。请检查您的 API 密钥。');
        } else if (error.response?.status === 429) {
            console.error('❌ 速率限制：OpenAI API 请求过多。请稍后再试。');
        } else if (error.message.includes('JSON')) {
            console.error('❌ 解析错误：无法解析 OpenAI 响应为有效的 JSON。');
            if (DEBUG) {
                console.error('原始响应:', error.response?.data || '无响应数据');
            }
        } else {
            console.error('❌ OpenAI API 调用失败:', error.message);
            if (DEBUG && error.response) {
                console.error('响应状态:', error.response.status);
                console.error('响应数据:', error.response.data);
            }
        }

        throw new Error(`生成话题建议失败: ${error.message}`);
    }
}

async function main() {
    console.log('📚 开始读取数据库...');

    // 1. 读取 domains、topics、domain_topics
    const domains = await prisma.domains.findMany({
        where: { deleted_at: null },
        orderBy: { sort_order: 'asc' },
    });
    debug(`读取到 ${domains.length} 个领域`);

    const topics = await prisma.topics.findMany({
        where: { deleted_at: null },
    });
    debug(`读取到 ${topics.length} 个主题`);

    const domainTopics = await prisma.domain_topics.findMany();
    debug(`读取到 ${domainTopics.length} 个领域-主题关系`);

    if (domains.length === 0) {
        console.log('❌ 错误: 未找到任何领域数据，请先创建领域');
        process.exit(1);
    }

    const newTopicsMap: Record<string, TopicGen[]> = {};
    const newDomainTopics: { domain_id: bigint; topic_slug: string }[] = [];
    let totalLLMRequestCount = 0;

    console.log('\n🔄 开始处理领域和生成主题建议...');

    for (const domain of domains) {
        console.log(`\n============= 处理领域: ${domain.name_zh} / ${domain.name_en} =============`);
        let approved = false;
        let userSuggestion = '';
        let topicsProposal: TopicGen[] = [];
        let llmRequestCount = 0;

        // 获取该领域现有主题
        const existingTopics = domainTopics
            .filter(dt => dt.domain_id === domain.id)
            .map(dt => topics.find(t => t.id === dt.topic_id))
            .filter(Boolean);

        debug(`领域 ${domain.name_zh} 现有 ${existingTopics.length} 个主题`);

        while (!approved) {
            llmRequestCount++;
            totalLLMRequestCount++;

            // 构造 prompt
            // prompt 已在 generateTopicSuggestions 内部拼接

            debug(`LLM 请求 #${llmRequestCount} - 生成主题建议中...`);
            console.log(`\n🤖 调用大模型生成主题建议中，请稍候...`);

            const startTime = Date.now();

            try {
                // 调用LLM
                topicsProposal = await generateTopicSuggestions(domain, existingTopics, topics);

                const endTime = Date.now();
                console.log(`✅ 大模型生成完成！(耗时 ${((endTime - startTime) / 1000).toFixed(2)}s)`);
                debug(`成功解析出${topicsProposal.length}个主题`);

                // 展示结果（已表格展示）

                // 检查是否有重复主题
                const existingNames = existingTopics.map(t => t?.name_zh);
                const duplicates = topicsProposal.filter(t => existingNames.includes(t.name_zh));

                if (duplicates.length > 0) {
                    console.log(`\n⚠️ 警告：检测到 ${duplicates.length} 个可能重复的主题名称：${duplicates.map(d => d.name_zh).join('、')}`);
                }

                // 交互审核
                const answer = await inquirer.prompt<{ approve: boolean; suggestion?: string }>([
                    {
                        type: 'confirm',
                        name: 'approve',
                        message: '你是否同意以上主题建议？',
                    }
                ]);

                if (!answer.approve) {
                    const feedbackAnswer = await inquirer.prompt<{ suggestion: string }>([
                        {
                            type: 'input',
                            name: 'suggestion',
                            message: '请输入你的修改建议（会反馈给大模型重新生成，可用中文描述）：',
                        }
                    ]);

                    // 审核建议智能化：用 LLM 帮你润色建议（可选，如不想用可注释掉）
                    let improvedSuggestion = feedbackAnswer.suggestion;
                    // if (improvedSuggestion && improvedSuggestion.length > 5) {
                    //     try {
                    //         const { text: improved } = await generateText({
                    //             model: openai('gpt-4o'),
                    //             prompt: `请将以下主题建议反馈润色为更专业、简明、适合大模型 prompt 的表达：${improvedSuggestion}`
                    //         });
                    //         if (improved && improved.length > 0) {
                    //             improvedSuggestion = improved;
                    //             console.log(chalk.green('✨ 已自动润色你的建议：'), improvedSuggestion);
                    //         }
                    //     } catch (e) {
                    //         // 忽略润色失败
                    //     }
                    // }
                    userSuggestion = improvedSuggestion;
                    console.log(`📝 已记录你的建议，正在重新生成...`);
                } else {
                    approved = true;
                    newTopicsMap[domain.slug] = topicsProposal;
                    console.log(`👍 你已同意领域【${domain.name_zh}】的主题建议`);
                }
            } catch (error) {
                console.error(`\n❌ 大模型调用失败:`, error);

                // 提供更详细的错误信息
                if (error instanceof Error) {
                    if (error.message.includes('ECONNREFUSED') || error.message.includes('connect')) {
                        console.error(`网络连接问题：无法连接到 ${GATEWAY_BASE_URL || 'OpenAI API'}`);
                        console.error(`请检查：1) 网络连接 2) GATEWAY_BASE_URL 是否正确 3) 代理服务器是否运行`);
                    } else if (error.message.includes('timeout')) {
                        console.error('请求超时，可能是网络问题或模型处理时间过长');
                    } else if (error.message.includes('401')) {
                        console.error('认证失败：请检查 OPENAI_API_KEY 是否正确');
                    } else if (error.message.includes('429')) {
                        console.error('请求过于频繁：已达到 API 速率限制，请稍后再试');
                    } else if (error.message.includes('500')) {
                        console.error('OpenAI 服务器错误，请稍后再试');
                    }
                }

                console.log('请问是否重试?');
                const { retry } = await inquirer.prompt<{ retry: boolean }>([
                    {
                        type: 'confirm',
                        name: 'retry',
                        message: '是否重试此领域的主题生成?',
                        default: true
                    }
                ]);

                if (!retry) {
                    console.log(`跳过领域【${domain.name_zh}】`);
                    break;
                }
            }
        }
    }

    if (Object.keys(newTopicsMap).length === 0) {
        console.log('\n⚠️ 没有生成任何新主题，退出程序');
        process.exit(0);
    }

    // 汇总所有待插入数据，展示给用户
    const allNewTopics: TopicGen[] = [];
    console.log('\n📊 汇总: 所有待插入的主题');

    for (const [domainSlug, topicsArr] of Object.entries(newTopicsMap)) {
        const domain = domains.find(d => d.slug === domainSlug);
        console.log(`\n领域【${domain?.name_zh || domainSlug}】即将插入的主题：`);
        topicsArr.forEach((t, i) => {
            console.log(`\n${i + 1}. ${t.name_zh} / ${t.name_en}\n  - ${t.description_zh}\n  - ${t.description_en}`);
        });
        allNewTopics.push(...topicsArr);
    }

    console.log(`\n📈 统计: 共 ${Object.keys(newTopicsMap).length} 个领域，${allNewTopics.length} 个主题，${totalLLMRequestCount} 次 LLM 调用`);

    const { finalApprove } = await inquirer.prompt<{ finalApprove: boolean }>([
        {
            type: 'confirm',
            name: 'finalApprove',
            message: '你是否同意将以上所有主题插入数据库？',
        }
    ]);

    if (!finalApprove) {
        console.log('❌ 操作已取消，未写入数据库。');
        process.exit(0);
    }

    console.log('\n💾 开始写入数据库...');

    // 插入 topics 和 domain_topics（幂等）
    let insertedCount = 0;
    let skippedCount = 0;
    let relationCount = 0;

    for (const [domainSlug, topicsArr] of Object.entries(newTopicsMap)) {
        const domain = domains.find(d => d.slug === domainSlug);
        if (!domain) {
            console.log(`⚠️ 警告: 找不到领域 ${domainSlug}，跳过相关主题`);
            continue;
        }

        for (const t of topicsArr) {
            // 先查重
            let topic = await prisma.topics.findFirst({
                where: {
                    slug: t.slug,
                    deleted_at: null,
                },
            });

            if (!topic) {
                try {
                    topic = await prisma.topics.create({
                        data: {
                            name_zh: t.name_zh,
                            name_en: t.name_en,
                            slug: t.slug,
                            description_zh: t.description_zh,
                            description_en: t.description_en,
                        },
                    });
                    insertedCount++;
                    console.log(`✅ 已插入新主题：${t.name_zh} / ${t.name_en}`);
                } catch (error) {
                    console.error(`❌ 插入主题失败: ${t.name_zh}`, error);
                    continue;
                }
            } else {
                skippedCount++;
                console.log(`⏭️ 主题已存在，跳过：${t.name_zh} / ${t.name_en}`);
            }

            // 建立 domain_topics 关系（幂等）
            try {
                const rel = await prisma.domain_topics.findFirst({
                    where: { domain_id: domain.id, topic_id: topic.id },
                });

                if (!rel) {
                    await prisma.domain_topics.create({
                        data: { domain_id: domain.id, topic_id: topic.id },
                    });
                    relationCount++;
                    console.log(`🔗 已建立领域-主题关系：${domain.name_zh} - ${t.name_zh}`);
                }
            } catch (error) {
                console.error(`❌ 建立领域-主题关系失败: ${domain.name_zh} - ${t.name_zh}`, error);
            }
        }
    }

    console.log(`\n✨ 全部完成！\n- 新增主题: ${insertedCount} 个\n- 跳过主题: ${skippedCount} 个\n- 新增关系: ${relationCount} 个`);
}


main().catch(e => {
    console.error('❌ 程序执行出错:', e);
    process.exit(1);
}); 