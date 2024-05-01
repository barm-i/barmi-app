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
import connectMongoDB from "./src/db/connect.js";
import { ensureAuthenticated } from "./src/middleware/auth.js";
import { enterLobby } from "./src/socket/session.js";
// api router
import { apiRouter } from "./src/routes/api.js";
// scripts
import "./src/config/passport.js";

// server configuration
dotenv.config();
const __DIRNAME = path.resolve();
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
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day cookie
    },
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

app.get("/login", (req, res) => {
  res.sendFile(path.join(__DIRNAME, "public", "test-login.html"));
});

app.get("/bad-auth", (req, res) => {
  res.sendFile(path.join(__DIRNAME, "public", "badrequest.html"));
});

// socket.io
// start io server
io.on("connection", (socket) => {
  enterLobby(socket);
});

async function startServer() {
  try {
    await connectMongoDB(DB_URI);
    httpServer.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(`error while starting server : ${error.message}`);
  }
}

// start http server
startServer();
