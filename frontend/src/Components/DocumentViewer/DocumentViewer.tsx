import React, { useState } from "react";
import { User } from "../../types/User";
import { DocumentModal } from "./DocumentModal";

interface DocumentViewerProps {
  user: User;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  user,
  onApprove,
  onReject,
}) => {
  const [showDniModal, setShowDniModal] = useState(false);
  const [showDegreeModal, setShowDegreeModal] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold">
            {user.name} {user.lastName}
          </h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <span
            className={`inline-block px-2 py-1 text-xs rounded ${
              user.status === "PENDIENTE"
                ? "bg-yellow-100 text-yellow-800"
                : user.status === "APROBADO"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {user.status}
          </span>
        </div>

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
              onClick={() => setShowDegreeModal(true)}
              className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            >
              📜 Ver Analítico
            </button>
          )}
        </div>
      </div>

      {showDniModal && user.dniUrl && (
        <DocumentModal
          title="Documento de Identidad (DNI)"
          url={user.dniUrl}
          onClose={() => setShowDniModal(false)}
        />
      )}

      {showDegreeModal && user.degreeUrl && (
        <DocumentModal
          title="Analítico / Título Universitario"
          url={user.degreeUrl}
          onClose={() => setShowDegreeModal(false)}
        />
      )}

      {user.status === "PENDIENTE" && (
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
