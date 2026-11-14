import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { ollama } from "ai-sdk-ollama";

export function chatModel() {
  if (process.env.LLM_PROVIDER === "openai-compatible") {
    const provider = createOpenAICompatible({
      name: "llm",
      baseURL: process.env.LLM_BASE_URL!,
      apiKey: process.env.LLM_API_KEY,
    });
    return provider.chatModel(process.env.LLM_MODEL!);
  }
  return ollama(process.env.LLM_MODEL ?? "qwen3:4b-instruct");
}