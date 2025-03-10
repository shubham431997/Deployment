import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';


const desktopDir = path.join(os.homedir(), 'Desktop', 'uploads');
console.log(desktopDir);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(desktopDir)) {
      fs.mkdirSync(desktopDir, { recursive: true });
    }

    cb(null, desktopDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Set a unique filename
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Attached images Only....!');
  } 
}


const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

export default upload;
