"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const NEXT_STATUS: Record<string, { label: string; value: string; color: string }> = {
  pending:   { label: "Confirmar",  value: "confirmed", color: "text-green-600 hover:bg-green-50" },
  confirmed: { label: "Realizada",  value: "done",      color: "text-blue-600 hover:bg-blue-50" },
  done:      { label: "Realizada",  value: "done",      color: "text-gray-400 cursor-default" },
  cancelled: { label: "Cancelada",  value: "cancelled", color: "text-gray-400 cursor-default" },
};

export default function VisitActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const next = NEXT_STATUS[status] ?? NEXT_STATUS.pending;
  const canAdvance = status !== "done" && status !== "cancelled";

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    await fetch(`/api/visits/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Excluir esta visita?")) return;
    setLoading(true);
    await fetch(`/api/visits/${id}`, { method: "DELETE" });
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {canAdvance && (
        <button
          onClick={() => updateStatus(next.value)}
          disabled={loading}
          className={`text-xs font-medium px-2 py-1 rounded transition-colors disabled:opacity-50 ${next.color}`}
        >
          {next.label}
        </button>
      )}
      {status !== "cancelled" && status !== "done" && (
        <button
          onClick={() => updateStatus("cancelled")}
          disabled={loading}
          className="text-xs font-medium px-2 py-1 rounded text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-xs font-medium px-2 py-1 rounded text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors disabled:opacity-50"
      >
        Excluir
      </button>
    </div>
  );
}
