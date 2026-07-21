type DialogOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  placeholder?: string;
  defaultValue?: string;
  tone?: "default" | "danger";
};

type DialogMode = "alert" | "confirm" | "prompt";

function openDialog(
  mode: DialogMode,
  options: DialogOptions,
): Promise<boolean | string | null> {
  if (typeof document === "undefined")
    return Promise.resolve(mode === "confirm" ? false : null);

  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 z-[9999] bg-slate-950/70 flex items-center justify-center p-4";

    const panel = document.createElement("div");
    panel.className =
      "w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200";

    const title = document.createElement("h3");
    title.className = "text-lg font-bold text-slate-900";
    title.textContent =
      options.title || (mode === "confirm" ? "Konfirmasi" : "Informasi");

    const message = document.createElement("p");
    message.className =
      "mt-2 text-sm leading-relaxed text-slate-600 whitespace-pre-line";
    message.textContent = options.message;

    let input: HTMLInputElement | null = null;
    if (mode === "prompt") {
      input = document.createElement("input");
      input.className =
        "mt-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600";
      input.placeholder = options.placeholder || "";
      input.value = options.defaultValue || "";
    }

    const actions = document.createElement("div");
    actions.className = "mt-5 flex justify-end gap-2";

    const cleanup = (value: boolean | string | null) => {
      overlay.remove();
      resolve(value);
    };

    if (mode !== "alert") {
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className =
        "px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100";
      cancel.textContent = options.cancelLabel || "Batal";
      cancel.onclick = () => cleanup(mode === "confirm" ? false : null);
      actions.appendChild(cancel);
    }

    const confirm = document.createElement("button");
    confirm.type = "button";
    confirm.className =
      options.tone === "danger"
        ? "px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
        : "px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white";
    confirm.textContent =
      options.confirmLabel || (mode === "alert" ? "Mengerti" : "Lanjutkan");
    confirm.onclick = () =>
      cleanup(mode === "prompt" ? input?.value || "" : true);
    actions.appendChild(confirm);

    panel.appendChild(title);
    panel.appendChild(message);
    if (input) panel.appendChild(input);
    panel.appendChild(actions);
    overlay.appendChild(panel);
    overlay.onclick = (event) => {
      if (event.target === overlay) cleanup(mode === "confirm" ? false : null);
    };
    document.body.appendChild(overlay);
    input?.focus();
  });
}

export function showAlert(
  message: string,
  options: Omit<DialogOptions, "message"> = {},
) {
  return openDialog("alert", { ...options, message });
}

export async function showConfirm(
  message: string,
  options: Omit<DialogOptions, "message"> = {},
) {
  return Boolean(await openDialog("confirm", { ...options, message }));
}

export async function showPrompt(
  message: string,
  options: Omit<DialogOptions, "message"> = {},
) {
  const value = await openDialog("prompt", { ...options, message });
  return typeof value === "string" ? value : null;
}
