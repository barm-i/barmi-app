// third parties
import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
// internal modules
import connectMongoDB from "./src/db/connect.js";
import { ensureAuthenticated } from "./src/middleware/auth.js";
import { enterLobby } from "./src/socket/session.js";
// api router
import { apiRouter } from "./src/routes/api.js";
import { v2 as cloudinary } from "cloudinary";

// scripts
import "./src/config/passport.js";

// server configuration
dotenv.config();
const __DIRNAME = path.resolve();
const DB_URI = process.env.DB_URI;

// server instance
const app = express(); // express app for API
const httpServer = http.createServer(app); // https server for socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://localhost:5173",
      "https://barmi-client.vercel.app",
      "http://barmi-client.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
}); // for bi-directional communication

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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://localhost:5173",
      "https://barmi-client.vercel.app",
      "http://barmi-client.vercel.app",
    ],
    credentials: true,
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
// handler after connection
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  enterLobby(socket);
});

async function startServer() {
  try {
    await connectMongoDB(DB_URI);
    // config cloudinary
    cloudinary.config({
      cloud_name: "dm0dhix15",
      api_key: "336637532331791",
      api_secret: process.env.CLOUDINARY_SECRET, // Click 'View Credentials' below to copy your API secret
    });

    httpServer.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(`error while starting server : ${error.message}`);
  }
}

// start http server
startServer();
