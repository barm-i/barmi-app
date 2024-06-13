import axios from "axios";
// import { httpsAgent } from "../routes/api.js";
import https from "https";
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function sendText(req, res) {
  const { text } = req.body;

  const response = await axios.post(
    "https://175.196.97.78:6259/generate_image",
    { text },
    {
      headers: {
        "Content-Type": "application/json",
        httpsAgent: httpsAgent,
      },
    }
  );

  if (response.status === 200) {
    return res.status(200).json({ message: "Text sent successfully" });
  } else {
    return res.status(500).json({ message: "error while sending" });
  }
}
