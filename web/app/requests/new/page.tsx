"use client";

import { useState } from "react";
import { createLeaveRequest } from "@/lib/actions";
import Link from "next/link";

export default function NewRequestPage() {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    const res = await createLeaveRequest(formData);
    setStatus(res);
  }

  return (
    <main className="p-8 max-w-lg mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">Новая заявка</h1>
      
      {status && (
        <div className={`p-4 mb-4 rounded ${status.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {status.message}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Сотрудник</label>
          <input name="employee" required placeholder="Например: Смирнова Ольга" className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Дата начала</label>
          <input name="start" type="date" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Дата окончания</label>
          <input name="end" type="date" required className="w-full border p-2 rounded" />
        </div>
        
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Отправить заявку
        </button>
      </form>

      <Link href="/requests" className="inline-block mt-4 text-blue-600">
        ← К списку заявок
      </Link>
    </main>
  );
}