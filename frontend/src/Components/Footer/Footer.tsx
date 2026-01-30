import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { api } from "../../services/api";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const response = await api.subscribeNewsletter(email);
      if (response.success) {
        setStatus("success");
        setMessage("¡Gracias por suscribirte!");
        setEmail("");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setMessage(response.message || "Error al suscribirse");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Ocurrió un error inesperado");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const socialLinks = [
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "https://www.instagram.com",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "https://www.facebook.com",
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "https://www.twitter.com",
      label: "Twitter",
      color: "hover:text-sky-400",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://www.linkedin.com",
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
  ];

  const quickLinks = [
    { name: "Inicio", to: "/" },
    { name: "Carreras", to: "/presenciales" },
    { name: "Cursos", to: "/cursos" },
    { name: "Nosotros", to: "/about" },
  ];

  const contactInfo = [
    {
      icon: <Mail className="w-4 h-4" />,
      text: "Arcadia@gmail.com",
      href: "mailto:Arcadia@gmail.com",
    },
    {
      icon: <Phone className="w-4 h-4" />,
      text: "+54 11 1234 5678",
      href: "tel:+541112345678",
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      text: "Buenos Aires, Argentina",
      href: "#",
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-indigo-900/10" />

      <div className="relative">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">
                Instituto{" "}
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Arcadia
                </span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Formando profesionales de excelencia con educación de calidad y
                compromiso con el futuro.
              </p>
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`group p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700 
                      border border-slate-700/50 hover:border-slate-600 
                      text-slate-400 ${social.color}
                      transform hover:scale-110 hover:-translate-y-1 transition-all duration-300`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                Enlaces Rápidos
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                Contacto
              </h4>
              <ul className="space-y-3">
                {contactInfo.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-3 group"
                    >
                      <div className="p-2 bg-slate-800/50 rounded-lg group-hover:bg-blue-500/10 transition-colors duration-200">
                        {item.icon}
                      </div>
                      <span>{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                Newsletter
              </h4>
              <p className="text-slate-400 text-sm">
                Recibe las últimas novedades y promociones.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu email"
                    disabled={status === "loading" || status === "success"}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700 
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                      text-slate-300 placeholder:text-slate-500 text-sm
                      transition-all duration-200 outline-none disabled:opacity-50"
                    required
                  />
                  <button
                    type="submit"
                    disabled={
                      status === "loading" || status === "success" || !email
                    }
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 
                    hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg 
                    transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95
                    disabled:opacity-50 disabled:transform-none disabled:hover:scale-100 flex items-center justify-center min-w-[48px]"
                  >
                    {status === "loading" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {status !== "idle" && (
                  <div
                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg transition-all duration-300 ${
                      status === "success"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : status === "error"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "text-slate-400"
                    }`}
                  >
                    {status === "success" && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {status === "error" && <AlertCircle className="w-4 h-4" />}
                    <span>{message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="text-sm text-slate-400 text-center">
                <p className="flex items-center gap-2 justify-center">
                  <span>© {currentYear} Instituto Arcadia.</span>
                  <span className="hidden md:inline">·</span>
                  <span>Todos los derechos reservados.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
