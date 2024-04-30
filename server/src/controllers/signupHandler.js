import { User } from "../db/models/user.js";

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
