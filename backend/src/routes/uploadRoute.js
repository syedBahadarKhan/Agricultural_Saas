import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";
import { uploadImage } from "../services/cloudinary.service.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

export const uploadImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const result = await uploadImage(req.file, "agri-saas/listings");

    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error("Cloudinary image upload failed:", error.message);
    const hasInvalidCloudName = /invalid cloud_name/i.test(error.message || "");
    return res.status(hasInvalidCloudName ? 503 : 502).json({
      success: false,
      error: {
        code: hasInvalidCloudName ? "CLOUDINARY_INVALID_CLOUD_NAME" : "IMAGE_UPLOAD_FAILED",
        message: hasInvalidCloudName
          ? "The Cloudinary cloud name configured on the server is invalid. Update CLOUDINARY_CLOUD_NAME in backend/.env with the exact Cloud name shown in your Cloudinary dashboard, then restart the backend."
          : cloudinary.config().cloud_name
            ? "Cloudinary rejected the upload. Check the backend logs for the provider error and confirm the Cloudinary API credentials and account settings."
            : "Image uploads are not configured on the server.",
      },
    });
  }
};

router.post(
  "/image",
  protect,
  authorize("FARMER", "AGGREGATOR", "ADMIN"),
  upload.single("image"),
  uploadImageController
);

export default router;
