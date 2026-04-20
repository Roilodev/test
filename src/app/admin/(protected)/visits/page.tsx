export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import VisitActions from "@/components/admin/VisitActions";

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pendente",   color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmada", color: "bg-green-100 text-green-800" },
  done:      { label: "Realizada",  color: "bg-blue-100 text-blue-800" },
  cancelled: { label: "Cancelada",  color: "bg-red-100 text-red-800" },
};

export default async function VisitsPage() {
  const visits = await prisma.visit.findMany({ orderBy: { createdAt: "desc" } });

  const stats = {
    total:     visits.length,
    pending:   visits.filter((v) => v.status === "pending").length,
    confirmed: visits.filter((v) => v.status === "confirmed").length,
    done:      visits.filter((v) => v.status === "done").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Visitas Agendadas</h1>
        <span className="text-sm text-gray-500">{stats.total} no total</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",      value: stats.total,     color: "bg-gray-50 text-gray-700" },
          { label: "Pendentes",  value: stats.pending,   color: "bg-yellow-50 text-yellow-700" },
          { label: "Confirmadas",value: stats.confirmed, color: "bg-green-50 text-green-700" },
          { label: "Realizadas", value: stats.done,      color: "bg-blue-50 text-blue-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium opacity-80">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {visits.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="font-medium">Nenhuma visita agendada ainda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cliente</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Endereço</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Data / Horário</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visits.map((visit) => {
                  const s = STATUS_LABEL[visit.status] ?? STATUS_LABEL.pending;
                  return (
                    <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">{visit.name}</p>
                        <p className="text-gray-400 text-xs">{visit.email}</p>
                        <p className="text-gray-400 text-xs">{visit.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700 max-w-xs truncate">{visit.address}</p>
                        {visit.notes && (
                          <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{visit.notes}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">
                          {visit.date.split("-").reverse().join("/")}
                        </p>
                        <p className="text-xs text-gray-400">{visit.timeSlot}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>
                          {s.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <VisitActions id={visit.id} status={visit.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
