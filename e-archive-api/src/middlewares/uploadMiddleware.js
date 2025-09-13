const multer = require("multer");
const path = require("path");

// Define allowed file types
const allowedFileTypes = ["application/pdf"];

const PATH = path.join(__dirname, "../../uploads/documents");

// Define maximum file size (in bytes)
const maxFileSize = 10 * 1024 * 1024; // 10 MB

// Define storage with dynamic subdirectories and file size limit
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file) {
      cb(null, PATH);
    } else {
      cb(new Error("Invalid field name."));
    }
  },
  filename: (req, file, cb) => {
    // Custom filename logic (e.g., keep original filename)
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fullFilename = Date.now() + "-" + safeFilename;
    cb(null, fullFilename);
  },
});

// File type filter function
const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}.`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});

module.exports = upload;
