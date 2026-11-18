import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-extrabold text-blue-900 mb-2 text-center">Кадровый ассистент</h1>
        <p className="text-gray-500 text-center mb-10">Подсистема управления отпусками</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/requests" className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Заявки на отпуск</h2>
            <p className="text-sm text-gray-500 mt-2">Список всех заявок (панель без ИИ)</p>
          </Link>

          <Link href="/reference" className="group p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-400 transition-all">
            <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Справочник</h2>
            <p className="text-sm text-gray-500 mt-2">Отделы и категории сотрудников</p>
          </Link>

          <Link href="/chat" className="group p-6 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all md:col-span-2 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Чат-ассистент</h2>
              <p className="text-blue-100 mt-1">Задайте вопрос или оформите заявку через ИИ</p>
            </div>
            <span className="text-3xl">💬</span>
          </Link>
        </div>

        <div className="mt-12 text-xs text-gray-400 text-center space-y-1">
          <p>MCP-сервер: <span className="font-mono text-green-600">http://127.0.0.1:8000/mcp</span></p>
          <p>Модель: qwen3:4b-instruct</p>
        </div>
      </div>
    </main>
  );
}