"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAlert } from "@/app/src/hooks/useAlerts";

const ALERT_TYPES = ["info", "warning", "error", "success"] as const;

export default function NewAlertPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info" as (typeof ALERT_TYPES)[number],
    status: "unread" as "unread" | "read",
    source: "system",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      setError("El título y el mensaje son requeridos.");
      return;
    }
    setSaving(true);
    try {
      await createAlert({
        title: form.title,
        message: form.message,
        type: form.type,
        status: form.status,
        source: form.source || "system",
      });
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid rgba(145,158,171,0.32)",
    fontSize: 14,
    outline: "none",
    backgroundColor: "#fff",
    color: "var(--text-primary)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-secondary)",
    marginBottom: 6,
  };

  // Color accent según tipo
  const typeColors: Record<string, string> = {
    info: "#0284c7",
    warning: "#d97706",
    error: "#e11d48",
    success: "#059669",
  };
  const accentColor = typeColors[form.type] ?? "#4f46e5";

  return (
    <div className="p-6 max-w-xl mx-auto space-y-5">
      <div>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-sm font-medium mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver
        </button>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Nueva Alerta
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
          Crea una nueva notificación del sistema
        </p>
      </div>

      <div
        className="bg-white rounded-xl p-6"
        style={{ boxShadow: "0 0 2px 0 rgba(145,158,171,0.2), 0 12px 24px -4px rgba(145,158,171,0.12)" }}
      >
        {error && (
          <div
            className="mb-4 px-4 py-3 rounded-lg text-sm"
            style={{ backgroundColor: "rgba(225,29,72,0.08)", color: "#e11d48" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label style={labelStyle}>Título *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Conexión fallida con el servidor"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Mensaje *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              placeholder="Describe el detalle de la alerta…"
              style={{ ...inputStyle, resize: "none" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Tipo</label>
              <select name="type" value={form.type} onChange={handleChange} style={{ ...inputStyle, color: accentColor, fontWeight: 600 }}>
                {ALERT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Estado inicial</label>
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                <option value="unread">No leída</option>
                <option value="read">Leída</option>
              </select>
            </div>

            <div className="col-span-2">
              <label style={labelStyle}>Fuente</label>
              <input
                name="source"
                value={form.source}
                onChange={handleChange}
                placeholder="Ej: system, api, monitor…"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
              style={{ border: "1px solid rgba(145,158,171,0.32)", color: "var(--text-secondary)" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: saving ? "#fda4af" : accentColor }}
            >
              {saving ? "Guardando…" : "Crear Alerta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
