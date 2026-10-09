import multer from "multer"

const storage = multer.memoryStorage()

const filefilter = (req, file, cb) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (allowedImageTypes.includes(file.mimetype)) return cb(null, true);
    const error = new Error("Only JPEG, PNG, WebP, and AVIF images are allowed.");
    error.status = 400;
    return cb(error);
}


const upload = multer({
    storage,
     fileFilter: filefilter,
     limits: { fileSize: 1024 * 1024 * 5, files: 1 }
    })

export default upload
