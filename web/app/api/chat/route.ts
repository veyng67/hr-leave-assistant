import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { chatModel } from "@/lib/llm";
import { openMcp } from "@/lib/mcp";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const mcp = await openMcp();
  const tools = await mcp.tools();

  const result = streamText({
    model: chatModel(),
    system: "Ты кадровый помощник. Отвечай только по-русски. Если пользователь просит отменить заявку, НЕ отменяй её сам, а просто напиши текст: 'Для отмены заявки №X требуется ваше подтверждение.'",
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(5),
    onFinish: () => mcp.close(),
    onError: (err) => {
      console.error("STREAM ERROR:", err);
      mcp.close();
    },
  });

  return result.toUIMessageStreamResponse({ sendReasoning: false });
}