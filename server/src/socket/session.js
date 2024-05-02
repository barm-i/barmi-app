const lobby = [];
const TEN_MINUTES = 1000 * 60 * 10;
const ONE_MINUTE = 1000 * 60;
let io;

// start game session
function startGameSession() {
  // TODO : implement game logic
  console.log("game session started.");
  io.in("gamesession").emit("game:start", {
    message: "Welcome to game session!",
  });
}

function enterLobby(socket, ioInstance) {
  socket.emit("lobby"); // TODO : delete this later
  lobby.push(socket);
  io = ioInstance;
}

// invite players to game session.
function openGameSession() {
  lobby.forEach((socket) => {
    socket.timeout(5000).emit("game:open", "open", (err, response) => {
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
  }, ONE_MINUTE);
}

setInterval(() => {
  openGameSession();
}, TEN_MINUTES);

export { enterLobby };
