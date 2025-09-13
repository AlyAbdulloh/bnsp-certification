"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/documentController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post("/", verifyToken, upload.fields([{ name: "document", maxCount: 1 }]), controller.addDocument);
router.get("/", verifyToken, controller.getAllDocuments);
router.get("/:id", verifyToken, controller.getDocument);
router.put("/:id", verifyToken, upload.fields([{ name: "document", maxCount: 1 }]), controller.updateDocument);
router.delete("/:id", verifyToken, controller.deleteDocument);
// // router.delete("/bulk/:ids", verifyToken, controller.deleteBulkDocumentCode);

module.exports = router;