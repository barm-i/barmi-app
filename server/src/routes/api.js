import { Router } from "express";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
// controllers
import { loginUser } from "../controllers/loginHandler.js";
import { signupUser, storeFontStyle } from "../controllers/signupHandler.js";
import { uploader, uploadImageToCloud } from "../controllers/imageHandler.js";
import { ensureAuthenticated } from "../middleware/auth.js";
import {
  requestRankRows,
  updateMyPoint,
  getAUserPoint,
} from "../controllers/leaderBoardHandler.js";
import { clearDocuments } from "../controllers/clearDocumentsAll.js";
import https from "https";
import { Leaderboard } from "../db/models/leaderboard.js";
import { User } from "../db/models/user.js";
import { sendText } from "../controllers/fontGenController.js";

import { getUserMetadata } from "../controllers/userData.js";

export const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

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
      const { text, flag, username } = req.body;

      // Create a new FormData instance
      const formData = new FormData();

      const uniqueName1 = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const uniqueName2 = Date.now() + "-" + Math.round(Math.random() * 1e9);

      uploadImageToCloud(
        username,
        req.files[0].buffer,
        req.files[1].buffer,
        uniqueName1,
        uniqueName2
      );

      const FINAL_SERVER_URL = process.env.AI_SERVER_URI
        ? process.env.AI_SERVER_URI
        : "none";

      if (FINAL_SERVER_URL === "none") {
        return res.status(500).json({ message: "AI server not found" });
      }

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

      console.log("game result");

      if (flag === "game") {
        try {
          const response = await axios.post(
            `${FINAL_SERVER_URL}/game`,
            formData,
            {
              headers: formData.getHeaders(),
              httpsAgent: httpsAgent,
            }
          );

          const score = response.data.score;
          // find user
          if (username === "") {
            return res.status(404).json({ message: "User not found" });
          }
          // update score
          Leaderboard.updateScore(username, score);

          return res.status(200).json({ score });
        } catch (error) {
          console.error(error);
          console.log("cannot connect to AI server");
          return res.sendStatus(500);
        }
      } else {
        try {
          const response = await axios.post(
            `${FINAL_SERVER_URL}/feedback`,
            formData,
            {
              headers: formData.getHeaders(),
              httpsAgent: httpsAgent,
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
          console.log("cannot connect to AI server");
          return res.sendStatus(500);
        }
      }
    }
  );

  // User info
  router.post("/store_fontstyle", storeFontStyle);

  // Leaderboard
  router.get("/leaderboard/rows", requestRankRows);
  router.post("/leaderboard/get_point", getAUserPoint);
  router.post("/leaderboard/update_me", ensureAuthenticated, updateMyPoint);

  // mypage
  router.post("/mypage/metadata", getUserMetadata);

  // font generation
  // font template send
  router.post(
    "/fontgen/gen",
    /* image middleware */ uploader.array("files", 3),
    async (req, res) => {
      // Create a new FormData instance
      const formData = new FormData();

      const [file1, file2, file3] = req.files;

      const API_URL = "https://175.196.97.78:6259/upload_reference";

      //Append the images and textContent to formData
      formData.append("files", file1.buffer, {
        filename: "h1",
        contentType: file1.mimetype,
      });
      formData.append("files", file2.buffer, {
        filename: "h2",
        contentType: file2.mimetype,
      });
      formData.append("files", file3.buffer, {
        filename: "h3",
        contentType: file3.mimetype,
      });

      try {
        const response = await axios.post(API_URL, formData, {
          headers: formData.getHeaders(),
          httpsAgent: httpsAgent,
        });

        if (response.status === 200) {
          return res
            .status(200)
            .json({ message: "handwritings sent successfully" });
        } else {
          return res.status(500).json({ message: "error while sending" });
        }
      } catch (error) {
        console.error(error);
        console.log("cannot connect to AI server");
        return res.sendStatus(500);
      }
    }
  );
  // font text test
  router.post("/fontgen/test", async (req, res) => {
    const { text } = req.body;

    const response = await axios.post(
      "https://175.196.97.78:6259/generate_image",
      { text },
      {
        headers: {
          "Content-Type": "application/json",
        },
        httpsAgent: httpsAgent,
      }
    );

    if (response.status === 200) {
      return res.status(200).json({ message: "Text sent successfully" });
    } else {
      return res.status(500).json({ message: "error while sending" });
    }
  });

  // !!!!!!DO NOT CALL!!!!!!
  router.delete(
    `/user/${process.env.SESSION_SECRET}/delete_all`,
    clearDocuments
  );

  return router;
}
