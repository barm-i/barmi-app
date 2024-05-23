import { Leaderboard } from "../db/models/leaderboard.js";
import { User } from "../db/models/user.js";

export async function requestRankRows(req, res, next) {
  const rows = await Leaderboard.getAllRows();

  // sort rows by descending order of point
  rows.sort((a, b) => b.point - a.point);

  res.status(200).json({ rows });
}

export async function updateMyPoint(req, res, next) {
  const { point } = req.body;
  const user = await User.findById(req.user.id);
  const username = user.username;

  Leaderboard.updateScore(username, point);

  res.sendStatus(200);
}
