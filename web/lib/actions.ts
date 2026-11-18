"use server";

import { openMcp } from "./mcp";

export async function fetchLeaveRequests() {
  const mcp = await openMcp();
  try {
    const result = await mcp.callTool({
      name: "list_leave_requests",
      arguments: {},
    });
    
    const text = (result.content as any)[0]?.text || "";
    if (text.includes("не найдено")) return [];
    
    const lines = text.split("\n").slice(1);
    return lines.map((line: string) => {
      const parts = line.split(" | ");
      return {
        id: parts[0]?.replace("№", "").trim(),
        name: parts[1]?.trim(),
        start: parts[2]?.split(" по ")[0]?.trim(),
        end: parts[2]?.split(" по ")[1]?.trim(),
        status: parts[3]?.replace("Статус: ", "").trim(),
      };
    });
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
    return (result.content as any)[0]?.text || "Нет данных";
  } finally {
    await mcp.close();
  }
}

export async function createLeaveRequest(formData: FormData) {
  const mcp = await openMcp();
  try {
    const employee = formData.get("employee") as string;
    const start = formData.get("start") as string;
    const end = formData.get("end") as string;

    await mcp.callTool({
      name: "submit_leave_request",
      arguments: {
        employee_name: employee,
        date_start: start,
        date_end: end,
      },
    });

    const { revalidatePath } = await import("next/cache");
    revalidatePath("/requests");
    
    return { success: true, message: "Заявка успешно создана!" };
  } catch (error: any) {
    return { success: false, message: error.message || "Ошибка при создании" };
  } finally {
    await mcp.close();
  }
}

export async function executeCancel(id: number) {
  const mcp = await openMcp();
  try {
    const result = await mcp.callTool({
      name: "cancel_leave_request",
      arguments: { request_id: id },
    });
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/requests");
    return result;
  } finally {
    await mcp.close();
  }
}