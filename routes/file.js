import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import sanitize from "sanitize-filename"; // Sanitize input filenames
import FileController from "../controllers/fileController.js";

export const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const baseDir = "uploads";
    const dynamicPath = sanitize(req.body.uploadPath || "default"); // Sanitize and provide a fallback
    const fullDir = path.join(baseDir, dynamicPath);

    console.log("Received uploadPath:", req.body.uploadPath); // Debug log
    console.log("Sanitized uploadPath:", dynamicPath); // Debug log

    try {
      if (!fs.existsSync(fullDir)) {
        fs.mkdirSync(fullDir, { recursive: true }); // Create directories recursively
        console.log("Directory created:", fullDir); // Debug log
      }
      cb(null, fullDir);
    } catch (error) {
      console.error("Error creating upload directory:", error);
      cb(error); // Pass error to multer
    }
  },
  filename: (req, file, cb) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const ext = path.extname(file.originalname);
      let basename = sanitize(path.basename(file.originalname, ext));

      // Replace spaces with underscores in the filename
      basename = basename.replace(/\s+/g, "_");

      cb(null, `${basename}-${timestamp}${ext}`); // Append timestamp to file name
    } catch (error) {
      console.error("Error generating file name:", error);
      cb(error);
    }
  },
});

// Initialize multer
const upload = multer({ storage });

// Middleware to parse other fields (like uploadPath) before Multer
router.post(
  "/upload",
  express.urlencoded({ extended: true }), // Parse non-file fields
  upload.single("file"), // Process file upload
  FileController.uploadFile
);

router.delete("/delete", FileController.deleteFile);

export default router;
