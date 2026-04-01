import { ProxyAgent } from 'undici';

// 这里去掉 export const runtime = 'edge'，因为我们要使用 Node.js 的 undici 代理模块

const PROVIDERS: Record<string, { url: string; model: string; key: string | undefined }> = {
    openai: {
        url: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        key: process.env.OPENAI_API_KEY,
    },
    kimi: {
        url: 'https://api.moonshot.cn/v1/chat/completions',
        model: 'moonshot-v1-8k',
        key: process.env.KIMI_API_KEY,
    },
    deepseek: {
        url: 'https://api.deepseek.com/chat/completions',
        model: 'deepseek-chat',
        key: process.env.DEEPSEEK_API_KEY,
    },
    google: {
        url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
        model: 'gemini-2.0-flash',
        key: process.env.GOOGLE_GEMINI_API_KEY,
    }
};

export async function POST(req: Request) {
    try {
        const { prompt, provider = 'kimi' } = await req.json();
        const config = PROVIDERS[provider];

        if (!config || !config.key) {
            return new Response(JSON.stringify({ error: `未配置 ${provider} 的 API Key，请检查 .env.local` }), { status: 400 });
        }

        // 简历高亮：🌟 智能分流路由 (Smart Proxy Routing)
        // 只有国外的模型需要走梯子，国内的模型直接裸连保证速度
        const needsProxy = provider === 'openai' || provider === 'google';
        const proxyUrl = process.env.HTTP_PROXY || 'http://127.0.0.1:7890'; // 如果没配 env，默认 fallback 到 7890

        // 动态构建 fetch 配置
        const fetchOptions: any = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.key}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: [
                    { role: 'system', content: '你是一个高级协作文档的AI助手。直接输出内容，不要寒暄，不要使用 markdown 的代码块包裹（除非用户明确要求写代码）。' },
                    { role: 'user', content: prompt }
                ],
                stream: true,
            })
        };

        // 如果是国外模型，强行注入代理引擎
        if (needsProxy) {
            console.log(`[网关] ${provider} 正在通过代理 ${proxyUrl} 发起请求...`);
            fetchOptions.dispatcher = new ProxyAgent(proxyUrl);
        } else {
            console.log(`[网关] ${provider} 正在直连...`);
        }

        const response = await fetch(config.url, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[${provider}] API 请求被拒绝:`, errorText);
            return new Response(JSON.stringify({ error: errorText }), { status: response.status });
        }

        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error: any) {
        console.error("服务器内部错误:", error.message);
        return new Response(JSON.stringify({ error: error.message || '网络或代理连接失败' }), { status: 500 });
    }
}