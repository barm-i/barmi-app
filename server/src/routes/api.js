import { Router } from "express";
// controllers
import { loginUser } from "../controllers/loginHandler.js";
import { signupUser } from "../controllers/signupHandler.js";
import { uploader } from "../controllers/imageHandler.js";

// global router for api routes
const router = Router();

export function apiRouter() {
  // set routes
  router.get("/", (req, res) => {
    res.json({ message: "api route" });
  });
  router.post("/login", loginUser);
  router.post("/signup", signupUser);
  router.post(
    "/upload_image",
    /* image middleware */ uploader.single("image"),
    (req, res) => {
      res.sendStatus(200);
    }
  );

  return router;
}
