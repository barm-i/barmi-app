import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  point: { type: Number, required: true },
});

// Insert a new row
LeaderboardSchema.statics.insertRow = async function (username, point) {
  const newRow = new this({ username, point });
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

export const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
