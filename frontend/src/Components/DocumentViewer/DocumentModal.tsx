import React, { useState, useEffect } from "react";
import api from "../../services/api";

interface DocumentModalProps {
  title: string;
  url: string;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  title,
  url,
  onClose,
}) => {
  const [displayUrl, setDisplayUrl] = useState<string>(url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadUrl = async () => {
      if (!url) return;

      // Para URLs de Supabase Storage, obtener URL firmada (funciona con buckets privados)
      if (url.includes("supabase") && url.includes("/storage/")) {
        setLoading(true);
        setError(null);
        try {
          const signedUrl = await api.getSignedDocumentUrl(url);
          if (!cancelled) setDisplayUrl(signedUrl);
        } catch (err) {
          console.error("Error obteniendo URL firmada:", err);
          if (!cancelled) {
            setError("No se pudo cargar el documento. Intenta de nuevo.");
            setDisplayUrl(url); // Fallback a URL original
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else {
        setDisplayUrl(url);
      }
    };

    loadUrl();
    return () => {
      cancelled = true;
    };
  }, [url]);

  const isImage = displayUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPdf = displayUrl.toLowerCase().includes(".pdf") || displayUrl.includes("/raw/");

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-600 border-t-transparent" />
              <span className="ml-3 text-gray-600">Cargando documento...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-600">
              <p>{error}</p>
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-indigo-600 hover:underline"
              >
                Abrir en nueva pestaña
              </a>
            </div>
          ) : isImage ? (
            <img
              src={displayUrl}
              alt={title}
              className="max-w-full h-auto rounded-lg mx-auto"
            />
          ) : (
            <iframe
              src={displayUrl}
              className="w-full h-[70vh] rounded-lg border border-gray-200"
              title={title}
            />
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
          <a
            href={displayUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            📥 Descargar
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
