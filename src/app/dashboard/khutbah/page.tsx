"use client";
import { useEffect, useState } from "react";
import { showAlert, showConfirm } from "@/lib/dialog";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  CalendarDays,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { revalidateCMS } from "@/lib/revalidate";
import DataTable from "@/components/cms/DataTable";

interface Khutbah {
  id: string;
  schedule_date: string;
  khatib: string;
  muadzin: string | null;
  theme: string | null;
  pic_name: string | null;
}

export default function KhutbahPage() {
  const [items, setItems] = useState<Khutbah[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/khutbah", {
      credentials: "include",
      cache: "no-store",
    });
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, khatib: string) => {
    if (
      !(await showConfirm(`Hapus jadwal khutbah "${khatib}"?`, {
        title: "Hapus Jadwal Khutbah",
        confirmLabel: "Hapus",
        tone: "danger",
      }))
    )
      return;
    await fetch(`/api/admin/khutbah/${id}`, {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
    });
    load();
  };

  const handleGenerate = async () => {
    if (
      !(await showConfirm(
        "Generate jadwal kosong untuk 4 Jumat ke depan? Yang sudah ada akan dilewati.",
        { title: "Generate Jadwal Khutbah", confirmLabel: "Generate" },
      ))
    )
      return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/khutbah/generate", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      await showAlert(
        `Generate selesai: ${data.created} dibuat, ${data.skipped} dilewati (sudah ada)`,
        { title: "Generate Selesai" },
      );
      await load();
      await revalidateCMS();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Jadwal Khutbah Jumat
          </h1>
          <p className="text-sm text-slate-500">
            Kelola khatib, muadzin, dan tema khutbah
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Generate 4 Jumat
          </button>
          <Link
            href="/dashboard/khutbah/new"
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Tambah Manual
          </Link>
        </div>
      </div>

      <DataTable<Khutbah>
        data={items}
        loading={loading}
        searchPlaceholder="Cari nama khatib / muadzin..."
        searchKeys={["khatib", "muadzin"]}
        emptyMessage="Belum ada jadwal khutbah"
        rowKey={(k) => k.id}
        columns={[
          {
            key: "date",
            header: "Tanggal",
            className: "w-40",
            render: (k) => (
              <span className="text-xs font-mono">
                {new Date(k.schedule_date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            ),
          },
          {
            key: "khatib",
            header: "Khatib",
            render: (k) => (
              <div>
                <div className="font-bold text-slate-900">{k.khatib}</div>
                <div className="text-xs text-slate-500">{k.muadzin || "—"}</div>
              </div>
            ),
          },
          {
            key: "theme",
            header: "Tema",
            render: (k) => (
              <span className="text-xs text-slate-600 italic">
                {k.theme || "—"}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "w-24 text-right",
            render: (k) => (
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/dashboard/khutbah/${k.id}`}
                  className="p-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(k.id, k.khatib)}
                  className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
