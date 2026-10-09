import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadImage = (file, folder) => {
  if (!file?.buffer?.length) return Promise.reject(new Error("A non-empty image file is required."));
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  if (!cloud_name || !api_key || !api_secret) {
    return Promise.reject(new Error("Cloudinary is not configured. Check the CLOUDINARY_* environment variables."));
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || "agri-saas/uploads",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (!result?.secure_url || !result?.public_id) {
          reject(new Error("Cloudinary returned an incomplete upload result."));
        } else {
          resolve(result);
        }
      }
    );

    const inputStream = streamifier.createReadStream(file.buffer);
    inputStream.on("error", reject);
    uploadStream.on("error", reject);
    inputStream.pipe(uploadStream);
  });
};

export const deleteImage = async (publicId) => {
  if (!publicId || typeof publicId !== "string") throw new Error("A valid Cloudinary public ID is required.");
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  return result.result === "ok" || result.result === "not found";
};
