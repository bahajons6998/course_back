const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();


// Fayl saqlash sozlamalari
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Fayllar 'uploads' papkasiga saqlanadi
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB cheklov
  fileFilter: (req, file, cb) => {
    console.log("Yuklanayotgan fayl:", file);
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Faqat rasm fayllari (jpeg, jpg, png, gif, webp) ruxsat etiladi!"));
  },
});

// Rasm yuklash endpointi
router.post("/uploads", upload.single("upload"), (req, res) => {
  try {
    console.log(req)
    if (!req.file) {
      return res.status(400).json({ error: "Fayl yuklanmadi" });
    }
    // CKEditor uchun to'g'ri javob formati
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    console.log(fileUrl);
    res.json({
      uploaded: true, // CKEditor uchun zarur
      url: fileUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fayl yuklashda xatolik yuz berdi" });
  }
});

// Uploads papkasidagi fayllarni xizmat qilish
router.use("/uploads", express.static("uploads"));

module.exports = router;