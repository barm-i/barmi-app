import { Router } from "express";
// controllers
import { loginUser } from "../controllers/loginHandler.js";
import { signupUser } from "../controllers/signupHandler.js";

// global router for api routes
const router = Router();

export function apiRouter() {
  // set routes
  router.get("/", (req, res) => {
    res.json({ message: "api route" });
  });
  router.post("/login", loginUser);
  router.post("/signup", signupUser);

  return router;
}
