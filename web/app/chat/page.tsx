"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function ChatPage() {
  const { messages, sendMessage, status, addToolApprovalResponse } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <div className="flex flex-col h-screen p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Кадровый ассистент</h1>
      
      <div className="flex-1 overflow-y-auto border rounded p-4 mb-4 space-y-4 bg-gray-50 text-black">
        {messages.map((m) => (
          <div key={m.id} className="flex flex-col">
            <span className="font-bold text-sm text-gray-500">
              {m.role === "user" ? "Вы:" : "Ассистент:"}
            </span>
            {m.parts.map((part, i) => {
              if (part.type === "text") {
                return <span key={i} className="whitespace-pre-wrap">{part.text}</span>;
              }
              if (part.type === "tool-invocation") {
                const { toolInvocation } = part;
                return (
                  <div key={i} className="my-2 p-2 bg-blue-100 rounded text-sm">
                    <div><strong>Инструмент:</strong> {toolInvocation.toolName}</div>
                    <div><strong>Аргументы:</strong> {JSON.stringify(toolInvocation.args)}</div>
                    {toolInvocation.state === "result" && (
                      <div><strong>Результат:</strong> {JSON.stringify(toolInvocation.result)}</div>
                    )}
                    {toolInvocation.state === "approval-requested" && (
                      <div className="mt-2 p-2 bg-yellow-200 rounded text-black border border-yellow-400">
                        <p className="mb-2 font-bold">Требуется подтверждение опасной операции!</p>
                        <button
                          className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                          onClick={() => addToolApprovalResponse({ id: toolInvocation.approval.id, approved: true })}
                        >
                          Выполнить
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() => addToolApprovalResponse({ id: toolInvocation.approval.id, approved: false })}
                        >
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
        {isLoading && <div className="text-gray-500 italic">Ассистент думает...</div>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          className="flex-1 border rounded px-3 py-2 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спросите про отпуск..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={isLoading}
        >
          Отправить
        </button>
      </form>
    </div>
  );
}