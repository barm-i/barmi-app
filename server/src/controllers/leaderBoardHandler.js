import { Leaderboard } from "../db/models/leaderboard.js";
import { User } from "../db/models/user.js";

export async function requestRankRows(req, res, next) {
  const rows = await Leaderboard.getAllRows();
=
  res.status(200).json({ rows });
}

export async function updateMyPoint(req, res, next) {
  const { point } = req.body;
  const user = await User.findById(req.user.id);
  const username = user.username;

  Leaderboard.updateScore(username, point);
  Leaderboard.reevaluateRanks();

  res.sendStatus(200);
}
