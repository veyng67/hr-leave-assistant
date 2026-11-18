"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { executeCancel } from "@/lib/actions";

export default function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [cancelledIds, setCancelledIds] = useState<number[]>([]);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleCancel(id: number) {
    await executeCancel(id);
    setCancelledIds((prev) => [...prev, id]);
    sendMessage({ text: `Заявка №${id} успешно отменена.` });
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-white shadow-lg">
      <header className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Кадровый ассистент</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">На главную</Link>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p>Задайте вопрос про отпуска, курсы валют или погоду.</p>
          </div>
        )}
        
        {messages.map((m) => {
          let textToShow = "";
          let showButtons = false;
          let idToCancel = 0;

          m.parts.forEach((part) => {
            if (part.type === "text") {
              textToShow += part.text;
            }
          });

          if (m.role === "assistant") {
             const match = textToShow.match(/№?\s*(\d+)/) || textToShow.match(/номер\s*(\d+)/i);
             if (match && (textToShow.toLowerCase().includes("отмен") || textToShow.toLowerCase().includes("подтверд"))) {
                const parsed = parseInt(match[1], 10);
                if (!cancelledIds.includes(parsed)) {
                  showButtons = true;
                  idToCancel = parsed;
                }
             }
          }

          return (
            <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <span className="text-xs text-gray-500 mb-1 px-1">
                {m.role === "user" ? "Вы" : "Ассистент"}
              </span>
              <div className={`max-w-[85%] rounded-2xl p-3 ${m.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
                <div className="whitespace-pre-wrap">{textToShow}</div>

                {showButtons && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-black">
                    <p className="mb-2 font-bold text-red-700">Подтвердите операцию с заявкой №{idToCancel}</p>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 text-white px-4 py-1.5 rounded shadow hover:bg-green-700 text-sm font-semibold"
                        onClick={() => handleCancel(idToCancel)}
                      >
                        Выполнить
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-1.5 rounded shadow hover:bg-gray-600 text-sm font-semibold"
                        onClick={() => {
                          setCancelledIds((prev) => [...prev, idToCancel]);
                          sendMessage({ text: "Нет, я отказываюсь." });
                        }}
                      >
                        Отклонить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && <div className="text-gray-500 text-sm animate-pulse">Ассистент печатает...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="p-4 border-t bg-gray-50 flex gap-2"
      >
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напишите сообщение..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          Отправить
        </button>
      </form>
    </div>
  );
}