import createGame from "../game-scripts/game.js";
import createKeyboardListener from "../game-scripts/keyboard-listener.js";
import renderScreen from "../game-scripts/render-screen.js";

const socket = io();

const game = createGame();
const keyboardListener = createKeyboardListener(document);

socket.on('connect', () => {
    const playerId = socket.id;
    const canvas = document.querySelector('#canvas');
    renderScreen(canvas, game, requestAnimationFrame, playerId);
});

socket.on('setup', state => {
    const playerId = socket.id;
    game.setState(state);

    keyboardListener.registerPlayerId(playerId);
    keyboardListener.subscribe(game.movePlayer);
    keyboardListener.subscribe(command => {
        socket.emit(command.type, command);
    });
});

socket.on('add-player', game.addPlayer);
socket.on('remove-player', game.removePlayer);
socket.on('add-fruit', game.addFruit);
socket.on('remove-fruit', game.removeFruit);

socket.on('move-player', command => {
    const playerId = socket.id;

    if (playerId !== command.playerId) game.movePlayer(command);
});