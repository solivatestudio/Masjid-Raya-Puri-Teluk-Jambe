'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function EditPicPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('editor');
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetch(`/api/admin/users/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((u) => {
        setName(u.name); setRole(u.role); setIsActive(u.is_active); setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setError(''); setSaving(true);
    try {
      const body: any = { name, role, is_active: isActive };
      if (password) body.password = password;
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Gagal');
      router.push('/dashboard/users');
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center h-64"><Loader2 className="w-8 h-8 text-emerald-600 animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <Link href="/dashboard/users" className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm"><ArrowLeft className="w-4 h-4" /> Kembali</Link>
      <h1 className="text-2xl font-extrabold text-slate-900">Edit User</h1>
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm p-3 rounded-xl">{error}</div>}
      <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-6 space-y-4">
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Nama</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none">
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="rounded" /><span className="text-xs font-bold text-slate-700">Aktif (bisa login)</span></label>
        <div><label className="block text-xs font-bold text-slate-700 mb-1">Reset Password (kosongkan jika tidak diubah)</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 karakter" className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none" /></div>
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button onClick={handleSave} disabled={saving} className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan</button>
        </div>
      </div>
    </div>
  );
}
