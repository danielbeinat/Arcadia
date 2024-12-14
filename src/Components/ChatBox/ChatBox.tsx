import React, { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 group"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-200 rotate-0 group-hover:rotate-90" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>

      {isOpen && (
        <div className="fixed md:bottom-24 md:right-6 bottom-6 px-4 z-50 md:w-full md:max-w-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold">
                  Informes e Inscripción - Instituto Arcadia
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm text-center mb-6">
                Complete el formulario para chatear con el próximo agente
                disponible
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 peer placeholder-transparent"
                      placeholder="Nombre"
                      required
                    />
                    <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-violet-600">
                      Nombre
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 peer placeholder-transparent"
                      placeholder="Email"
                      required
                    />
                    <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-violet-600">
                      Email
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200 peer placeholder-transparent"
                      placeholder="Asunto"
                      required
                    />
                    <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-violet-600">
                      Asunto
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-medium hover:from-violet-500 hover:to-indigo-500 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  Iniciar Chat
                  <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
