'use client';

import { toast as _toast, ToastContainer, Slide, Id, UpdateOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { ActionResult } from '@/actions/Bookmarks';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

/* ── Hook simple para toasts puntuales ────────────────── */
export function useToast() {
  return (message: string, type: ToastType = 'info') => {
    _toast(message, { type });
  };
}

/* ── toastFlow: loading → metadata → db → success/error ─
   Uso:
     const id = toastFlow.start('Guardando...');
     const meta = await GetMeta(url);
     if (!meta.ok) { toastFlow.error(id, meta.message); return; }
     toastFlow.step(id, 'Guardando en base de datos...');
     const res = await SaveToDB(...);
     if (!res.ok) { toastFlow.error(id, res.message); return; }
     toastFlow.success(id, '¡Bookmark guardado!');
──────────────────────────────────────────────────────── */
const base: UpdateOptions = {
  isLoading:       false,
  autoClose:       3500,
  closeOnClick:    true,
  closeButton:     true,
  draggable:       false,
};

export const toastFlow = {
  start(msg: string): Id {
    return _toast.loading(msg, { closeButton: false });
  },
  step(id: Id, msg: string) {
    _toast.update(id, { ...base, isLoading: true, render: msg, closeButton: false, autoClose: false });
  },
  success(id: Id, msg: string) {
    _toast.update(id, { ...base, type: 'success', render: msg });
  },
  error(id: Id, msg: string) {
    _toast.update(id, { ...base, type: 'error', render: msg, autoClose: 5000 });
  },
};

/* ── Resultado de action → helper que dispara el toast correcto ── */
export function resolveActionResult(id: Id, result: ActionResult, successMsg: string) {
  if (result.ok) {
    toastFlow.success(id, successMsg);
  } else {
    toastFlow.error(id, result.message);
  }
}

/* ── Contenedor ───────────────────────────────────────── */
export function AppToastContainer() {
  return (
    <>
      <style>{`
        :root {
          --toastify-font-family:            'IBM Plex Mono', monospace;
          --toastify-z-index:                9999;
          --toastify-color-light:            var(--bg-raised);
          --toastify-color-dark:             var(--bg-raised);
          --toastify-text-color-light:       var(--text-mid);
          --toastify-text-color-dark:        var(--text-mid);
          --toastify-color-success:          var(--color-success);
          --toastify-color-error:            var(--color-danger);
          --toastify-color-warning:          #e6b673;
          --toastify-color-info:             var(--accent);
          --toastify-color-progress-success: var(--color-success);
          --toastify-color-progress-error:   var(--color-danger);
          --toastify-color-progress-warning: #e6b673;
          --toastify-color-progress-info:    var(--accent);
          --toastify-color-progress-dark:    var(--accent);
          --toastify-spinner-color:          var(--accent);
          --toastify-spinner-color-empty-area: var(--border);
        }

        .Toastify__toast-container { width: 320px !important; padding: 0 !important; }
        .Toastify__toast-container--bottom-right { bottom: 24px !important; right: 24px !important; }

        @media (max-width: 600px) {
          .Toastify__toast-container--bottom-right {
            width: 90vw !important; bottom: auto !important; right: auto !important;
            top: 16px !important; left: 50% !important; transform: translateX(-50%) !important;
          }
        }

        .Toastify__toast {
          background:     var(--bg-raised) !important;
          border:         1px solid var(--border) !important;
          border-radius:  2px !important;
          box-shadow:     0 8px 32px rgba(0,0,0,0.5) !important;
          padding:        10px 14px !important;
          min-height:     0 !important;
          margin-bottom:  6px !important;
          font-size:      0.72rem !important;
          letter-spacing: 0.02em !important;
          color:          var(--text-mid) !important;
        }

        .Toastify__toast--success { border-left: 3px solid var(--color-success) !important; }
        .Toastify__toast--error   { border-left: 3px solid var(--color-danger)  !important; }
        .Toastify__toast--warning { border-left: 3px solid #e6b673              !important; }
        .Toastify__toast--info    { border-left: 3px solid var(--accent)         !important; }
        .Toastify__toast--default { border-left: 3px solid var(--border)         !important; }

        .Toastify__toast-body {
          padding: 0 !important; margin: 0 !important;
          align-items: center !important; gap: 8px !important;
          font-family: 'IBM Plex Mono', monospace !important;
        }

        .Toastify__toast-icon { width: 16px !important; margin-right: 0 !important; flex-shrink: 0 !important; }

        .Toastify__toast--success .Toastify__toast-icon { color: var(--color-success) !important; }
        .Toastify__toast--error   .Toastify__toast-icon { color: var(--color-danger)  !important; }
        .Toastify__toast--warning .Toastify__toast-icon { color: #e6b673              !important; }
        .Toastify__toast--info    .Toastify__toast-icon { color: var(--accent)         !important; }

        /* Spinner del loading state */
        .Toastify__spinner { border-top-color: var(--accent) !important; width: 14px !important; height: 14px !important; }

        .Toastify__close-button {
          color: var(--text-lo) !important; opacity: 1 !important;
          align-self: center !important; padding: 0 !important;
          background: transparent !important; transition: color 0.12s !important;
        }
        .Toastify__close-button:hover { color: var(--accent) !important; }
        .Toastify__close-button > svg { width: 12px !important; height: 12px !important; }

        .Toastify__progress-bar { height: 2px !important; opacity: 0.5 !important; }
        .Toastify__progress-bar--success { background: var(--color-success) !important; }
        .Toastify__progress-bar--error   { background: var(--color-danger)  !important; }
        .Toastify__progress-bar--warning { background: #e6b673              !important; }
        .Toastify__progress-bar--info    { background: var(--accent)         !important; }
        .Toastify__progress-bar-theme--dark { background: var(--accent)      !important; }
      `}</style>

      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        pauseOnHover
        draggable={false}
        transition={Slide}
        theme="dark"
      />
    </>
  );
}
