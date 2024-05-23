import { User } from "../db/models/user.js";
import { Leaderboard } from "../db/models/leaderboard.js";

export async function clearDocuments(req, res) {
  try {
    await User.deleteMany({});
    // clear leaderboard
    try {
      await Leaderboard.deleteMany({});
      return res.send("All leaderboard documents deleted");
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
}
