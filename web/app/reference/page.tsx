import { fetchReference } from "@/lib/actions";
import Link from "next/link";

export default async function ReferencePage() {
  let content: string;
  try {
    content = await fetchReference();
  } catch (e) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Справочник</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          Ошибка подключения к MCP-серверу.
        </div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">Справочник</h1>
      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
        {content}
      </pre>
      <Link href="/" className="inline-block mt-4 text-blue-600">
        ← На главную
      </Link>
    </main>
  );
}