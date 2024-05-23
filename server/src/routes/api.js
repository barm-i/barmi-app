import { Router, response } from "express";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
// controllers
import { loginUser } from "../controllers/loginHandler.js";
import { signupUser, storeFontStyle } from "../controllers/signupHandler.js";
import { uploader, handleFormData } from "../controllers/imageHandler.js";
import { ensureAuthenticated } from "../middleware/auth.js";
import {
  requestRankRows,
  updateMyPoint,
} from "../controllers/leaderBoardHandler.js";
import { clearDocuments } from "../controllers/clearDocumentsAll.js";

// config env
dotenv.config();

// global router for api routes
const router = Router();

export function apiRouter() {
  // set routes
  router.get("/", (req, res) => {
    res.json({ message: "api route" });
  });

  // Auth
  router.post("/login", loginUser);
  router.post("/signup", signupUser);
  router.post(
    "/upload_image",
    /* image middleware */ uploader.array("image", 2),
    handleFormData
  );

  // User info
  router.post("/store_fontstyle", ensureAuthenticated, storeFontStyle);

  // Leaderboard
  router.get("/leaderboard/rows", requestRankRows);
  router.post("/leaderboard/update_me", ensureAuthenticated, updateMyPoint);

  // !!!!!!DO NOT CALL!!!!!!
  router.delete(
    `/user/${process.env.SESSION_SECRET}/delete_all`,
    clearDocuments
  );

  return router;
}
