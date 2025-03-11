import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the uploads directory inside the `src` folder
const uploadsDir = path.join(process.cwd(), 'src', 'uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Check file type (only JPEG, JPG, PNG)
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Only JPEG, JPG, and PNG images are allowed!'));
  }
}

// Configure Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
