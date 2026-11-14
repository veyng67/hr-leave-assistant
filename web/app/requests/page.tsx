import { fetchLeaveRequests } from "@/lib/actions";
import Link from "next/link";

export default async function RequestsPage() {
  try {
    const content = await fetchLeaveRequests();

    return (
      <main className="p-8 max-w-4xl mx-auto text-black">
        <h1 className="text-2xl font-bold mb-4">Заявки на отпуск</h1>
        <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap text-sm">
          {content || "Заявок не найдено."}
        </pre>
        <Link href="/" className="inline-block mt-4 text-blue-600">
          ← На главную
        </Link>
      </main>
    );
  } catch (error: any) {
    return (
      <main className="p-8 max-w-4xl mx-auto text-black">
        <h1 className="text-2xl font-bold mb-4">Ошибка</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded whitespace-pre-wrap font-mono text-sm">
          {error?.message || String(error)}
        </div>
        <Link href="/" className="inline-block mt-4 text-blue-600">
          ← На главную
        </Link>
      </main>
    );
  }
}