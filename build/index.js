import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { exec } from "child_process";
import { z } from "zod";
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
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("AI Assistant MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
