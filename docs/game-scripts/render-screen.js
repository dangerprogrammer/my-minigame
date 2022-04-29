export default function renderScreen(canvas, game, requestAnimationFrame, currentPlayerId) {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.clientHeight, canvas.width);
    for (const playerId in game.state.players) {
        const player = game.state.players[playerId];
        context.fillStyle = '#0002';
        context.fillRect(player.x, player.y, 1, 1);
    };

    for (const fruitId in game.state.fruits) {
        const fruit = game.state.fruits[fruitId];
        context.fillStyle = 'green';
        context.fillRect(fruit.x, fruit.y, 1, 1);
    };

    const currentPlayer = game.state.players[currentPlayerId];

    if (currentPlayer) {
        context.fillStyle = '#f0db4f';
        context.fillRect(currentPlayer.x, currentPlayer.y, 1, 1);
    };

    requestAnimationFrame(() => {
        renderScreen(canvas, game, requestAnimationFrame, currentPlayerId)
    });
};