// src/config/multerConfig.ts
import multer from 'multer';
import path from 'path';

// cb is a callback function that takes two arguments: error and filename

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb : multer.FileFilterCallback) => {
    const allowedExtensions = /(\.jpeg|\.jpg|\.png)$/i;
    const extnameMatch = allowedExtensions.test(path.extname(file.originalname));
    const mimetypeMatch = allowedExtensions.test(file.mimetype);
  
    if (extnameMatch && mimetypeMatch) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  };
  

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB limit
  fileFilter: fileFilter
});

export default upload;
