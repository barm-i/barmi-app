import { Router } from "express";
// controllers
import { loginUser } from "../controllers/loginHandler.js";

// global router for api routes
const router = Router();

export function apiRouter() {
  // set routes
  router.get("/", (req, res) => {
    res.json({ message: "api route" });
  });
  router.post("/login", loginUser);

  return router;
}
