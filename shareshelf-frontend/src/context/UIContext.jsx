import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Gives every page two helpers:
//   toast("Saved!", "success" | "error" | "info")
//   const ok = await confirm({ title, message, confirmText, danger })
const UIContext = createContext(null);

const icons = { success: "✅", error: "⚠️", info: "ℹ️" };

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const toast = useCallback(
    (message, type = "success") => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  const confirm = useCallback(
    (opts = {}) =>
      new Promise((resolve) => {
        setDialog({
          title: opts.title || "Are you sure?",
          message: opts.message || "",
          confirmText: opts.confirmText || "Confirm",
          danger: opts.danger ?? false,
          resolve,
        });
      }),
    []
  );

  const closeDialog = useCallback(
    (result) => {
      if (dialog) dialog.resolve(result);
      setDialog(null);
    },
    [dialog]
  );

  // Escape key cancels the dialog
  useEffect(() => {
    if (!dialog) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeDialog(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dialog, closeDialog]);

  return (
    <UIContext.Provider value={{ toast, confirm }}>
      {children}

      <div className="toast-stack" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`ss-toast ss-toast-${t.type}`} role="status">
            <span>{icons[t.type]}</span>
            <span>{t.message}</span>
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
              ×
            </button>
          </div>
        ))}
      </div>

      {dialog && (
        <>
          <div className="modal-backdrop fade show" onClick={() => closeDialog(false)} />
          <div className="modal d-block" tabIndex={-1} role="dialog" aria-modal="true" onClick={() => closeDialog(false)}>
            <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content border-0 shadow rounded-4">
                <div className="modal-body p-4">
                  <h5 className="fw-bold mb-2">{dialog.title}</h5>
                  {dialog.message && <p className="text-muted mb-4">{dialog.message}</p>}
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-outline-secondary" onClick={() => closeDialog(false)}>
                      Cancel
                    </button>
                    <button
                      className={`btn ${dialog.danger ? "btn-danger" : "btn-brand"}`}
                      onClick={() => closeDialog(true)}
                      autoFocus
                    >
                      {dialog.confirmText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
