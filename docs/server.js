import * as http from 'http';
import fs from 'fs';
import filesGame from "./scripts/gameReader.js";
import { Server } from 'socket.io';
import createGame from './game-scripts/game.js';
import { create } from 'domain';

const fileHTML = "index.html";
const mainFile = "server.js";

filesGame[mainFile] = fs.readFileSync(`./${mainFile}`);
filesGame[fileHTML] = fs.readFileSync(`./${fileHTML}`);

const host = "localhost";
const port = 8000;

function requestListener (req, res) {
  const routeSearch = req.url.slice(1);
  const routeType = routeSearch.split(".")[routeSearch.split(".").length - 1];

  if (!routeSearch) {
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      res.end(filesGame[fileHTML]);
  } else {
      const route = filesGame[routeSearch];
      if (!route) {
          res.setHeader("Content-Type", "text/html");
          res.writeHead(404);
          res.end(`A pagina ${routeSearch} nao existe no nosso sistema!`);
          console.log(`> Error: ${routeSearch}`);
          console.log(filesGame);
      } else {
          let textType;
          switch (routeType) {
              case 'js':
                  textType = "text/javascript";
                  break;
              default:
                  textType = "text/" + routeType;
                  break;
          }
          res.setHeader("Content-Type", textType);
          res.writeHead(200);
          res.end(route);
          console.log(routeSearch);
      };
  };
};

const server = http.createServer(requestListener);
const __dirname = fs.realpathSync('.');
fs.promises.readFile(`${__dirname}/${fileHTML}`)
.then(() => {
    server.listen(port, host, () => {
        console.clear();
        console.log(`Server link: http://${host}:${port}`);
    });
})
.catch(err => {
    console.log(`Não foi possível ler o caminho ${fileHTML}: ${err}`);
    process.exit(1);
});

const sockets = new Server(server);

const game = createGame();

game.start();

game.subscribe(command => {
    // console.log(`> Emitting ${command.type}`);
    sockets.emit(command.type, command);
});

sockets.on('connection', socket => {
  const playerId = socket.id;
  
  game.addPlayer({playerId});

  socket.emit('setup', game.state);

  socket.on('disconnect', () => {
      game.removePlayer({playerId});
  });

  socket.on('move-player', command => {
      command.playerId = playerId;
      command.type = 'move-player';

      game.movePlayer(command);
  });
});