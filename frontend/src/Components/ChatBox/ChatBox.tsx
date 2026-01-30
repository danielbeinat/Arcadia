import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  User,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { api } from "../../services/api";

export const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setShowSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await api.submitChatbotInquiry({
        nombre: formData.name,
        email: formData.email,
        mensaje: formData.subject,
      });

      if (response.success) {
        setShowSuccess(true);
        // Resetear formulario después de 3 segundos
        setTimeout(() => {
          setFormData({ name: "", email: "", subject: "" });
          setShowSuccess(false);
        }, 3000);
      } else {
        setError(response.message || "Error al enviar la consulta");
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 group"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300 animate-pulse-glow" />

          {/* Main button */}
          <div
            className="relative p-3 md:p-4 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 
            shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 
            hover:rotate-12 active:scale-95"
          >
            {isOpen ? (
              <X className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform duration-300 group-hover:rotate-90" />
            ) : (
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white transition-transform duration-300 group-hover:scale-110" />
            )}
          </div>

          {/* Notification badge */}
          {!isOpen && (
            <div
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 
              rounded-full border-2 border-white shadow-lg animate-bounce"
            >
              <span className="flex items-center justify-center h-full text-white text-xs font-bold">
                1
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 md:bottom-28 right-4 left-4 md:right-8 md:left-auto z-40 w-auto md:w-full md:max-w-md lg:max-w-sm
            transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95"
            }`}
        >
          {/* Glass morphism card */}
          <div className="relative bg-white/95 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/20 max-h-[calc(100vh-140px)] md:max-h-[600px] lg:max-h-[500px] flex flex-col">
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 opacity-50" />

            {/* Header */}
            <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-4 md:p-6 lg:p-4 flex-shrink-0">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-white/20 rounded-lg md:rounded-xl backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base md:text-lg">
                      ¡Hola! 👋
                    </h2>
                    <p className="text-white/80 text-xs md:text-sm">
                      Instituto Arcadia
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white 
                    transition-all duration-200 hover:rotate-90"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="relative p-4 md:p-6 lg:p-4 space-y-4 md:space-y-6 lg:space-y-4 overflow-y-auto flex-1">
              {showSuccess ? (
                /* Success Message */
                <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">
                    ¡Mensaje Enviado!
                  </h3>
                  <p className="text-slate-600 text-center text-sm">
                    Gracias por contactarnos. Un agente se comunicará contigo
                    pronto.
                  </p>
                </div>
              ) : (
                <>
                  {/* Welcome message */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl lg:rounded-xl p-3 md:p-4 lg:p-3 border border-blue-100">
                    <p className="text-slate-700 text-xs md:text-sm lg:text-xs leading-relaxed">
                      <span className="font-semibold text-blue-700">
                        ¿Necesitas ayuda?
                      </span>
                      <br />
                      Completa el formulario y un agente te atenderá en breve.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-2 text-rose-600 text-xs animate-shake">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-3 md:space-y-4 lg:space-y-3"
                  >
                    {/* Name Input */}
                    <div className="relative group">
                      <div className="absolute left-3 md:left-4 lg:left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200">
                        <User className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 md:pl-12 lg:pl-10 pr-3 md:pr-4 lg:pr-3 py-3 md:py-3.5 lg:py-2.5 rounded-lg md:rounded-xl lg:rounded-lg border-2 border-slate-200 
                          focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                          transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm
                          placeholder:text-slate-400 text-slate-700 font-medium text-sm md:text-base lg:text-sm"
                        placeholder="Tu nombre completo"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                      <div className="absolute left-3 md:left-4 lg:left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200">
                        <Mail className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 md:pl-12 lg:pl-10 pr-3 md:pr-4 lg:pr-3 py-3 md:py-3.5 lg:py-2.5 rounded-lg md:rounded-xl lg:rounded-lg border-2 border-slate-200 
                          focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                          transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm
                          placeholder:text-slate-400 text-slate-700 font-medium text-sm md:text-base lg:text-sm"
                        placeholder="tu@email.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Subject Input */}
                    <div className="relative group">
                      <div className="absolute left-3 md:left-4 lg:left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200">
                        <MessageSquare className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4" />
                      </div>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full pl-10 md:pl-12 lg:pl-10 pr-3 md:pr-4 lg:pr-3 py-3 md:py-3.5 lg:py-2.5 rounded-lg md:rounded-xl lg:rounded-lg border-2 border-slate-200 
                          focus:border-blue-500 focus:ring-4 focus:ring-blue-100 
                          transition-all duration-200 outline-none bg-white/80 backdrop-blur-sm
                          placeholder:text-slate-400 text-slate-700 font-medium text-sm md:text-base lg:text-sm"
                        placeholder="¿En qué podemos ayudarte?"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 md:py-4 lg:py-3 px-4 md:px-6 lg:px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 
                        text-white rounded-lg md:rounded-xl lg:rounded-lg font-semibold text-sm md:text-base lg:text-sm
                        shadow-lg hover:shadow-xl transform hover:-translate-y-1 
                        transition-all duration-300 
                        flex items-center justify-center gap-2 md:gap-3 lg:gap-2 group
                        hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600
                        active:scale-95 relative overflow-hidden
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {/* Button shine effect */}
                      {!isSubmitting && (
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                        />
                      )}

                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span className="relative">Enviando...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative">Iniciar Chat</span>
                          <Send className="w-4 h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5 relative" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer note */}
                  <p className="text-center text-[10px] md:text-xs lg:text-[10px] text-slate-500">
                    Respetamos tu privacidad. Tus datos están seguros con
                    nosotros. 🔒
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
