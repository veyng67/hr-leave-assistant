import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-2">Кадровый ассистент</h1>
      <p className="text-gray-600 mb-8">Подсистема «Отпуска» отдела кадров</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/requests"
          className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold mb-1">Заявки на отпуск</h2>
          <p className="text-sm text-gray-500">Список всех заявок (панель, без ИИ)</p>
        </Link>

        <Link
          href="/reference"
          className="block p-6 bg-white border rounded-lg shadow hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold mb-1">Справочник</h2>
          <p className="text-sm text-gray-500">Отделы и категории сотрудников</p>
        </Link>

        <Link
          href="/chat"
          className="block p-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition md:col-span-2"
        >
          <h2 className="text-xl font-semibold mb-1">Чат-ассистент</h2>
          <p className="text-sm opacity-90">Задайте вопрос или оформите заявку через ИИ</p>
        </Link>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>MCP-сервер: <span className="text-green-600 font-bold">http://127.0.0.1:8000/mcp</span></p>
        <p>Модель: qwen3:4b-instruct</p>
      </div>
    </main>
  );
}