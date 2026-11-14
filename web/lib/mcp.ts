import "server-only";
import { createMCPClient } from "@ai-sdk/mcp";

export async function openMcp() {
  const url = process.env.MCP_URL;
  const token = process.env.MCP_TOKEN;
  
  if (!url || !token) {
    throw new Error("Не заданы MCP_URL и MCP_TOKEN в .env.local");
  }
  
  return createMCPClient({
    transport: {
      type: "http",
      url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}