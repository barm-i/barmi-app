import { Router, response } from "express";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
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
    async (req, res) => {
      const { text, flag } = req.body;

      // Create a new FormData instance
      const formData = new FormData();

      const uniqueName1 = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const uniqueName2 = Date.now() + "-" + Math.round(Math.random() * 1e9);

      //Append the images and textContent to formData
      formData.append("font_photo", req.files[0].buffer, {
        filename: uniqueName1,
        contentType: req.files[0].mimetype,
      });
      formData.append("handwriting_photo", req.files[1].buffer, {
        filename: uniqueName2,
        contentType: req.files[1].mimetype,
      });
      formData.append("text", text);

      if (flag === "game") {
        // TODO : 게임 결과 디비 반영
        try {
          const response = await axios.post(
            `${process.env.AI_SERVER_URI}/game`,
            formData,
            {
              headers: formData.getHeaders(),
            }
          );

          console.log("game result", response.data);

          return res.status(200).json({ message: "game result updated" });
        } catch (error) {
          console.error(error);
          return res.sendStatus(500);
        }
      } else {
        // 피드백 반환
        try {
          const response = await axios.post(
            `${process.env.AI_SERVER_URI}/feedback`,
            formData,
            {
              headers: formData.getHeaders(),
            }
          );

          if (response.data.feedbacks) {
            response.data.feedbacks.forEach((feedback) => {
              console.log(feedback.feedback, feedback.coordinates);
            });
          }

          return res.status(200).json(response.data);
        } catch (error) {
          console.error(error);
          return res.sendStatus(500);
        }
      }
    }
  );

  // User info
  router.post("/store_fontstyle", ensureAuthenticated, storeFontStyle);

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
