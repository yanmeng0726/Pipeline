import { Worker } from 'worker_threads';
import seedSchedules from './utils/seedSchedules.js';
import checkEarliesMidnightTime from './utils/checkEarliestMidnightTime.js';
import dotenv from 'dotenv';

dotenv.config({ override: false });
const n = process.env.SECOND ? process.env.SECOND : 5;
const runService = (id, oldGame) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/ingest.js', {
      workerData: { gameId: id, oldGame: oldGame }
    });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`stopped with  ${code} exit code`));
    });
  });
};

const gameSchedules = [];
let refreshScheduleTime = new Date();
let nextGame;
let oldGame;
setInterval(async () => {
  let currentTime = new Date();

  // auto pull schedule
  if (refreshScheduleTime - currentTime <= n * 1000 || checkEarliesMidnightTime(currentTime, n)) {
    refreshScheduleTime = await seedSchedules(refreshScheduleTime, gameSchedules);
    console.log('game schedule is ');
    console.dir(gameSchedules);
  }

  if (gameSchedules.length && !nextGame) {
    nextGame = gameSchedules.shift();
  }

  // if earliest game already started, start process;
  // if earliest game will start within next 5 mins, open thread
  if (nextGame && new Date(nextGame.time).getTime() - currentTime.getTime() < 0) {
    oldGame = true;
    await runService(nextGame.id, oldGame).catch((error) => {
      console.error(error);
    });
    nextGame = gameSchedules.length ? gameSchedules.shift() : null;
  } else if (
    nextGame &&
    new Date(nextGame.time).getTime() - currentTime.getTime() <= n * 60 * 1000
  ) {
    await runService(nextGame.id).catch((error) => {
      console.error(error);
    });
    nextGame = gameSchedules.length ? gameSchedules.shift() : null;
  }
}, n * 1000);
