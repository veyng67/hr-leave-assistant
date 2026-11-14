import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { chatModel } from "@/lib/llm";
import { openMcp } from "@/lib/mcp";
import { NEEDS_APPROVAL } from "@/lib/approvals";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const mcp = await openMcp();
  const tools = await mcp.tools();

  // Помечаем опасные инструменты (отмена заявки)
  for (const name of NEEDS_APPROVAL) {
    if (tools[name]) {
      tools[name] = { ...tools[name], needsApproval: true };
    }
  }

  const result = streamText({
    model: chatModel(),
    system: "Ты кадровый помощник. Отвечай только по-русски. Изменения выполняй вызовом инструмента, а не обещанием. Если пользователь просит отменить заявку, используй cancel_leave_request.",
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
    onFinish: () => mcp.close(),
    onError: () => mcp.close(),
  });

  // Рассуждение модели в браузер не отправляем
  return result.toUIMessageStreamResponse({ sendReasoning: false });
}