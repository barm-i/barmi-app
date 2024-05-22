import { Router } from "express";
// controllers
import { loginUser } from "../controllers/loginHandler.js";
import { signupUser, storeFontStyle } from "../controllers/signupHandler.js";
import { uploader } from "../controllers/imageHandler.js";
import { ensureAuthenticated } from "../middleware/auth.js";
import {
  requestRankRows,
  updateMyPoint,
} from "../controllers/leaderBoardHandler.js";
import { User } from "../db/models/user.js";

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
    /* image middleware */ uploader.single("image"),
    (req, res) => {
      res.sendStatus(200);
    }
  );

  // User info
  router.post("/store_fontstyle", storeFontStyle);

  // Leaderboard
  router.get("/leaderboard/rows", requestRankRows);
  router.post("/leaderboard/update_me", ensureAuthenticated, updateMyPoint);

  // DO NOT CALL
  router.delete("/user/delete_all", async (req, res) => {
    try {
      await User.deleteMany({});
      res.send("All user documents deleted");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

  return router;
}
