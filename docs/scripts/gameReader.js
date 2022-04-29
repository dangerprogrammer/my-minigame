import fs from 'fs';
const dir = "./game/";
const secDirs = ["game-scripts/"];
const filesGame = {};

const archives = fs.readdirSync(dir);

archives.forEach(async archive => {
    const file = fs.readFileSync(dir + archive);
    filesGame[archive] = file;
});

secDirs.forEach(secDir => {
    const archives = fs.readdirSync(`./${secDir}`);

    archives.forEach(async archive => {
        const file = fs.readFileSync(`./${secDir + archive}`);
        filesGame[secDir + archive] = file;
    });
});

export default filesGame;