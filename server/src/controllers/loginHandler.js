import passport from "passport";

export async function loginUser(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user && info.notFound) {
      return res.status(404).json({ needSignUp: true });
    }
    if (!user && info.invalid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // user exists.
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ login: true });
    });
  })(req, res, next);
}
