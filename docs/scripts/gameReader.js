import fs from 'fs';
const dirs = ["game-scripts/", "game/"];
const filesGame = {};

dirs.forEach(dir => {
    const archives = fs.readdirSync(`./${dir}`);

    archives.forEach(async archive => {
        const file = fs.readFileSync(`./${dir + archive}`);
        filesGame[dir + archive] = file;
    });
});

export default filesGame;