import { fetchReference } from "@/lib/actions";
import Link from "next/link";

export default async function ReferencePage() {
  let content = "";
  try {
    content = await fetchReference();
  } catch (e) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Справочник</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">Ошибка подключения к MCP-серверу.</div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Справочник</h1>
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
          {content}
        </pre>
      </div>
      <Link href="/" className="inline-block mt-6 text-blue-600 hover:underline">
        ← На главную
      </Link>
    </main>
  );
}