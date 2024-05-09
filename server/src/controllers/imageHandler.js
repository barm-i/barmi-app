import multer from "multer";
import path from "path";

const __DIRNAME = path.resolve();

export const uploader = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      console.log(file);
      done(null, file.originalname);
    },
    destination(req, file, done) {
      console.log(file);
      done(null, path.join(__DIRNAME, "public"));
    },
  }),
});
