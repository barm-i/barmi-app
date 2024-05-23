import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import FormData from "form-data";
import axios from "axios";

dotenv.config();

const __DIRNAME = path.resolve();

export const uploader = multer({
  storage: multer.memoryStorage(),
});
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Specify the directory where the files should be saved
//     cb(null, __DIRNAME + "/uploads");
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique filename using the current timestamp
//     const uniqueName =
//       Date.now() +
//       "-" +
//       Math.round(Math.random() * 1e9) +
//       path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// export const uploader = multer({ storage });

export async function handleFormData(req, res) {
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

  const FINAL_SERVER_URL = process.env.AI_HTTP_SERVER_URI
    ? process.env.AI_HTTP_SERVER_URI
    : process.env.AI_HTTPS_SERVER_URI
    ? process.env.AI_HTTPS_SERVER_URI
    : "none";

  if (FINAL_SERVER_URL === "none") {
    return res.status(500).json({ message: "AI server not found" });
  }

  if (flag === "game") {
    // TODO : 게임 결과 디비 반영
    try {
      const response = await axios.post(`${FINAL_SERVER_URL}/game`, formData, {
        headers: formData.getHeaders(),
      });

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
        `${FINAL_SERVER_URL}/feedback`,
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
