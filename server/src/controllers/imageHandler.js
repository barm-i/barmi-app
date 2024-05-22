import multer from "multer";
import path from "path";

const __DIRNAME = path.resolve();

export const uploader = multer({
  storage: multer.memoryStorage(),
});
