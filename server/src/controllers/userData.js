import { User } from "../db/models/user.js";
import { Leaderboard } from "../db/models/leaderboard.js";

export const getUserMetadata = async (req, res) => {
  const username = req.body.username;

  // check if username exists
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // user exist
    // get user's files
    const files = user.files;
    let filesGroup = {};
    if (files) {
      // grouping files by date(YYYY-MM-DD)
      files.forEach((file) => {
        let date = file.date.toISOString().split("T")[0];
        if (!filesGroup[date]) {
          filesGroup[date] = [];
        }
        filesGroup[date].push(file.url);
      });
    }

    // fill files_group with files

    // get user's point
    let userRank = await Leaderboard.findOne({ username: username });
    let point = userRank ? userRank.point : 0;

    return res.status(200).json({ point, filesGroup });
  } catch (err) {
    return res.status(400).json({ message: "User not found" });
  }
};
