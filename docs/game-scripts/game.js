export default function createGame() {
    const state = {
        players: {},
        fruits: {},
        canvas: {
            height: 20,
            width: 20
        }
    };

    const observers = [];

    function start() {
        const frequency = 1e4;

        setInterval(addFruit, frequency);
    };

    function subscribe(observerFunction) {
        observers.push(observerFunction);
    };

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command);
        };
    };

    function setState(newState) {
        Object.assign(state, newState);
    };

    function addPlayer(command) {
        const playerId = command.playerId;
        const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.canvas.width);
        const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.canvas.height);

        state.players[playerId] = {
            x: playerX,
            y: playerY
        };

        notifyAll({
            type: 'add-player',
            playerId, playerX, playerY
        });
    };

    function removePlayer(command) {
        const playerId = command.playerId;

        delete state.players[playerId];

        notifyAll({
            type: 'remove-player',
            playerId
        });
    };

    function addFruit(command) {
        const fruitId = command ? command.fruitId : Math.floor(Math.random() * 1000000);
        const fruitX = command ? command.fruitX : Math.floor(Math.random() * state.canvas.width);
        const fruitY = command ? command.fruitY : Math.floor(Math.random() * state.canvas.height);

        state.fruits[fruitId] = {
            x: fruitX,
            y: fruitY
        };

        notifyAll({
            type: 'add-fruit',
            fruitId, fruitX, fruitY
        });
    };

    function removeFruit(command) {
        const fruitId = command.fruitId;

        delete state.fruits[fruitId];

        notifyAll({
            type: 'remove-fruit',
            fruitId
        });
    };

    function movePlayer(command) {
        const acceptedMoves = {
            ArrowUp(player) {
                player.y--;
                if (player.y < 0) player.y += state.canvas.height;
            },
            ArrowDown(player) {
                player.y++;
                if (player.y >= state.canvas.height) player.y -= state.canvas.height;
            },
            ArrowLeft(player) {
                player.x--;
                if (player.x < 0) player.x += state.canvas.width;
            },
            ArrowRight(player) {
                player.x++;
                if (player.x >= state.canvas.width) player.x -= state.canvas.width;
            }
        };

        const keyPressed = command.keyPressed;
        const playerId = command.playerId;
        const player = state.players[playerId];
        const moveFunction = acceptedMoves[keyPressed];

        if (player && moveFunction) {
            moveFunction(player);
            checkForFruitCollision(playerId);
        };
        
        notifyAll(command);
    };

    function checkForFruitCollision(playerId) {
        const player = state.players[playerId];

        for (const fruitId in state.fruits) {
            const fruit = state.fruits[fruitId];
            if (player.x === fruit.x && player.y === fruit.y) removeFruit({fruitId});
        };
    };

    return {
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state,
        setState,
        subscribe,
        start
    };
};