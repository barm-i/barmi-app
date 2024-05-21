import { User } from "../db/models/user.js";
import { Leaderboard } from "../db/models/leaderboard.js";

export async function signupUser(req, res, next) {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create a new user
    const user = new User({ username, password });
    await user.save();

    // Insert a new row in the leaderboard
    await Leaderboard.insertRow(username, 0, 0);

    // Reevaluate ranks
    await Leaderboard.reevaluateRanks();

    // Start a session for the user
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.json({ message: "Signed up successfully" });
    });
  } catch (err) {
    next(err);
  }
}

export async function storeFontStyle(req, res, next) {
  const { fontstyle } = req.body;

  // Get the user from the database
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Update the user's font style
  user.fontstyle = fontstyle;
  await user.save();

  // Send a success message as the response
  res.status(200).json({ message: "font updated" });
}
