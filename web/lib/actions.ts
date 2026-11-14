"use server";

import { openMcp } from "./mcp";

export async function fetchLeaveRequests() {
  const mcp = await openMcp();
  try {
    const result = await mcp.callTool({
      name: "list_leave_requests",
      arguments: {},
    });
    if (Array.isArray(result.content)) {
        return result.content.map((c: any) => c.text || "").join("\n");
    }
    return String(result.content);
  } finally {
    await mcp.close();
  }
}

export async function fetchReference() {
  const mcp = await openMcp();
  try {
    const result = await mcp.callTool({
      name: "list_leave_requests",
      arguments: {},
    });
    return JSON.stringify(result.content);
  } finally {
    await mcp.close();
  }
}