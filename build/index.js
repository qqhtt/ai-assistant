#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { exec } from "child_process";
import { z } from "zod";
// 设置 NODE_TLS_REJECT_UNAUTHORIZED 环境变量
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Create server instance
const server = new McpServer({
    name: "ai-assistant",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// 实现一个工具，可以根据参数打开浏览器, browser 为浏览器，url 为浏览器地址
server.tool('open_browser', '打开浏览器', {
    browser: z.string().describe("浏览器"),
    url: z.string().describe("浏览器地址"),
}, async ({ browser, url }) => {
    console.log(`Opening ${browser} to ${url}`);
    if (browser === "chrome") {
        // 打开chrome浏览器
        exec(`start chrome ${url}`);
    }
    else if (browser === "firefox") {
        // 打开firefox浏览器
        exec(`start firefox ${url}`);
    }
    return {
        content: [
            {
                type: "text",
                text: `浏览器已打开 ${url}`,
            },
        ],
    };
});
async function main() {
    try {
        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("AI Assistant MCP Server running on stdio");
    }
    catch (error) {
        console.error("Fatal error in main():", error);
        process.exit(1);
    }
}
// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的 Promise 拒绝:', reason);
});
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
