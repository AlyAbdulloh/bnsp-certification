"use strict";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/docCategoryController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, controller.addDocCategory);
router.get("/", verifyToken, controller.getAllDocCategories);
router.get("/:id", verifyToken, controller.getDocCategoryById);
router.put("/:id", verifyToken, controller.updateDocCategory);
router.delete("/:id", verifyToken, controller.deleteDocCategory);
// router.delete("/bulk/:ids", verifyToken, controller.deleteBulkDocumentCode);

module.exports = router;
