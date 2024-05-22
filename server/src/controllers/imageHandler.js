import multer from "multer";
import path from "path";

const __DIRNAME = path.resolve();

// export const uploader = multer({
//   storage: multer.memoryStorage(),
// });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where the files should be saved
    cb(null, __DIRNAME + "/uploads");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using the current timestamp
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const uploader = multer({ storage });
