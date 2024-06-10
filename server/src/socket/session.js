import { io } from "../../index.js";
import { Leaderboard } from "../db/models/leaderboard.js";

const lobby = [];
const TEN_MINUTES = 1000 * 60 * 10;
const ONE_MINUTE = 1000 * 60;
/**
 * RTT measurement
 */
// TODO : 정확한 게임시간 계산
const RTT_QUEUE_SIZE = 10; // Change this to set the number of RTT measurements to average
const rttQueue = [];
let rttAvg = -1;

function addRttMeasurement(rtt) {
  // rtt가 초기화 되지 않았을 때, 초기값 설정
  if (rttAvg == -1) {
    rttAvg = rtt;
  }

  if (rttQueue.length >= RTT_QUEUE_SIZE) {
    rttQueue.shift(); // Remove the oldest RTT measurement if the queue is full
  }
  rttQueue.push(rtt); // Add the new RTT measurement to the queue

  // Calculate the average RTT
  const rttSum = rttQueue.reduce((sum, rtt) => sum + rtt, 0);
  rttAvg = rttSum / rttQueue.length;
}

function measureRttMilliseconds(socket) {
  socket.on("rtt:response", (data) => {
    const rtt = Date.now() - data.startTime;
    addRttMeasurement(rtt);
  });

  // 클라이언트당 5캐씩 braodcast
  setInterval(() => {
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      socket.emit("rtt:request", { startTime });
    }
  }, ONE_MINUTE);
}
// ----------------------------------------

/**
 * event listener
 */

// ----------------------------------------

// start game session
async function startGameSession() {
  // TODO : implement game logic
  console.log("game started.");
  io.in("gamesession").emit("game:start", {
    message: "Welcome to game session!",
  });

  const gameDuration = ONE_MINUTE / 4;
  let inverseElapsedTime = gameDuration;

  // 1초 마다 시간 감소
  const decrementTime = setInterval(() => {
    inverseElapsedTime -= 1000;
  }, 1000);

  const syncServerTime = setInterval(() => {
    io.in("gamesession").emit("game:time", {
      remain: inverseElapsedTime - rttAvg / 2, // RTT의 절반만큼 빼주어 전송 시간 보정
    });
  }, gameDuration / 2);

  const previousLeaderboard = await Leaderboard.find().sort({ point: -1 });
  setTimeout(() => {
    clearInterval(decrementTime);
    clearInterval(syncServerTime);

    // 게임 종료
    // score query
    Leaderboard.find()
      .sort({ point: -1 })
      .then((leaderboard) => {
        const deltaScores = leaderboard.map((user, index) => {
          const previousUser = previousLeaderboard.find(
            (prevUser) => prevUser.username === user.username
          );
          return {
            username: user.username,
            deltaScore: user.point - (previousUser ? previousUser.point : 0),
          };
        });
        io.to("gamesession").emit("game:end", { deltaScores });
        io.emit("game:update");

        for (let sock of lobby) {
          sock.leave("gamesession");
        }
      });
  }, gameDuration);
}

function enterLobby(socket) {
  socket.emit("lobby"); // TODO : delete this later
  lobby.push(socket);

  socket.on("disconnect", () => {
    lobby.splice(lobby.indexOf(socket), 1);
    console.log(`${socket.id} disconnected.`);
  });

  socket.on("game:exit", () => {
    socket.leave("gamesession");
  });

  measureRttMilliseconds(socket);
}

// invite players to game session.
function openGameSession() {
  lobby.forEach((socket) => console.log(socket.id));

  lobby.forEach((socket) => {
    socket.timeout(5000).emit("game:open", 8000, (err, response) => {
      if (err) {
        console.log(`${socket.id} reject invitation. reason: ${err}`);
      } else {
        console.log(`${socket.id} entered game sessions.`);
        socket.join("gamesession");
      }
    });
  });

  // wait for one minute before starting game session
  setTimeout(() => {
    startGameSession();
  }, 8000);
}

/**
 * Execution area
 */

setInterval(() => {
  openGameSession();
}, ONE_MINUTE / 2);

export { enterLobby };
