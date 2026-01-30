import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { AppError } from "./errorHandler";
import dotenv from "dotenv";

dotenv.config();

// Configurar Cloudinary antes de usarlo en el storage
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determinar la carpeta según el campo del formulario
    let folder = "academianova/others";
    if (file.fieldname === "avatar") folder = "academianova/avatars";
    if (file.fieldname === "dniUrl") folder = "academianova/dni";
    if (file.fieldname === "degreeUrl") folder = "academianova/degrees";

    const isPdf = file.mimetype === "application/pdf";

    return {
      folder: folder,
      resource_type: isPdf ? "raw" : "auto",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      // Solo aplicar allowed_formats si no es raw
      ...(isPdf ? {} : { allowed_formats: ["jpg", "jpeg", "png"] }),
    };
  },
});

// Filtro de archivos
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Tipo de archivo no permitido. Solo se aceptan JPG, PNG y PDF.",
        400,
      ),
      false,
    );
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5MB
  },
});
