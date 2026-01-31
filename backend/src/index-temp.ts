// Versión temporal para debug de CORS
app.use(cors({
  origin: "*", // Permitir todos los orígenes (solo para debug)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
