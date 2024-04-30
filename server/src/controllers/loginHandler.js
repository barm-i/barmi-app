import passport from "passport";

export async function loginUser(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (info) {
      // error message is in info
      return res.status(400).json(info);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ message: "failed" });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json({ message: "success" });
    });
  })(req, res, next);
}
