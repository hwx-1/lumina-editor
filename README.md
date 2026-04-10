   🌌 Lumina AI Editor 

> 一个基于 Next.js 与 TipTap 构建的 Notion 风格 AI 原生富文本编辑器，内置高可用多模型聚合网关。

![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
----


   💻 已实现线上本地部署
   
   在线演示： 👉[https://lumina-editor-blue.vercel.app/] 👈
   
----
   💡 项目简介与工程价值

Lumina Editor 摒弃了传统的“对话框式” AI 交互，将大语言模型深度嵌入到文档创作流中。本项目并非简单的 API 调用演示，而是致力于解决现代 AI 应用开发中的核心工程痛点。

  对于开发者的技术突破点：
1.   多模型聚合网关 (Multi-Model Gateway)：   抹平了 OpenAI、Google Gemini、Kimi (Moonshot) 和 DeepSeek 的底层 API 差异，提供统一的调用接口与一键切换能力，实现高可用容灾。
2.   纯原生 SSE 流式解析 (Native Server-Sent Events)： 抛弃沉重的第三方 AI SDK，基于 Web Streams API 与原生 Fetch 实现了从边缘计算层到浏览器端的数据流式分发，做到真正的“零延迟”打字机渲染效果。
3.   智能代理路由 (Smart Proxy Routing)：  针对国内网络环境，在 Node.js 底层引入 `undici` 代理引擎，实现了“国外模型走本地代理穿透，国内模型直连优化延迟”  的智能流量调度机制。
4.   生成式 UI 与底层交互： 深入 ProseMirror (TipTap) 抽象语法树，解决了 React 组件与原生 DOM 的状态同步难题，实现了极度丝滑的 `/` 斜杠悬浮菜单命令。

---

   ✨ 核心功能特性

-   ⌨️ Notion 风格的块级编辑：支持输入 `/` 快速唤出交互式功能菜单。
-   🤖 选区级 AI 沉浸唤醒：在光标处直接召唤 AI，生成的文本实时、流式地注入到当前文档流中，无需复制粘贴。
-   🔀 动态模型切换：前端支持在 Kimi、Gemini、OpenAI、DeepSeek 之间无缝热切换。
-   🎨 现代排版与 UI：基于 Tailwind Typography 插件，提供开箱即用的优质中文阅读排版。
-   🛡️ 稳定与健壮：完善的错误捕获机制，有效处理 API 额度超限 (429)、未授权 (401) 及网络超时等边缘情况。

---

   🛠️ 技术栈

-   前端框架: Next.js 14 (App Router), React 18, TypeScript
-   编辑器内核: TipTap (ProseMirror) + Tippy.js
-   UI & 样式: Tailwind CSS, Framer Motion, Lucide React
-   后端架构: Next.js Route Handlers (RESTful API), Server-Sent Events (SSE)
-   网络与代理: 原生 `fetch`, `undici` (ProxyAgent)

---

   🚀 快速开始 (Getting Started)

     1. 克隆项目与安装依赖
```bash
git clone [https://github.com/hwx-1/lumina-editor.git](https://github.com/你的用户名/lumina-editor.git)
cd lumina-editor
npm install
```
2. 配置环境变量
在项目根目录复制或创建 .env.local 文件，并填入你拥有的 API Key 及本地网络代理端口：

代码段
   国内直连模型 (必填项，推荐作为基础测试)
KIMI_API_KEY=sk-你的Kimi密钥
DEEPSEEK_API_KEY=sk-你的DeepSeek密钥

   国外需代理模型 (选填)
OPENAI_API_KEY=sk-你的OpenAI密钥
GOOGLE_GEMINI_API_KEY=AIzaSy...你的Google密钥

   本地代理配置 (极其重要：用于连通国外模型，请修改为你的实际代理端口)
HTTP_PROXY=[http://127.0.0.1:7890](http://127.0.0.1:7890)


🤝 贡献与后续迭代计划 (Roadmap)
1、接入 Yjs 实现基于 CRDT 算法的多人实时协同编辑。
2、 增强 Generative UI，支持 AI 直接在编辑器内生成可交互的图表 (Echarts) 和代码沙箱。
3、 引入本地 IndexedDB 实现文档的离线存储与持久化。
