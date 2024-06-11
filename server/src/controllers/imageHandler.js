import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../db/models/user.js";

dotenv.config();

const __DIRNAME = path.resolve();

export const uploadImageToCloud = async (
  username,
  buffer1,
  buffer2,
  uniqueName1,
  uniqueName2
) => {
  const dir = path.join(__DIRNAME, "/public/records", username);

  const fileStr1 = buffer1.toString("base64");
  const fileStr2 = buffer2.toString("base64");

  try {
    // upload to cloudinary
    const upload1 = cloudinary.uploader.upload(
      `data:image/png;base64,${fileStr1}`,
      { public_id: `${username}/${uniqueName1}` }
    );
    const upload2 = cloudinary.uploader.upload(
      `data:image/png;base64,${fileStr2}`,
      { public_id: `${username}/${uniqueName2}` }
    );

    const [url1, url2] = await Promise.all([upload1, upload2]);

    console.log("url1", url1);
    const file1 = { filename: uniqueName1, date: new Date(), url: url1 };
    const file2 = { filename: uniqueName2, date: new Date(), url: url2 };

    const user = await User.findOne({ username: username });

    if (user) {
      user.files.push(file1);
      user.files.push(file2);
      await user.save();
    } else {
      // Handle the case where the user does not exist
      console.error(`User with username ${username} does not exist.`);
    }
  } catch (err) {
    // An error occurred during one of the uploads or the database operation
    console.error(err);
  }
};

export const uploader = multer({
  storage: multer.memoryStorage(),
});
