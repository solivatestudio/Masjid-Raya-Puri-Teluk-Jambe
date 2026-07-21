"use client";
import { useEffect, useState } from "react";
import { showAlert, showConfirm } from "@/lib/dialog";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Lock,
} from "lucide-react";
import StatusBadge from "@/components/cms/StatusBadge";
import DataTable from "@/components/cms/DataTable";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export default function PicPage() {
  const router = useRouter();
  const [items, setItems] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/users", { credentials: "include" });
    if (res.status === 403) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
    if (res.ok) setItems(await res.json());
    setLoading(false);
  };
  const loadMe = async () => {
    const res = await fetch("/api/admin/auth/me", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data.user);
    }
  };
  useEffect(() => {
    load();
    loadMe();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (id === currentUser?.id) {
      await showAlert("Tidak bisa menghapus akun sendiri", {
        title: "Aksi Tidak Diizinkan",
      });
      return;
    }
    if (
      !(await showConfirm(`Hapus user "${name}"?`, {
        title: "Hapus User",
        confirmLabel: "Hapus",
        tone: "danger",
      }))
    )
      return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      await showAlert(data.error || "Gagal", { title: "Gagal" });
    }
    load();
  };

  if (accessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mb-4">
          <Lock className="w-10 h-10 text-rose-600" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Akses Ditolak
        </h1>
        <p className="text-sm text-slate-600 max-w-md">
          Manajemen user hanya dapat diakses oleh Admin.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Manajemen User
          </h1>
          <p className="text-sm text-slate-500">
            Kelola akun admin & editor CMS
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Tambah User
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
            <ShieldCheck className="w-4 h-4" /> Admin
          </div>
          <p className="text-xs text-amber-900/80 mt-1">
            Akses penuh: keuangan, booking aula, trafik, konten, dan manajemen
            user.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-blue-800 font-extrabold text-sm">
            <ShieldAlert className="w-4 h-4" /> Editor
          </div>
          <p className="text-xs text-blue-900/80 mt-1">
            Akses konten saja: artikel blog, kajian/dauroh, dan jadwal khutbah.
            Tidak bisa membuka data operasional sensitif.
          </p>
        </div>
      </div>

      <DataTable<User>
        data={items}
        loading={loading}
        searchPlaceholder="Cari nama atau email..."
        searchKeys={["name", "email"]}
        emptyMessage="Belum ada user"
        rowKey={(u) => u.id}
        columns={[
          {
            key: "name",
            header: "Nama",
            render: (u) => (
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  {u.role === "admin" ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                  )}{" "}
                  {u.name}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {u.email}
                </div>
              </div>
            ),
          },
          {
            key: "role",
            header: "Role",
            className: "w-24",
            render: (u) => <StatusBadge status={u.role} />,
          },
          {
            key: "status",
            header: "Status",
            className: "w-24",
            render: (u) => (
              <StatusBadge status={u.is_active ? "active" : "inactive"} />
            ),
          },
          {
            key: "last_login",
            header: "Login Terakhir",
            className: "w-36",
            render: (u) => (
              <span className="text-xs text-slate-500">
                {u.last_login_at
                  ? new Date(u.last_login_at).toLocaleString("id-ID", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                  : "Belum pernah"}
              </span>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "w-24 text-right",
            render: (u) => (
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/dashboard/users/${u.id}`}
                  className="p-1.5 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(u.id, u.name)}
                  className="p-1.5 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ),
          },
        ]}
      />

      {showForm && (
        <PicFormModal
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function PicFormModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name, role }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Gagal");
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Tambah User</h3>
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl mb-3">
            {error}
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password (min 8 karakter)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
            >
              <option value="editor">Editor (CRUD content)</option>
              <option value="admin">Admin (full akses)</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold px-4 py-2 rounded-xl"
          >
            {saving ? "Simpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
