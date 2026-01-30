import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  static async uploadImage(file: string, folder: string = "avatars") {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder: `academianova/${folder}`,
        resource_type: "auto",
      });
      return result.secure_url;
    } catch (error) {
      console.error("❌ Error uploading to Cloudinary:", error);
      throw new Error("Error al subir el archivo a Cloudinary");
    }
  }

  static async uploadDocument(file: string, folder: string = "documents") {
    try {
      const isPdf = file.toLowerCase().endsWith(".pdf");
      const result = await cloudinary.uploader.upload(file, {
        folder: `academianova/${folder}`,
        resource_type: isPdf ? "raw" : "auto",
      });
      return result.secure_url;
    } catch (error) {
      console.error("❌ Error uploading document to Cloudinary:", error);
      throw new Error("Error al subir el documento a Cloudinary");
    }
  }

  static async deleteFile(url: string) {
    try {
      const publicId = url.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error("❌ Error deleting from Cloudinary:", error);
    }
  }
}
