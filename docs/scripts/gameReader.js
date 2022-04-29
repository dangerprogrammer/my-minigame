import fs from 'fs';
const dirs = ["game-scripts/", "game/", "node_modules/socket.io/client-dist/"];
const filesGame = {};

dirs.forEach(dir => {
    const archives = fs.readdirSync(`./${dir}`);

    if (dir === "node_modules/socket.io/") console.log(archives);

    archives.forEach(async archive => {
        const file = await fs.readFileSync(`./${dir + archive}`);
        filesGame[dir + archive] = file;
    });
});

export default filesGame;