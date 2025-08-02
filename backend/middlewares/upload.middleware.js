import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/outpass_photos");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `outpass_${Date.now()}${ext}`);
  },
});

export const upload = multer({ storage });
