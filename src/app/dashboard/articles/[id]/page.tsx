"use client";
import { useEffect, useState } from "react";
import { showPrompt } from "@/lib/dialog";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import ArticleEditor from "@/components/cms/ArticleEditor";
import SlugInput from "@/components/cms/SlugInput";
import ImageUploader from "@/components/cms/ImageUploader";
import { ArrowLeft, Save, Send, Loader2 } from "lucide-react";
import { revalidateCMS } from "@/lib/revalidate";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentJson, setContentJson] = useState<any>(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [category, setCategory] = useState("Berita");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("draft");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((a) => {
        setTitle(a.title);
        setSlug(a.slug);
        setExcerpt(a.excerpt || "");
        setContentHtml(a.content_html || "");
        setFeaturedImageUrl(a.featured_image_url || "");
        setFeaturedImageAlt(a.featured_image_alt || "");
        setCategory(a.category || "Berita");
        setTags((a.tags || []).join(", "));
        setStatus(a.status || "draft");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleSave = async (publish = false) => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          slug,
          title,
          excerpt,
          content_html: contentHtml,
          content_json: contentJson,
          featured_image_url: featuredImageUrl || null,
          featured_image_alt: featuredImageAlt || null,
          category,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          status: publish ? "published" : status,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menyimpan");
      }
      router.push("/dashboard/articles");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/articles"
          className="text-slate-600 hover:text-slate-900 flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke daftar
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Simpan
          </button>
          {status !== "published" && (
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Publish
            </button>
          )}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Edit Artikel</h1>
        <p className="text-sm text-slate-500">{title}</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold p-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Judul Artikel
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Slug URL
              </label>
              <SlugInput
                value={slug}
                onChange={setSlug}
                autoFromTitle={false}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ringkasan
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Konten Artikel
            </label>
            <ArticleEditor
              content={contentHtml}
              onChange={(html, json) => {
                setContentHtml(html);
                setContentJson(json);
              }}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Berita">Berita</option>
                <option value="Dakwah">Dakwah</option>
                <option value="Opini">Opini</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Featured Image</h3>
            <ImageUploader
              endpoint="featuredImage"
              value={featuredImageUrl}
              onChange={setFeaturedImageUrl}
              alt={featuredImageAlt}
              onAltChange={setFeaturedImageAlt}
              maxSizeMB={4}
            />
            <div className="text-[10px] text-slate-500 bg-emerald-50 border border-emerald-100 rounded-lg p-2 leading-relaxed">
              💡 Gambar otomatis dikonversi ke{" "}
              <span className="font-bold">WebP</span> oleh CDN UploadThing untuk
              loading lebih cepat.
              {!featuredImageUrl && (
                <>
                  {" "}
                  Atau{" "}
                  <button
                    type="button"
                    className="text-emerald-700 font-bold underline"
                    onClick={async () => {
                      const url = await showPrompt("Masukkan Image URL:", {
                        title: "Featured Image Manual",
                        placeholder: "/images/...",
                        defaultValue: "/images/",
                      });
                      if (url) setFeaturedImageUrl(url);
                    }}
                  >
                    paste URL manual
                  </button>
                  .
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
