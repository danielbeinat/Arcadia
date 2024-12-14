import {
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ExternalLink,
} from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <Instagram className="w-5 h-5" />,
      href: "#",
      label: "Instagram",
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      href: "#",
      label: "Facebook",
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: "#",
      label: "Twitter",
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: "#",
      label: "LinkedIn",
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-slate-800">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative p-2 rounded-full bg-slate-800/50 hover:bg-slate-700 
                    border border-slate-700/50 hover:border-slate-600 
                    text-slate-400 hover:text-white
                    transform hover:scale-110 transition-all duration-300"
                >
                  {social.icon}
                  <span
                    className="absolute -top-10 left-1/2 -translate-x-1/2 
                    bg-slate-800 text-slate-200 px-2 py-1 rounded text-xs
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    {social.label}
                  </span>
                </a>
              ))}
            </div>

            <div className="text-center flex flex-col md:flex-row items-center gap-2">
              <p className="text-sm text-slate-400">
                <span className="font-medium">© {currentYear}</span>
                <span className="mx-2">·</span>
                <span>Todos los Derechos Reservados</span>
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="hidden md:inline text-slate-600">—</span>
                <span className="text-slate-400">Diseñado</span>
                <span className="text-slate-400">por</span>
                <a
                  href="#"
                  className="group inline-flex items-center gap-1 text-slate-300 hover:text-white font-medium transition-colors duration-200"
                >
                  Daniel Beinat
                  <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
