import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  rank: { type: Number, required: true },
  point: { type: Number, required: true },
});

// Insert a new row
LeaderboardSchema.statics.insertRow = async function (username, rank, point) {
  const newRow = new this({ username, rank, point });
  await newRow.save();
};

// get all rows
LeaderboardSchema.statics.getAllRows = async function () {
  console.log("getAllRows");
  return await this.find({});
};

// Update score
LeaderboardSchema.statics.updateScore = async function (username, newPoint) {
  await this.findOneAndUpdate({ username }, { $inc: { point: newPoint } });
};

// Reevaluate rank of all users
LeaderboardSchema.statics.reevaluateRanks = async function () {
  const users = await this.find().sort({ point: -1 });
  for (let i = 0; i < users.length; i++) {
    users[i].rank = i + 1;
    await users[i].save();
  }
};

export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
