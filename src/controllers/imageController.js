import express from "express";
import upload from "../middlewares/upload";

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res, next) => {
  try {
    const filePath = `/uploads/${req.file.filename}`;

    return res.status(200).json({ imagePath: filePath });
  } catch (error) {
    next(error);
  }
});

export default router;