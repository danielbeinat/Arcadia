import React, { useState } from "react";
import { User } from "../types/User";

// Componente para mostrar documentos en admin
interface DocumentViewerProps {
  user: User;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ 
  user, 
  onApprove, 
  onReject 
}) => {
  const [showDniModal, setShowDniModal] = useState(false);
  const [showTitleModal, setShowTitleModal] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-4">
      {/* Info básica */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">{user.name} {user.lastName}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <span className={`inline-block px-2 py-1 text-xs rounded ${
            user.status === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
            user.status === 'APROBADO' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
          }`}>
            {user.status}
          </span>
        </div>
        
        {/* Documentos */}
        <div className="flex gap-2">
          {user.dniUrl && (
            <button
              onClick={() => setShowDniModal(true)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              📄 Ver DNI
            </button>
          )}
          
          {user.degreeUrl && (
            <button
              onClick={() => setShowTitleModal(true)}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            >
              📜 Ver Título
            </button>
          )}
        </div>
      </div>

      {/* Modales */}
      {showDniModal && user.dniUrl && (
        <DocumentModal
          title="Documento de Identidad"
          url={user.dniUrl}
          onClose={() => setShowDniModal(false)}
        />
      )}
      
      {showTitleModal && user.degreeUrl && (
        <DocumentModal
          title="Título Universitario"
          url={user.degreeUrl}
          onClose={() => setShowTitleModal(false)}
        />
      )}

      {/* Acciones */}
      {user.status === 'PENDIENTE' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onApprove(user.id)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            ✅ Aprobar
          </button>
          <button
            onClick={() => onReject(user.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            ❌ Rechazar
          </button>
        </div>
      )}
    </div>
  );
};

// Modal para ver documentos
const DocumentModal: React.FC<{
  title: string;
  url: string;
  onClose: () => void;
}> = ({ title, url, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        {/* Vista previa del documento */}
        <div className="mb-4">
          {url.match(/\.(jpg|jpeg|png)$/i) ? (
            <img 
              src={url} 
              alt={title}
              className="max-w-full h-auto rounded"
            />
          ) : (
            <iframe 
              src={url} 
              className="w-full h-96 rounded"
              title={title}
            />
          )}
        </div>
        
        {/* Download */}
        <a
          href={url}
          download
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          📥 Descargar Documento
        </a>
      </div>
    </div>
  );
};
