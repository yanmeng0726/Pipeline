import { Worker } from 'worker_threads';
// import { getLiveData } from './ingest.js';

const runService = (id) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/ingest.js', { workerData: { gameId: id } });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(`stopped with  ${code} exit code`));
    });
  });
};
let num = 0;
setInterval(() => {
  fetch('https://statsapi.web.nhl.com/api/v1/schedule').then((response) =>
    response.json().then((body) => {
      console.dir('a');
      runService('2021021204').catch((error) => {});
    })
  );
}, 5000);

// getLiveData('2021021204');
