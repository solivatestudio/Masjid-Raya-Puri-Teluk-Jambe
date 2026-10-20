"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { showPrompt } from "@/lib/dialog";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  UploadCloud,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { tiptapExtensions } from "@/lib/tiptap";
import { uploadFiles } from "@/lib/uploadthing";
import styles from "@/styles/article-content.module.css";

interface ArticleEditorProps {
  content: string;
  onChange: (html: string, json: any) => void;
  placeholder?: string;
}

export default function ArticleEditor({
  content,
  onChange,
  placeholder,
}: ArticleEditorProps) {
  const lastJson = useRef<string>("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageTab, setImageTab] = useState<"upload" | "url">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [altText, setAltText] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: tiptapExtensions(placeholder),
    content: content || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `${styles.articleContent} min-h-[420px] focus:outline-none p-4`,
      },
      handleDrop: (view, event, slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files.length > 0
        ) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            handleSelectFile(file);
            setShowImageModal(true);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        const imageItem = items.find((item) => item.type.startsWith("image/"));
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            event.preventDefault();
            handleSelectFile(file);
            setShowImageModal(true);
            return true;
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const json = JSON.stringify(editor.getJSON());
      if (json !== lastJson.current) {
        lastJson.current = json;
        onChange(html, editor.getJSON());
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith("blob:")) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleSelectFile = (file: File) => {
    setUploadError("");
    setUploadSuccess(false);

    if (!file.type.startsWith("image/")) {
      setUploadError("Format file tidak didukung. Harap pilih gambar (JPG, PNG, WebP, GIF).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError("Ukuran file melebihi 4MB. Harap kompres gambar terlebih dahulu.");
      return;
    }

    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleUploadAndInsert = async () => {
    if (!selectedFile || !editor) return;

    setUploadError("");
    setIsUploading(true);

    try {
      const res = await uploadFiles("articleImage", {
        files: [selectedFile],
      });

      const uploadedUrl = res?.[0]?.ufsUrl || res?.[0]?.url;

      if (!uploadedUrl) {
        throw new Error("Upload berhasil tetapi URL gambar tidak ditemukan.");
      }

      setUploadSuccess(true);

      setTimeout(() => {
        editor
          .chain()
          .focus()
          .setImage({
            src: uploadedUrl,
            alt: altText.trim() || selectedFile.name,
            title: altText.trim() || selectedFile.name,
          })
          .run();

        closeModal();
      }, 500);
    } catch (err: any) {
      console.error("Upload error:", err);
      setUploadError(
        err.message ||
          "Gagal mengunggah gambar. Pastikan koneksi stabil atau coba gambar lain."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleInsertUrl = () => {
    if (!editor || !imageUrlInput.trim()) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrlInput.trim(),
        alt: altText.trim(),
        title: altText.trim(),
      })
      .run();

    closeModal();
  };

  const closeModal = () => {
    setShowImageModal(false);
    setSelectedFile(null);
    if (filePreview && filePreview.startsWith("blob:")) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview("");
    setAltText("");
    setImageUrlInput("");
    setUploadError("");
    setUploadSuccess(false);
    setIsUploading(false);
  };

  if (!editor) {
    return (
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-slate-500 text-sm">
        Memuat editor artikel...
      </div>
    );
  }

  const btn = (active: boolean) =>
    `p-2 rounded hover:bg-slate-100 transition ${
      active ? "bg-slate-200 text-emerald-700" : "text-slate-600"
    }`;

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btn(editor.isActive("bold"))}
          title="Bold (Tebal)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btn(editor.isActive("italic"))}
          title="Italic (Miring)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btn(editor.isActive("underline"))}
          title="Underline (Garis Bawah)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btn(editor.isActive("strike"))}
          title="Strikethrough (Coret)"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={btn(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={btn(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={btn(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btn(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btn(editor.isActive("orderedList"))}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btn(editor.isActive("blockquote"))}
          title="Kutipan (Blockquote)"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={btn(editor.isActive("codeBlock"))}
          title="Blok Kode"
        >
          <Code className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={btn(editor.isActive({ textAlign: "left" }))}
          title="Rata Kiri"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={btn(editor.isActive({ textAlign: "center" }))}
          title="Rata Tengah"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={btn(editor.isActive({ textAlign: "right" }))}
          title="Rata Kanan"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={async () => {
            const url = await showPrompt("Masukkan URL link:", {
              title: "Tambahkan Link",
              placeholder: "https://...",
            });
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          className={btn(editor.isActive("link"))}
          title="Sisipkan Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* IMAGE TOOLBAR BUTTON */}
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-2 rounded hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition"
          title="Upload / Sisipkan Gambar ke Posisi Kursor"
        >
          <ImageIcon className="w-4 h-4" />
          <span className="text-xs font-bold hidden sm:inline">Gambar</span>
        </button>

        <span className="w-px h-5 bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={btn(false)}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={btn(false)}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />

      {/* Modal Upload & Insert Image */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Sisipkan Gambar ke Artikel
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Gambar akan dimasukkan pada posisi kursor aktif
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={isUploading}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab navigation */}
            <div className="flex border-b border-slate-200 px-5 pt-2 gap-4">
              <button
                type="button"
                onClick={() => setImageTab("upload")}
                className={`pb-2.5 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                  imageTab === "upload"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageTab("url")}
                className={`pb-2.5 text-xs font-bold transition flex items-center gap-1.5 border-b-2 ${
                  imageTab === "url"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" /> Dari URL Eksternal
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5 space-y-4">
              {uploadError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Gambar berhasil diunggah dan disisipkan ke artikel!</span>
                </div>
              )}

              {imageTab === "upload" ? (
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleSelectFile(file);
                    }}
                    className="hidden"
                  />

                  {!selectedFile ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file) handleSelectFile(file);
                      }}
                      className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-100 group-hover:scale-110 transition flex items-center justify-center text-emerald-700">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-1">
                        Pilih gambar dari perangkat atau tarik ke sini
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Format JPG, PNG, WebP, GIF (Maks. 4MB)
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-56 flex items-center justify-center">
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="max-h-56 w-auto object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setFilePreview("");
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          disabled={isUploading}
                          className="absolute top-2 right-2 bg-slate-900/70 hover:bg-slate-900 text-white p-1 rounded-full text-xs shadow-md transition"
                          title="Hapus pilihan"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                        <span className="truncate max-w-[240px] font-medium text-slate-700">
                          {selectedFile.name}
                        </span>
                        <span>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alt Text / Keterangan Gambar (SEO & Aksesibilitas)
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Contoh: Suasana kajian sholat tarawih di masjid"
                      disabled={isUploading}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL Gambar (https://...)
                    </label>
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="https://example.com/foto-kegiatan.jpg"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Alt Text / Keterangan Gambar
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Deskripsi singkat gambar"
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {imageUrlInput && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 max-h-48 flex items-center justify-center p-2">
                      <img
                        src={imageUrlInput}
                        alt="Preview URL"
                        className="max-h-44 w-auto object-contain rounded-lg"
                        onError={() =>
                          setUploadError("Gagal memuat URL gambar. Pastikan URL valid dan dapat diakses.")
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-slate-100 bg-slate-50">
              <button
                type="button"
                onClick={closeModal}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition"
              >
                Batal
              </button>

              {imageTab === "upload" ? (
                <button
                  type="button"
                  onClick={handleUploadAndInsert}
                  disabled={!selectedFile || isUploading}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload & Sisipkan</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleInsertUrl}
                  disabled={!imageUrlInput.trim()}
                  className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition"
                >
                  <span>Sisipkan Gambar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
