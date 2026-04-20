"use client";

import { useState } from "react";

type Props = { onClose: () => void };

const TIME_SLOTS = ["08:00 – 10:00", "10:00 – 12:00", "14:00 – 16:00", "16:00 – 18:00"];

const STEPS = ["Dados pessoais", "Endereço e data", "Confirmação"];

export default function VisitModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", date: "", timeSlot: TIME_SLOTS[0], notes: "",
  });

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleSubmit = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error ?? "Erro ao agendar");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Erro de conexão");
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-800 to-amber-600 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold text-lg">Agendar Visita</h2>
              <p className="text-amber-200 text-sm">Medição e consultoria gratuitas</p>
            </div>
            <button type="button" onClick={onClose} className="text-amber-200 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Steps */}
          {status !== "success" && (
            <div className="flex items-center gap-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                    i < step ? "bg-white text-amber-700" :
                    i === step ? "bg-amber-400 text-white" :
                    "bg-amber-700/50 text-amber-300"
                  }`}>
                    {i < step ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block ${i === step ? "text-white font-medium" : "text-amber-300"}`}>
                    {label}
                  </span>
                  {i < STEPS.length - 1 && <div className="flex-1 h-px bg-amber-600 mx-1" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Success */}
          {status === "success" && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visita agendada!</h3>
              <p className="text-gray-500 text-sm mb-1">
                Confirmamos para <strong>{form.date.split("-").reverse().join("/")}</strong> das <strong>{form.timeSlot}</strong>.
              </p>
              <p className="text-gray-500 text-sm mb-6">Entraremos em contato pelo e-mail <strong>{form.email}</strong>.</p>
              <button
                type="button"
                onClick={onClose}
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-8 py-2.5 rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>
          )}

          {/* Step 0 — Personal data */}
          {status !== "success" && step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Seu nome" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="seu@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp *</label>
                <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="+55 (11) 99999-9999" />
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={!form.name || !form.email || !form.phone}
                className="w-full bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Step 1 — Address & date */}
          {status !== "success" && step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço completo *</label>
                <input value={form.address} onChange={(e) => set("address", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Rua, número, bairro, cidade" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data preferida *</label>
                  <input type="date" value={form.date} min={minDateStr}
                    onChange={(e) => set("date", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário *</label>
                  <select value={form.timeSlot} onChange={(e) => set("timeSlot", e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                    {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">O que você precisa? (opcional)</label>
                <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
                  rows={3} placeholder="Ex: sala de estar, quarto casal, escritório..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl transition-colors">
                  ← Voltar
                </button>
                <button type="button" onClick={() => setStep(2)}
                  disabled={!form.address || !form.date}
                  className="flex-1 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — Confirm */}
          {status !== "success" && step === 2 && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-xl p-4 space-y-2 text-sm">
                {[
                  { label: "Nome", value: form.name },
                  { label: "E-mail", value: form.email },
                  { label: "Telefone", value: form.phone },
                  { label: "Endereço", value: form.address },
                  { label: "Data", value: form.date.split("-").reverse().join("/") },
                  { label: "Horário", value: form.timeSlot },
                  ...(form.notes ? [{ label: "Observações", value: form.notes }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-gray-500 font-medium w-24 flex-shrink-0">{label}:</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                ))}
              </div>

              {status === "error" && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>
              )}

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-xl transition-colors">
                  ← Voltar
                </button>
                <button type="button" onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="flex-1 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors">
                  {status === "loading" ? "Agendando..." : "Confirmar visita"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
