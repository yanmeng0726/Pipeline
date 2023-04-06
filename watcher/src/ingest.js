import { workerData, parentPort } from 'worker_threads';
import fetch from 'node-fetch';
import _ from 'lodash';
import KafkaService from './producer.js';

parentPort.postMessage(getLiveData(workerData.gameId, workerData.oldGame));

let prevPlayersRealTimeStats = {};
let diffStats = [];

function getLiveData(gameId, oldGame) {
  let start = false;
  const playerObjs = [];
  fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`)
    .then((response) =>
      response
        .json()
        .then((body) => {
          Object.keys(body.gameData.players).forEach((key) => {
            const player = body.gameData.players[key];
            const playObj = {
              id: player.id,
              name: player.fullName,
              age: player.currentAge,
              number: player.primaryNumber,
              position: player.primaryPosition.name,
              team: player.currentTeam ? player.currentTeam.id : null
            };
            playerObjs.push(playObj);
          });
          KafkaService.sendRecord({ players: playerObjs });
          console.log('seeding player data based on schedule ...');
        })
        .catch((err) => console.dir(err))
    )
    .catch((err) => console.dir(err));

  let gameStartInterval = setInterval(() => {
    fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`).then((response) =>
      response.json().then((body) => {
        const status = body.gameData.status.statusCode;
        if (oldGame && status != 3 && status != 4) {
          ingest(gameId, gameStartInterval);
        } else {
          if (status == 3 || status == 4) {
            console.dir(`game ${gameId} starts....`);
            start = true;
            KafkaService.sendRecord({updateStatus :{  status: true, gameId: gameId }});
            clearInterval(gameStartInterval);
          }
        }
      })
    );
  }, 1000);

  let intervalId = setInterval(() => {
    if (start) {
      ingest(gameId, intervalId);
    }
  }, 1000);
}

function ingest(gameId, intervalId) {
  fetch(`https://statsapi.web.nhl.com/api/v1/game/${gameId}/feed/live`).then((response) =>
    response
      .json()
      .then((body) => {
        const status = body.gameData.status.statusCode;
        const playerRealTimeStats = {};
        Object.keys(body.liveData.boxscore.teams.away.players).forEach((key) => {
          if (!playerRealTimeStats[key]) {
            playerRealTimeStats[key] = { game: gameId };
          }
          const stats = body.liveData.boxscore.teams.away.players[key].stats.skaterStats;
          if (stats) {
            playerRealTimeStats[key].assists = stats.assists;
            playerRealTimeStats[key].hits = stats.hits;
            playerRealTimeStats[key].goals = stats.goals;
            playerRealTimeStats[key].points =
              playerRealTimeStats[key].assists + playerRealTimeStats[key].goals;
            playerRealTimeStats[key].penaltyMinutes = stats.penaltyMinutes;
          }
        });

        Object.keys(body.liveData.boxscore.teams.home.players).forEach((key) => {
          if (!playerRealTimeStats[key]) {
            playerRealTimeStats[key] = { game: gameId };
          }
          const stats = body.liveData.boxscore.teams.home.players[key].stats.skaterStats;
          if (stats) {
            playerRealTimeStats[key].assists = stats.assists;
            playerRealTimeStats[key].hits = stats.hits;
            playerRealTimeStats[key].goals = stats.goals;
            playerRealTimeStats[key].points =
              playerRealTimeStats[key].assists + playerRealTimeStats[key].goals;
            playerRealTimeStats[key].penaltyMinutes = stats.penaltyMinutes;
          }
        });

        Object.keys(playerRealTimeStats).forEach((key) => {
          if (!_.isEqual(prevPlayersRealTimeStats[key], playerRealTimeStats[key])) {
            diffStats.push({
              id: key.substring(2),
              assists: playerRealTimeStats[key].assists,
              goals: playerRealTimeStats[key].goals,
              hits: playerRealTimeStats[key].hits,
              points: playerRealTimeStats[key].points,
              penaltMinutes: playerRealTimeStats[key].penaltyMinutes,
              game: gameId
            });
          }
        });
        if (diffStats.length) {
          console.dir('stats changes, sending to writer...');
          KafkaService.sendRecord({ stats: diffStats });
        }
        diffStats = [];
        prevPlayersRealTimeStats = playerRealTimeStats;
  

        if (status != 3 && status != 4) {
          console.dir(`game ${gameId} ended....`);
          KafkaService.sendRecord({ updateStatus:{status:  false, gameId: gameId} });
          clearInterval(intervalId);
        }
      })
      .catch((err) => console.dir(err))
  );
}

