import fs from "fs";
import path from "path";

const FileController = {
  uploadFile: (req, res) => {
    try {
      if (!req.body.uploadPath) {
        return res.status(400).json({ message: "Upload path is required." });
      }

      if (!req.file) {
        return res.status(400).json({ message: "File is required." });
      }

      // Ensure uploadPath does not have trailing or leading slashes
      const sanitizedUploadPath = path.normalize(req.body.uploadPath).replace(/^(\.\.(\/|\\|$))+/, "").replace(/\\/g, "/");
      const fullPath = path.join("uploads", sanitizedUploadPath, req.file.filename);

      res.status(200).json({
        message: "File uploaded successfully.",
        path: fullPath.replace(/\\/g, "/"), // Ensure consistent path format for response
      });
    } catch (err) {
      console.error("Error in uploadFile:", err);
      res.status(500).json({ message: "Internal server error.", error: err.message });
    }
  },

  deleteFile: (req, res) => {
    try {
      const filePath = req.body.filePath; // Full relative path of the file to delete
      if (!filePath) {
        return res.status(400).json({ message: "File path is required." });
      }
      
      const fullPath = path.join(filePath); // Resolve full path to the file

      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ message: "File not found." });
      }

      fs.unlinkSync(fullPath); // Delete the file
      res.status(200).json({ message: "File deleted successfully." });
    } catch (err) {
      console.error("Error in deleteFile:", err);
      res.status(500).json({ message: "Internal server error.", error: err.message });
    }
  },
};

export default FileController;
