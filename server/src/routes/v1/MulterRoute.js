const express = require("express");
const upload = require("../../middlewares/ImageUpload");
const router = express.Router();

router.post("/upload", upload.single("fileInput"), (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        res.status(200).json({
            message: "File uploaded successfully",
            // filePath: `/Images/${req.file.filename}`,
            filePath: fileUrl,
        });
    } catch (error) {
        console.error("Error occurred during file upload:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
