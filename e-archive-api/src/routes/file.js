"use strict";

const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const response = require("../tools/response");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/*", async (req, res) => {
    // Get the file path from the request (everything after '/files/')
    const filePath = req.params[0]; // This captures the dynamic part after /

    console.log(filePath);

    // Define the base uploads directory
    const uploadsDir = path.join(__dirname, "../..");

    // Resolve the full file path
    const fullPath = path.join(uploadsDir, filePath);

    // Ensure the file is within the uploads directory and exists
    if (!fullPath.startsWith(uploadsDir) || !fs.existsSync(fullPath)) {
        return response(req, res, {
            status: 404,
            message: "File not found",
        });
    }

    // Serve the file
    res.status(200).sendFile(fullPath);
});

module.exports = router;
