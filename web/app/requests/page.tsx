"use client";

import { useState } from "react";
import Link from "next/link";
import { createLeaveRequest } from "@/lib/actions";

export default function NewRequestPage() {
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setStatus(null);
    
    const form = e.target;
    const formData = new FormData(form);
    
    const res = await createLeaveRequest(formData);
    setStatus(res);
  }

  return (
    <main className="p-8 max-w-lg mx-auto text-black">
      <h1 className="text-2xl font-bold mb-4">Новая заявка</h1>
      
      {status && (
        <div className={`p-4 mb-4 rounded font-bold ${status.success ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-bold mb-1">Сотрудник</label>
          <input name="employee" required placeholder="Смирнова Ольга" className="w-full border p-2 rounded" />
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