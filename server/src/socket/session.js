const lobby = [];
const TEN_MINUTES = 1000 * 60 * 10;

// start game session
function startGameSession() {
  // TODO : implement game logic.e
}

function insertUserToGame() {}

function enterLobby(socket) {
  socket.emit("lobby"); // TODO : delete this later
  lobby.push(socket);

  socket.on("game:join", insertUserToGame);
}

// invite players to game session.
function openGameSession() {
  lobby.forEach((socket) => {
    socket.timeout(5000).emit("open_game", "open", (err, response) => {
      if (err) {
        console.log(`${socket.id} reject invitation. reason: ${err}`);
      } else {
        console.log(`${socket.id} entered game sessions.`);
      }
    });
  });

  // wait for one minute before starting game session
  setTimeout(() => {
    startGameSession();
  }, 1000 * 60);
}

setInterval(() => {
  openGameSession();
}, TEN_MINUTES);

export { enterLobby };
