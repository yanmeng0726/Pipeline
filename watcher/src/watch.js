import { Worker } from 'worker_threads';
import KafkaService from './producer.js';
// import  getLiveData  from './ingest.js';

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

// seed data for teams
fetch('https://statsapi.web.nhl.com/api/v1/teams')
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  })
  .then((body) => {
    const teams = [];
    for (const team of body.teams) {
      const teamObj = { id: team.id, name: team.name };
      teams.push(teamObj);
    }
    KafkaService.sendRecord({ teams: teams });

    console.log("seeding team data ...")
  })
  .catch((response) => {
    console.error(response);
  });





// seed player basic info for schedule team 
fetch('https://statsapi.web.nhl.com/api/v1/schedule')
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(response);
  })
  .then((body) => {
    const liveLinks = []
    const games = []
    for (const game of body.dates[0]['games']) {
      liveLinks.push(game.link);
      const gameObj = {id : game.gamePk, awayTeam : game.teams.away.team.id, homeTeam:game.teams.home.team.id }
      games.push(gameObj)
    }
    KafkaService.sendRecord({ games: games });
    return liveLinks
  })
  .then(
    async function(liveLinks){
      const playerObjs =[]
      for (let liveLink of liveLinks) {
        let response = await fetch('https://statsapi.web.nhl.com'+liveLink);
        let body = await response.json();
        Object.keys(body.gameData.players).forEach((key) => {
          const player = body.gameData.players[key];
          const playObj = {
            id: player.id,
            name: player.fullName,
            age: player.currentAge,
            number: player.primaryNumber,
            position: player.primaryPosition.name,
            team: player.currentTeam.id
          };
          playerObjs.push( playObj);
        });
      }

      KafkaService.sendRecord({ players: playerObjs });
      console.log("seeding player data based on schedule ...")
    }
  )
  .catch((response) => {
    console.error(response.body);
  });


let num = 0;
// setInterval(() => {
  fetch('https://statsapi.web.nhl.com/api/v1/schedule').then((response) =>
    response.json().then((body) => {
      console.dir('fetching real time data...');
      if (num == 0) {
        runService('2022021218').catch((error) => {
          console.error(error);
        });
      }
      num++;
    })
  );
// },5000);

// getLiveData('2021021204');
