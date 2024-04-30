// third parties
import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Server } from "socket.io";
import { createServer } from "http";
// internal modules
import { ensureAuthenticated } from "./src/middleware/auth.js";
// api router
import { apiRouter } from "./src/routes/api.js";
// scripts
import "./src/config/passport.js";

// server configuration
dotenv.config();
const __DIRNAME = path.resolve();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// server instance
const app = express(); // express app for API
const httpServer = createServer(app); // http server for socket.io
const io = new Server(httpServer); // for bi-directional communication

// set middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: DB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.static(path.join(__DIRNAME, "public")));
app.use("/api", apiRouter());

// for test
app.get("/", (req, res) => {
  res.sendFile(path.join(__DIRNAME, "public", "index.html"));
});

app.get("/test-auth", ensureAuthenticated, (req, res) => {
  res.send("authenticated");
});

app.get("/bad-auth", (req, res) => {
  res.sendFile(path.join(__DIRNAME, "public", "badrequest.html"));
});

async function startServer() {
  try {
    // await connectMongoDB(DB_URI);
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`error while starting server : ${error.message}`);
  }
}

startServer();
