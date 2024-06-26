import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  date: { type: Date, default: Date.now },
  url: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fontstyle: { type: String, required: true },
  files: [FileSchema],
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
